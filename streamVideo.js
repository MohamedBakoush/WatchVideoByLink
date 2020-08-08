"use strict";
const FileSystem = require("fs");
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
      const path = videoDetails.path;
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

  const videoDetails = await findVideosByID(fileName);

  if (videoDetails == undefined) {
    command.addInput(videofile)
      .on("start", function() {
          // res.json("downloadingVideoFile");
          res.json(fileName);
          /// log something maybe
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "download": "starting stream download"
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "timemark": data.timemark,
            "download": "downloading"
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
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            path: filepath+fileName+fileType,
            "videoType": "video/mp4",
            "download": "complete"
          };

          const newData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newData);

          console.log("Video Transcoding succeeded !");
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      // .addInputOption('-i')
      .outputOptions(["-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
      // .outputOptions(['-c copy'])
      .output(`${filepath}${fileName}${fileType}`)
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

  const videoDetails = await findVideosByID(fileName);

  if (videoDetails == undefined) {
    command.addInput(videofile)
      .on("start", function() {
          res.json(fileName);
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "download": "starting full video download"
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "download": data.percent
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);

      })
      .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            path: filepath+fileName+fileType,
            "videoType": "video/mp4",
            "download": "complete"
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);
          console.log("Video Transcoding succeeded !");
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
      .output(`${filepath}${fileName}${fileType}`)
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
  console.log(videofile);
  console.log(start);
  console.log(end);
  const videoDetails = await findVideosByID(fileName);
  if (videoDetails == undefined) {
    command.addInput(videofile)
      .on("start", function() {
          res.json(fileName);
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "download": "starting trim video download"
          };

          const newVideoData = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideoData);
      })
      .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videos[`${fileName}`] = {
            "originalVideoSrc": req.body.videoSrc,
            "originalVideoType": req.body.videoType,
            "newVideoStartTime": req.body.newStartTime,
            "newVideoEndTime": req.body.newEndTime,
            "download": data.percent
          };

          const newVideo = JSON.stringify(videos, null, 2);
          FileSystem.writeFileSync("data/videos.json", newVideo);
      })
      .on("end", function() {
        videos[`${fileName}`] = {
          "originalVideoSrc": req.body.videoSrc,
          "originalVideoType": req.body.videoType,
          "newVideoStartTime": req.body.newStartTime,
          "newVideoEndTime": req.body.newEndTime,
          path: filepath+fileName+fileType,
          "videoType": "video/mp4",
          "download": "complete"
        };

        const newVideo = JSON.stringify(videos, null, 2);
        FileSystem.writeFileSync("data/videos.json", newVideo);
        console.log("Video Transcoding succeeded !");
      })
      .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
      })
      // .addInputOption("-y")
      .outputOptions([`-ss ${start}`, `-t ${(end-start)}`, "-vcodec copy", "-acodec copy"])
      .output(`${filepath}${fileName}${fileType}`)
      .run();
    } else {
      console.log("videoDetails exits");
    }
}

module.exports = { // export modules
  streamVideo,
  downloadVideoStream,
  downloadVideo,
  stopDownloadVideoStream,
  trimVideo,
  findVideosByID
};
