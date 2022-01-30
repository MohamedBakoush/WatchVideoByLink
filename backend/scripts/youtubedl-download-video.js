"use strict";
const { v4: uuidv4 } = require("uuid");
const youtubedl = require("youtube-dl");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");

// using youtube-dl it converts url link to video type and video src
async function getVideoLinkFromUrl(url) {
  if (typeof url !== "string") {
    return "failed-get-video-url-from-provided-url";
  } else {
    const fileName = uuidv4();
    ffmpegDownloadResponse.updateDownloadResponse([fileName], {
      "fileName": fileName,
      "message": "initializing"
    });
    try {
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
          if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
              ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], videoDataFromUrl);
          }
          return {
              "fileName": fileName,
              "message": videoDataFromUrl
          };
        } else {
          if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
              ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "failed-get-video-url-from-provided-url");
          }
          return {
              "fileName": fileName,
              "message": "failed-get-video-url-from-provided-url"
          };
        }
      });
      return {
          "fileName": fileName,
          "message": "initializing"
      };
    } catch (e) {
      if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
          ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "failed-get-video-url-from-provided-url");
      } 
      return {
        "fileName": fileName,
        "message": "failed-get-video-url-from-provided-url"
      };
    }
  }
}

module.exports = { // export modules
  getVideoLinkFromUrl
};
