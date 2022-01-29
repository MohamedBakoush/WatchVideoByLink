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
    compression_download_fileNameID = new_fileNameID;
    return compression_download_fileNameID;
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
    if (typeof bool == "boolean") {
        stop_compression_download_bool = bool;
        return stop_compression_download_bool;
    }
}

// check if video compression is downloading
// if true then update stopCompressedVideoFileBool and fileNameID_Compression variable and return true
// else return false
async function stopCommpressedVideoDownload(fileNameID) { 
    try {
        const videoDetails = await videoData.findVideosByID(fileNameID);
        const currentDownloads = await currentDownloadVideos.findCurrentDownloadByID(fileNameID); 
        let videoDataCompressionProgress, currentDownloadCompressionProgress; 
        try {
            if (videoDetails["compression"]) {
                videoDataCompressionProgress = videoDetails["compression"]["download"];  
            } else {
                videoDataCompressionProgress = false;
            } 
        } catch (error) {
            videoDataCompressionProgress = false;
        }
        try {
            if (currentDownloads["compression"]) {
                currentDownloadCompressionProgress = currentDownloads["compression"]["download-status"];  
            } else {
                currentDownloadCompressionProgress = false;
            } 
        } catch (error) {
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
                    update_download_compression_fileNameID(fileNameID);
                    return true;
                }
            } else {
                update_stop_compression_download_bool(true);
                update_download_compression_fileNameID(fileNameID);
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
                update_download_compression_fileNameID(fileNameID);
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
  const command = new ffmpeg();
  const fileType = ".webm";
  let duration = 0;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {
    if (videoDetails !== undefined) {
      ffmpeg.ffprobe(videofile, (error, metadata) => {
        try { // get video duration 
          duration = metadata.format.duration;
        } catch (error) { // duration = 0
          duration = 0;
        } 
        console.log(`${fileName} duration: ${duration}`);
        // if video duration greater then 0
        if (duration > 0) {
          command.addInput(videofile)
            .on("start", function() {
              start_compression_VP9();
            })
            .on("progress", function(data) { 
              videoData.updateVideoData([`${fileName}`, "compression", "download"], data.percent);

              if(data.percent < 0){
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "0.00%");
                console.log(`${fileName} compression-download-status: 0.00%`);
              } else if(data.percent == "undefined"){
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);  
                console.log(`${fileName} compression-download-status: ${data.percent}%`);
              } else{
                try { 
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent.toFixed(2)}%`);
                  console.log(`${fileName} compression-download-status: ${data.percent.toFixed(2)}%`);
                } catch (error) {
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);
                  console.log(`${fileName} compression-download-status: ${data.percent}%`);
                }
              }  

              // stop video compression
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
              /// encoding is complete
              console.log(`${fileName} compression-download-status: complete`); 
              try {
                if (availableVideos.getAvailableVideos([`${fileName}`,"info"])) {
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
              } catch (error) {
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
          
              videoData.updateVideoData([`${fileName}`, "compression"], { 
                path: newFilePath+fileName+fileType,
                videoType: "video/webm",
                download: "completed"
              });

              if(currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail"]) === undefined || currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) === "completed") { 
                currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
              } else  {  
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "completed");
              }            
            })
            .on("error", function(error) {
              /// error handling
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
          try { // duration less or equal to 0
            if (videoData.getVideoData([`${fileName}`]) || currentDownloadVideos.getCurrentDownloads([`${fileName}`])) { // if videodata and currentDownloadVideos is avaiable 
              // delete all data
              deleteData.deleteAllVideoData(fileName);
            } 
          } catch (error) { // an error has occurred
            console.log(error); 
          } 
        }
      }); 
    } else {  
      return "videoDetails dosnet exists";
    } 
  } else { 
    console.log(ffmpegAvaiable);
  }
}

function start_compression_VP9() {
  return "start download";
}

module.exports = { // export modules
    get_download_compression_fileNameID,
    update_download_compression_fileNameID,
    get_stop_compression_download_bool,
    update_stop_compression_download_bool,
    stopCommpressedVideoDownload,
    compression_VP9
};
