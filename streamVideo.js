"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const youtubedl = require("youtube-dl");
const data_videos  = FileSystem.readFileSync("data/data-videos.json");
let videoData = JSON.parse(data_videos);
const available_videos  = FileSystem.readFileSync("data/available-videos.json");
let availableVideos = JSON.parse(available_videos);
const ffprobe_path = "./ffprobe.exe";
const ffmpeg_path = "./ffmpeg.exe";
// check if id provided is corresponding to videos
function findVideosByID(id){
  if (videoData[id] === undefined) { // if id is invalid
    return undefined;
  } else { // if valid return videos[id]
    return videoData[id];
  }
}

function getAllAvailableVideos(){
    return availableVideos;
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
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          /// log something maybe
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting stream download"
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          videoData[`${fileName}`] = {
            video: {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              timemark : data.timemark,
              download : "downloading"
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

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
          videoData[`${fileName}`] = {
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

          const newData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newData);
          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadVideoStream]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        // .addInputOption('-i')
        .outputOptions(["-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        // .outputOptions(['-c copy'])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
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
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting full video download"
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType: req.body.videoType,
              download: data.percent
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        })
        .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          videoData[`${fileName}`] = {
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
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
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
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData[`${fileName}`] = {
            video:{
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting trim video download"
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc: req.body.videoSrc,
              originalVideoType: req.body.videoType,
              newVideoStartTime: req.body.newStartTime,
              newVideoEndTime: req.body.newEndTime,
              download: data.percent
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        })
        .on("end", function() {
          videoData[`${fileName}`] = {
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
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-trimVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        // .addInputOption("-y")
        .outputOptions([`-ss ${start}`, `-t ${(end-start)}`, "-vcodec copy", "-acodec copy"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
  }
}


async function createThumbnail(videofile, newFilePath, fileName) {
  const imageFileName = "thumbnail";
  const fileType = ".jpg";
  const numberOfImages = 8;
  let duration = 0;
  let numberOfCreatedScreenshots = 0;
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
              numberOfCreatedScreenshots = data.frames;
              /// do stuff with progress data if you wan
              videoData[`${fileName}`]["thumbnail"].download =  data.percent;
              const newVideoData = JSON.stringify(videoData, null, 2);
              FileSystem.writeFileSync("data/data-videos.json", newVideoData);
              console.log("progress", data);
          })
          .on("end", () => {
              /// encoding is complete, so callback or move on at this point
              for (let i = 0; i < numberOfCreatedScreenshots + 1; i++) {
                if (i == 0){
                  availableVideos[`${fileName}`] = {
                    info:{
                      videoLink: {
                        src : `/video/${fileName}`,
                        type : "video/mp4"
                      },
                      thumbnailLink: {
                      }
                    }
                  };
                } else if (i < 10) {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}00${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                } else if (i < 100) {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}0${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                } else {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                }
                if (i == numberOfCreatedScreenshots) {
                  videoData[`${fileName}`]["thumbnail"].download = "completed";
                }
              }

              const newVideoData = JSON.stringify(videoData, null, 2);
              FileSystem.writeFileSync("data/data-videos.json", newVideoData);

              const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
              FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
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

// deletes everything that is available in the system related to video id, video file, all available video data ...
async function deletevideoData(request, response, videoID) {
    const filepath = `media/video/${videoID}`;
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else {
     try {
       // move video file to deleted-videos folder
       // if video is active it will make the video not viewable if someone wants to view it
       FileSystem.rename(videoDetails.video.path, `media/deleted-videos/deleted-${videoID}.mp4`,  (err) => {
         if (err) throw err;
        console.log(`\n moved ${videoDetails.video.path} to  media/deleted-videos/deleted-${videoID}.mp4 \n`);
        //  delete the video
        FileSystem.unlink(`media/deleted-videos/deleted-${videoID}.mp4`, (err) => {
          if (err) throw err;
          console.log(`\n unlinked media/deleted-videos/deleted-${videoID}.mp4 video file \n`);
        });
        //  delete folder Content
        FileSystem.rmdir(filepath, { recursive: true }, (err) => {
          if (err) throw err;
          console.log(`\n removed ${filepath} dir \n`);
        });
        // delete video data from database
         delete videoData[videoID];
         delete availableVideos[videoID];

         const newVideoData = JSON.stringify(videoData, null, 2);
         FileSystem.writeFileSync("data/data-videos.json", newVideoData);

         const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
         FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
         console.log(`\n ${filepath} is deleted! \n`);
         response.json(`video-id-${videoID}-data-permanently-deleted`);
      });
     } catch (e) {
       console.log(`failed to delete ${videoDetails.video.path}`);
     }
  }
}

// using youtube-dl it converts url link to video type and video src
async function getVideoLinkFromUrl(req, res) {
  try {
    const url = req.body.url;
    // Optional arguments passed to youtube-dl.
    const options = ["--skip-download"];
    youtubedl.getInfo(url, options, function(err, info) {
     // info.protocol
     // protocol: https or http == video/mp4
     // protocol: http_dash_segments == application/dash+xml
     // protocol: m3u8 == application/x-mpegURL
     let videoFileFormat, videoUrlLink;
     if (info !== undefined) {
       if (info.protocol == "https" || info.protocol == "http") {
         videoUrlLink = info.url;
         videoFileFormat = "video/mp4";
       } else if (info.protocol == "m3u8") {
         videoUrlLink = info.url;
         videoFileFormat = "application/x-mpegURL";
       } else if (info.protocol == "http_dash_segments") {
         videoUrlLink = info.url;
         videoFileFormat = "application/dash+xml";
       } else {
         videoUrlLink = "not-supported";
         videoFileFormat = "not-supported";
       }
     } else {
       videoUrlLink = "not-supported";
       videoFileFormat = "not-supported";
     }
     const videoDataFromUrl = {
       input_url_link: url,
       video_url: videoUrlLink,
       video_file_format: videoFileFormat
     };
     if (videoUrlLink !== "not-supported" || videoFileFormat !== "not-supported") {
       res.json(videoDataFromUrl);
     } else {
       res.json("failed-get-video-url-from-provided-url");
     }
    });
  } catch (e) {
    res.json("failed-get-video-url-from-provided-url");
  }
}

module.exports = { // export modules
  streamVideo,
  downloadVideoStream,
  downloadVideo,
  stopDownloadVideoStream,
  trimVideo,
  findVideosByID,
  getAllAvailableVideos,
  streamThumbnail,
  deletevideoData,
  getVideoLinkFromUrl
};
