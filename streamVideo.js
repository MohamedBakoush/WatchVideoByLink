"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const data_videos  = FileSystem.readFileSync("data/videos.json");
let videos = JSON.parse(data_videos);

// check if id provided is corresponding to videos
function findVideosByID(id){
  if (videos[id] === undefined) { // if id is invalid
    return undefined;
  } else { // if valid return videos[id]
    return videos[id];
  }
}

async function streamVideo(request, response, videoID){
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else { // if videoID is valid
    try {
      // path of video file
      const path = videoDetails.video.path;
      // getting the video file size
      const stat = FileSystem.statSync(path);
      const fileSize = stat.size;
      // requests occur when a client asks the server for only a portion of the requested file.
      const range = request.headers.range;
      // send partial content of video file
      if (range) {
        // split up beginning and end of request range
        const parts = range.replace(/bytes=/, "").split("-");
        // beginning of the request range
        const start = parseInt(parts[0], 10);
        // end of the requested range
        const end = parts[1]
          ? parseInt(parts[1], 10) // if
          : fileSize-1; // else
        // when video start file size is greater or equal to video file Size
        // send 416 error
        if(start >= fileSize) {
          response.status(416).send("Requested range not satisfiable\n"+start+" >= "+fileSize);
          return;
        }
        // The size of the chunks
        const chunksize = (end-start)+1;
        // Creating the stream
        const file = FileSystem.createReadStream(path, {start, end});
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };
        // send newly made stream to the client
        response.writeHead(206, head);
        file.pipe(response);
      } else { // send whole video file
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        response.writeHead(200, head);
        FileSystem.createReadStream(path).pipe(response);
      }
    } catch (e) { // if error redirect to home page
      response.status(404).redirect("/");
    }
  }
}

async function streamThumbnail(request, response, videoID, thumbnailID) {
  const videoDetails = await findVideosByID(videoID);
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  }else {
    try {
      const path = videoDetails["thumbnail"]["path"][`${thumbnailID}`];
      const file = FileSystem.createReadStream(path); // or any other way to get a readable stream
      const ps = new stream.PassThrough(); // <---- this makes a trick with stream error handling
      stream.pipeline(
       file,
       ps, // <---- this makes a trick with stream error handling
       (err) => {
        if (err) {
          console.log(err); // No such file or any other kind of error
          return response.sendStatus(400);
        }
      });
      ps.pipe(response); // <---- this makes a trick with stream error handling
    } catch (e) {
      response.status(404).redirect("/");
    }
  }
}

const stop = (stream) => {
  return stream.ffmpegProc.stdin.write("q");
};

let fileNameID;
let stopVideoFileBool = false;
function stopDownloadVideoStream(req, res) {
   stopVideoFileBool = req.body.bool;
   fileNameID = req.body.fileNameID;
   res.json("stopedVideoFileFromDownloading");
}

async function downloadVideoStream(req, res) {
  const command = new ffmpeg();
  const videofile = req.body.videoSrc;
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;

  const videoDetails = await findVideosByID(fileName);

  if (videoDetails == undefined) {
    if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
        FileSystem.mkdirSync(`${filepath}${fileName}/`);
    }
    command.addInput(videofile)
      .on("start", function() {
          // res.json("downloadingVideoFile");
          res.json(fileName);
          /// log something maybe
          videos[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting stream download"
            }
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          videos[`${fileName}`] = {
            video: {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              timemark : data.timemark,
              download : "downloading"
            }
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);

          console.log("progress", data);
          if (stopVideoFileBool === true  && fileNameID == fileName) {
            try {
              stop(command);
              stopVideoFileBool = false;
            } catch (e) {
              stopVideoFileBool = false;
            }
          }
      })
      .on("end", function() {
          /// encoding is complete, so callback or move on at this point

          videos[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              path: newFilePath+fileName+fileType,
              videoType : "video/mp4",
              download : "completed",
            },
            thumbnail: {
              path: {},
              download: "starting"
            }
          };

          const newData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newData);
          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          createThumbnail(path, newFilePath, fileName);
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      // .addInputOption('-i')
      .outputOptions(["-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
      // .outputOptions(['-c copy'])
      .output(`${newFilePath}${fileName}${fileType}`)
      .run();
    } else {
      console.log("videoDetails exits");
    }
}


async function downloadVideo(req, res) {
  const command = new ffmpeg();
  const videofile = req.body.videoSrc;
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await findVideosByID(fileName);

  if (videoDetails == undefined) {
    if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
        FileSystem.mkdirSync(`${filepath}${fileName}/`);
    }
    command.addInput(videofile)
      .on("start", function() {
          res.json(fileName);
          videos[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting full video download"
            }
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videos[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType: req.body.videoType,
              download: data.percent
            }
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);

      })
      .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          videos[`${fileName}`] = {
            video: {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              path: newFilePath+fileName+fileType,
              videoType : "video/mp4",
              download : "completed",
            },
            thumbnail: {
              path: {},
              download: "starting"
            }
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);
          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          createThumbnail(path, newFilePath, fileName);
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
      .output(`${newFilePath}${fileName}${fileType}`)
      .run();
    } else {
      console.log("videoDetails exits");
    }
}

