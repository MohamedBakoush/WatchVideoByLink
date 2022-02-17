"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const videoData = require("./data-videos");

// if video videoId is valid then stream video
async function streamVideo(request, response, videoID, displayCompressedVideo){
  // check if videoid is valid
  const videoDetails = await videoData.findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else { // if videoID is valid
    try {
      // variables
      let videoPath, videoType;
      if (displayCompressedVideo) { // update videoPath, videoType with compressed video details
        videoPath = videoDetails.compression.path; 
        videoType = videoDetails.compression.videoType; 
      } else { // update videoPath, videoType with original video details
        videoPath = videoDetails.video.path; 
        videoType = videoDetails.video.videoType; 
      }
      // getting the video file size
      const stat = FileSystem.statSync(videoPath);
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
        const file = FileSystem.createReadStream(videoPath, {start, end});
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type":  videoType,
        };
        // send newly made stream to the client
        response.writeHead(206, head);
        file.pipe(response);
      } else { // send whole video file
        const head = {
          "Content-Length": fileSize,
          "Content-Type":  videoType,
        };
        response.writeHead(200, head);
        FileSystem.createReadStream(videoPath).pipe(response);
      }
    } catch (e) { // if error redirect to home page
      response.status(404).redirect("/");
    }
  }
}

// streams available thumbnail images  provided by videoID and thumbnailID
async function streamThumbnail(videoID, thumbnailID, response) {
  if (typeof videoID !== "string") {
    return {
      status: 404,
      redirect: "/",
      message: "videoID-not-string"
    };
  } else if (videoData.getVideoData([`${videoID}`]) == undefined) {
    return {
      status: 404,
      redirect: "/",
      message: "invalid-videoID"
    };
  } else if (isNaN(thumbnailID)) {
    return {
      status: 404,
      redirect: "/",
      message: "thumbnailID-not-number"
    };
  } else if (videoData.getVideoData([`${videoID}`, "thumbnail", "path", `${thumbnailID}`]) == undefined) {
    return {
      status: 404,
      redirect: "/",
      message: "invalid-thumbnailID"
    };
  } else if (response == undefined) {
    return {
      status: 404,
      redirect: "/",
      message: "response-undefined"
    };
  } else {
    try {
      const path = videoData.getVideoData([`${videoID}`, "thumbnail", "path", `${thumbnailID}`]);
      const file = FileSystem.createReadStream(path); // or any other way to get a readable stream
      const ps = new stream.PassThrough(); // <---- this makes a trick with stream error handling
      stream.pipeline(file, ps, (err) => {
        if (err) {
          return {
            status: 400,
            redirect: "/",
            message: err
          };
        }
      });
      return {
        status: 200,
        redirect: undefined,
        message: ps.pipe(response)
      };
    } catch (error) {
      return {
        status: 404,
        redirect: "/",
        message: "failed-to-stream-image"
      };
    }
  }
}

module.exports = { // export modules
    streamVideo,
    streamThumbnail
};