"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const videoData = require("./data-videos");

// if video videoId is valid then stream video
async function streamVideo(videoID, displayCompressedVideo, request, response){
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
  } else if (typeof displayCompressedVideo !== "boolean") {
    return {
      status: 404,
      redirect: "/",
      message: "displayCompressedVideo-not-boolean"
    };
  } else if (request === undefined) {
    return {
      status: 404,
      redirect: "/",
      message: "request-undefined"
    };
  } else if (response === undefined) {
    return {
      status: 404,
      redirect: "/",
      message: "response-undefined"
    };
  } else {
    try {
      let videoPath, videoType;
      const videoDetails = videoData.getVideoData([`${videoID}`]);
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
          return {
            status: 416,
            redirect: "/",
            message: "requested-range-not-satisfiable-to-stream-video"
          };
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
        return {
          status: 206,
          message: file.pipe(response)
        };
      } else { // send whole video file
        const head = {
          "Content-Length": fileSize,
          "Content-Type":  videoType,
        };
        response.writeHead(200, head);
        const file = FileSystem.createReadStream(videoPath); 
        return {
          status: 200,
          message: file.pipe(response)
        };
      }
    } catch (e) { // if error redirect to home page
      return {
        status: 404,
        redirect: "/",
        message: "failed-to-stream-video"
      };
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
            message: "failed-to-stream-image"
          };
        }
      });
      return {
        status: 200,
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