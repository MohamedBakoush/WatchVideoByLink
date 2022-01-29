"use strict";
const ffmpeg = require("fluent-ffmpeg");
const currentDownloadVideos = require("./current-download-videos");
const availableVideos = require("./available-videos");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");
let compression_download_fileNameID, stop_compression_download_bool;

// get download compression fileNameID
function get_download_compression_fileNameID() {
    if (compression_download_fileNameID !== undefined) {
        return compression_download_fileNameID;
    } else  {
        return undefined;
    } 
}

// update download compression fileNameID
function update_download_compression_fileNameID(new_fileNameID){ 
  if (typeof new_fileNameID !== "string") {
    return "fileNameID not string";
  } else {
    compression_download_fileNameID = new_fileNameID;
    return compression_download_fileNameID;
  }
}

// get stop download compression bool
function get_stop_compression_download_bool(){ 
    if (stop_compression_download_bool !== undefined) {
        return stop_compression_download_bool;
    } else  {
        stop_compression_download_bool = false;
    } 
}

// update stop download compression bool
function update_stop_compression_download_bool(bool){ 
  if (typeof bool !== "boolean") {
    return "input not boolean";
  } else {
    stop_compression_download_bool = bool;
    return stop_compression_download_bool;
  }
}

// check if video compression is downloading
// if true then update stopCompressedVideoFileBool and fileNameID_Compression variable and return true
// else return false
function stopCommpressedVideoDownload(fileName) { 
  try {
    let videoDataCompressionProgress, currentDownloadCompressionProgress; 

    const videoDataDownloadStatus = videoData.getVideoData([`${fileName}`,"compression", "download"]) ;
    if (videoDataDownloadStatus !== undefined) {
      videoDataCompressionProgress = videoDataDownloadStatus;
    } else {
      videoDataCompressionProgress = false;
    }

    const currentDownloadsDownloadStatus = currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]); 
    if (currentDownloadsDownloadStatus !== undefined) {
      currentDownloadCompressionProgress = currentDownloadsDownloadStatus;
    } else {
      currentDownloadCompressionProgress = false;
    } 

    if (videoDataCompressionProgress) {
      if (videoDataCompressionProgress == "completed") {   
        return false; 
      } else if (currentDownloadCompressionProgress) {
        if (currentDownloadCompressionProgress == "completed"
        || currentDownloadCompressionProgress == "ffmpeg and ffprobe unavailable"
        || currentDownloadCompressionProgress == "ffmpeg unavailable"
        || currentDownloadCompressionProgress == "ffprobe unavailable"
        || currentDownloadCompressionProgress == "unfinished download") {
          return false;
        } else {
          update_stop_compression_download_bool(true);
          update_download_compression_fileNameID(fileName);
          return true;
        }
      } else {
        update_stop_compression_download_bool(true);
        update_download_compression_fileNameID(fileName);
        return true;
      }
    } else if (currentDownloadCompressionProgress) {
      if (currentDownloadCompressionProgress == "completed"
      || currentDownloadCompressionProgress == "ffmpeg and ffprobe unavailable"
      || currentDownloadCompressionProgress == "ffmpeg unavailable"
      || currentDownloadCompressionProgress == "ffprobe unavailable"
      || currentDownloadCompressionProgress == "unfinished download") {
        return false;
      } else {
        update_stop_compression_download_bool(true);
        update_download_compression_fileNameID(fileName);
        return true;
      }
    } else {
      return false;
    } 
  } catch (error) {
    return false;
  }
}