async function trimVideo(req, res) {
  const command = new ffmpeg();
  const videofile = req.body.videoSrc;
  const start = req.body.newStartTime;
  const end = req.body.newEndTime;
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await findVideosByID(fileName);
  if (videoDetails == undefined) {
    if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
        FileSystem.mkdirSync(`${filepath}${fileName}/`);
    }
    command.addInput(videofile)
      .on("start", function() {
          res.json(fileName);
          videos[`${fileName}`] = {
            video:{
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting trim video download"
            }
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videos[`${fileName}`] = {
            video : {
              originalVideoSrc: req.body.videoSrc,
              originalVideoType: req.body.videoType,
              newVideoStartTime: req.body.newStartTime,
              newVideoEndTime: req.body.newEndTime,
              download: data.percent
            }
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);
      })
      .on("end", function() {
        videos[`${fileName}`] = {
          video: {
            originalVideoSrc: req.body.videoSrc,
            originalVideoType: req.body.videoType,
            newVideoStartTime: req.body.newStartTime,
            newVideoEndTime: req.body.newEndTime,
            path: newFilePath+fileName+fileType,
            videoType: "video/mp4",
            download: "completed"
          },
          thumbnail: {
            path: {},
            download: "starting"
          }
        };
        const newVideo = JSON.stringify(videos, null, 2);
        FileSystem.writeFileSync("data/videos.json", newVideo);
        console.log("Video Transcoding succeeded !");
        const path = newFilePath+fileName+fileType;
        createThumbnail(path, newFilePath, fileName);
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      // .addInputOption("-y")
      .outputOptions([`-ss ${start}`, `-t ${(end-start)}`, "-vcodec copy", "-acodec copy"])
      .output(`${newFilePath}${fileName}${fileType}`)
      .run();
    } else {
      console.log("videoDetails exits");
    }
}


async function createThumbnail(videofile, newFilePath, fileName) {
  const imageFileName = "thumbnail";
  const fileType = ".jpg";
  const numberOfImages = 8;
  let duration = 0;

  ffmpeg.ffprobe(videofile, (error, metadata) => {
    duration = metadata.format.duration;
    console.log(duration);
    if (duration > 0) {
      const command = new ffmpeg();
        command.addInput(videofile)
          .on("start", () => {
            console.log("start createThumbnail");
          })
          .on("progress", (data) => {
              /// do stuff with progress data if you wan
              videos[`${fileName}`]["thumbnail"].download =  data.percent;
              const newVideo = JSON.stringify(videos, null, 2);
              FileSystem.writeFileSync("data/videos.json", newVideo);
              console.log("progress", data);
          })
          .on("end", () => {
              /// encoding is complete, so callback or move on at this point
              videos[`${fileName}`]["thumbnail"].path = {
                1 : `${newFilePath}${imageFileName}001${fileType}`,
                2 : `${newFilePath}${imageFileName}002${fileType}`,
                3 : `${newFilePath}${imageFileName}003${fileType}`,
                5 : `${newFilePath}${imageFileName}004${fileType}`,
                4 : `${newFilePath}${imageFileName}005${fileType}`,
                6 : `${newFilePath}${imageFileName}006${fileType}`,
                7 : `${newFilePath}${imageFileName}007${fileType}`,
                8 : `${newFilePath}${imageFileName}008${fileType}`
              };
              videos[`${fileName}`]["thumbnail"].download = "completed";

              videos[`${fileName}`].info = {
                id : fileName,
                videoLink: `/video/${fileName}`,
                thumbnailLink: {
                  1 : `/thumbnail/${fileName}/1`,
                  2 : `/thumbnail/${fileName}/2`,
                  3 : `/thumbnail/${fileName}/3`,
                  5 : `/thumbnail/${fileName}/4`,
                  4 : `/thumbnail/${fileName}/5`,
                  6 : `/thumbnail/${fileName}/6`,
                  7 : `/thumbnail/${fileName}/7`,
                  8 : `/thumbnail/${fileName}/8`,
                }
              };

              const newVideo = JSON.stringify(videos, null, 2);
              FileSystem.writeFileSync("data/videos.json", newVideo);
              console.log("Image Thumbnails succeeded !");
          })
          .on("error", (error) => {
              /// error handling
              console.log(`Encoding Error: ${error.message}`);
          })
          .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
          .output(`${newFilePath}${imageFileName}%03d${fileType}`)
          .run();
    }
  });
}

module.exports = { // export modules
  streamVideo,
  downloadVideoStream,
  downloadVideo,
  stopDownloadVideoStream,
  trimVideo,
  findVideosByID,
  streamThumbnail
};
