"use strict";
const { v4: uuidv4 } = require("uuid");
const youtubedl = require("youtube-dl");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");

// using youtube-dl it converts url link to video type and video src
async function getVideoLinkFromUrl(url) {
  if (typeof url !== "string") {
    return "url not string";
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
        const youtubedl_info = youtubedl_get_Info(info, url);
        if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
          ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], youtubedl_info);
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

// info.protocol: https or http == video/mp4
// info.protocol: http_dash_segments == application/dash+xml
// info.protocol: m3u8 == application/x-mpegURL
function youtubedl_get_Info(info, url) {
  if (typeof info !== "object") {
    return "info not object";
  } else if (typeof info.protocol !== "string") {
    return "info.protocol not string";
  } else if (typeof info.url !== "string") {
    return "info.url not string";
  } else if (typeof url !== "string") {
    return "url not string";
  } else {
    let videoFileFormat, videoUrlLink;
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
    if (videoUrlLink !== "not-supported" || videoFileFormat !== "not-supported") {
      return {
        input_url_link: url,
        video_url: videoUrlLink,
        video_file_format: videoFileFormat
      };
    } else {
      return "failed-get-video-url-from-provided-url";
    }
  }
}

module.exports = { // export modules
  getVideoLinkFromUrl,
  youtubedl_get_Info
};