// VP9 video compression - make video size smaller
async function compression_VP9(videofile, newFilePath, fileName) {
  if(typeof videofile !== "string") {
    return "videofile not string";
  } else if(typeof newFilePath !== "string") {
    return "newFilePath not string";
  } else if(fileName === undefined) {
    return "fileName undefined";
  } else {
    const command = new ffmpeg();
    const fileType = ".webm";
    let duration = 0;
    const videoDetails = await videoData.findVideosByID(fileName);
    const ffmpegAvailable = ffmpegPath.checkIfFFmpegFFprobeExits();
    if (ffmpegAvailable == "ffmpeg-ffprobe-exits") {
      if (videoDetails !== undefined) {
        ffmpeg.ffprobe(videofile, (error, metadata) => {
          try { // get video duration 
            duration = metadata.format.duration;
          } catch (error) { // duration = 0
            duration = 0;
          } 
          if (duration > 0) {
            command.addInput(videofile)
              .on("start", function() {
                start_compression_VP9();
              })
              .on("progress", function(data) { 
                progress_compression_VP9(fileName, data);
                if (get_stop_compression_download_bool() === true  && get_download_compression_fileNameID() == fileName) {
                  try {
                    ffmpegPath.SIGKILL(command);
                    update_stop_compression_download_bool(false);
                  } catch (e) {
                    update_stop_compression_download_bool(false);
                  }
                }
              })
              .on("end", function() {
                end_compression_VP9(fileName, newFilePath, fileType);       
              })
              .on("error", function(error) {
                console.log(`Encoding Error: ${error.message}`);
                if (error.message === "ffmpeg was killed with signal SIGKILL") {
                  if (videoData.getVideoData([`${fileName}`,"compression"])) {       
                    videoData.updateVideoData([`${fileName}`, "compression", "download"], "ffmpeg was killed with signal SIGKILL");
                  }  
                  if (currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression"])) {      
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg was killed with signal SIGKILL");   
                  } 
                }
              })
              // https://developers.google.com/media/vp9/settings/vod/
              .outputOptions(["-c:v libvpx-vp9", "-crf 32", "-b:v 2000k"])
              .output(`${newFilePath}${fileName}${fileType}`)
              .run(); 
          } else { 
            deleteData.deleteAllVideoData(fileName);
          }
        }); 
        return "start compression";
      } else {  
        return "videoDetails dosnet exists";
      } 
    } else { 
      return ffmpegAvailable;
    }
  }
}

function start_compression_VP9() {
  return "start download";
}

function progress_compression_VP9(fileName, data) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if (typeof data !== "object") {
      return "invalid data";
  } else  if (typeof data.percent !== "number") { 
      return "invalid data.percent";
  }else {
    if (videoData.getVideoData([`${fileName}`, "compression", "download"]) !== undefined 
      && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) !== undefined)  {
      if(data.percent < 0){
        videoData.updateVideoData([`${fileName}`, "compression", "download"], 0.00);
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "0.00%");
      } else{ 
        videoData.updateVideoData([`${fileName}`, "compression", "download"], data.percent);
        try { 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent.toFixed(2)}%`);
        } catch (error) {
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);
        }
      }  
      return "update download progress";  
    } else if (videoData.getVideoData([`${fileName}`, "compression", "download"]) === undefined 
      && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) !== undefined)  {
      if(data.percent < 0){
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "0.00%");
      } else{ 
        try { 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent.toFixed(2)}%`);
        } catch (error) {
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);
        }
      } 
      return `${fileName} VideoData missing`;
    } else if (videoData.getVideoData([`${fileName}`, "compression", "download"]) !== undefined 
      && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) === undefined)  { 
      if(data.percent < 0){
        videoData.updateVideoData([`${fileName}`, "compression", "download"], 0.00);
      } else{ 
        videoData.updateVideoData([`${fileName}`, "compression", "download"], data.percent);
      } 
     return `${fileName} CurrentDownloads missing`;
    } else {
      return `${fileName} VideoData & CurrentDownloads missing`;
    }
  }
}

function end_compression_VP9(fileName, newFilePath, fileType) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if(typeof newFilePath !== "string") {
      return "newFilePath not string";
  } else if(typeof fileType !== "string") {
      return "fileType not string";
  } else {
    
    if (availableVideos.getAvailableVideos([`${fileName}`,"info"]) !== undefined) {
      availableVideos.updateAvailableVideoData([`${fileName}`, "info", "videoLink", "compressdSrc"], `/compressed/${fileName}`);
      availableVideos.updateAvailableVideoData([`${fileName}`, "info", "videoLink", "compressedType"], "video/webm");
    } else{
      availableVideos.updateAvailableVideoData([`${fileName}`], {
        info:{
          title: fileName,
          videoLink: {
            src : `/video/${fileName}`,
            type : "video/mp4",
            compressdSrc : `/compressed/${fileName}`,
            compressedType : "video/webm"
          }
        }
      });
    } 
  
    if (videoData.getVideoData([`${fileName}`]) !== undefined) {
      videoData.updateVideoData([`${fileName}`, "compression"], { 
        path: newFilePath+fileName+fileType,
        videoType: "video/webm",
        download: "completed"
      });
    }
  
    if(currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail"]) === undefined || currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) === "completed") { 
      currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
    } else if (currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) !== undefined) {
      currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "completed");
    } 

    return "end download";
  }  
}

module.exports = { // export modules
    get_download_compression_fileNameID,
    update_download_compression_fileNameID,
    get_stop_compression_download_bool,
    update_stop_compression_download_bool,
    stopCommpressedVideoDownload,
    compression_VP9,
    start_compression_VP9,
    progress_compression_VP9,
    end_compression_VP9
};
