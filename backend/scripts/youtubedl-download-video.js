"use strict";
const { v4: uuidv4 } = require("uuid");
const youtube_dl = require("youtube-dl-exec");
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
    const options = {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      skipDownload: true,
      referer: url
    };
    youtube_dl(url, options).then((info) => {  
      const youtubedl_info = youtubedl_get_Info(info, url);
      if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
        ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], youtubedl_info);
      }
    }).catch(() => {
      if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
          ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "failed-get-video-url-from-provided-url");
      } 
    });
    return {
        "fileName": fileName,
        "message": "initializing"
    };
  }
}

// info.protocol: https or http == video/mp4
// info.protocol: http_dash_segments == application/dash+xml
// info.protocol: m3u8 == application/x-mpegURL
function youtubedl_get_Info(info, url) {
  if (typeof info !== "object") {
    return "info not object";
  } else if (info.formats == undefined) {
    return "info.formats undefined";
  } else if (!Array.isArray(info.formats)) {
    return "info.formats not array";
  } else if (info.formats.length == 0) {
    return "info.formats empty";
  } else if (typeof url !== "string") {
    return "url not string";
  } else {
    let videoUrlLink = "not-supported";
    let videoFileFormat = "not-supported";
    for (let i = (info.formats.length - 1); i >= 0; i--) {
      if (info.formats[i].url == undefined || info.formats[i].protocol == undefined) {
        videoUrlLink = "not-supported";
        videoFileFormat = "not-supported";
      } else if (info.formats[i].protocol == "https" || info.formats[i].protocol == "http") {
        videoUrlLink = info.formats[i].url;
        videoFileFormat = "video/mp4";
        break; 
      } else if (info.formats[i].protocol == "m3u8") {
        videoUrlLink = info.formats[i].url;
        videoFileFormat = "application/x-mpegURL";
        break; 
      } else if (info.formats[i].protocol == "http_dash_segments") {
        videoUrlLink = info.formats[i].url;
        videoFileFormat = "application/dash+xml";
        break; 
      } else {
        videoUrlLink = "not-supported";
        videoFileFormat = "not-supported";
      }
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
