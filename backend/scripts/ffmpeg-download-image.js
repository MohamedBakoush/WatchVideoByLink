"use strict";
const ffmpeg = require("fluent-ffmpeg");
const currentDownloadVideos = require("./current-download-videos");
const availableVideos = require("./available-videos");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");

// creates images from provided video
async function createThumbnail(videofile, newFilePath, fileName) {
  if(typeof videofile !== "string") {
    return "videofile not string";
  } else if(typeof newFilePath !== "string") {
    return "newFilePath not string";
  } else if(fileName === undefined) {
    return "fileName undefined";
  } else {
    const imageFileName = "thumbnail";
    const fileType = ".jpg";
    const numberOfImages = 8;
    let duration = 0;
    let numberOfCreatedScreenshots = 0;
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
            const command = new ffmpeg();
              command.addInput(videofile)
                .on("start", () => {
                  start_createThumbnail();
                })
                .on("progress", (data) => {
                  numberOfCreatedScreenshots = data.frames; 
                  progress_createThumbnail(fileName, data);
                })
                .on("end", () => {
                  end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
                })
                .on("error", (error) => {
                    console.log(`Encoding Error: ${error.message}`);
                })
                .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
                .output(`${newFilePath}${fileName}-${imageFileName}%03d${fileType}`)
                .run();
          } else { // duration less or equal to 0
            deleteData.deleteAllVideoData(fileName);
          }
        }); 
      } else { 
        return "videoDetails dosnet exists";
      }
    } else {
      if(ffmpegAvailable == "Cannot-find-ffmpeg"){ 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");
      } else if(ffmpegAvailable == "Cannot-find-ffprobe"){ 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable");
      } else { 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");
      } 
      return ffmpegAvailable;
    }
  }
}

function start_createThumbnail() {
  return "start download";
}

function progress_createThumbnail(fileName, data) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if (typeof data !== "object") {
      return "invalid data";
  } else  if (typeof data.percent !== "number") { 
      return "invalid data.percent";
  } else {
    if (videoData.getVideoData([`${fileName}`, "thumbnail", "download"]) !== undefined 
    && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) !== undefined)  {
      if (data.percent < 0){ // if data.percent is less then 0 then show 0.00%
        videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], 0.00);
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "0.00%");
      } else { //update data with with data.percent
        videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], data.percent);
        try { 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent.toFixed(2)}%`);
        } catch (error) { 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent}%`);
        }
      }
      return "update download progress";  
    } else if (videoData.getVideoData([`${fileName}`, "thumbnail", "download"]) === undefined 
    && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) !== undefined)  {
     return `${fileName} VideoData missing`;
    } else if (videoData.getVideoData([`${fileName}`, "thumbnail", "download"]) !== undefined 
    && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) === undefined)  { 
     return `${fileName} CurrentDownloads missing`;
    } else {
      return `${fileName} VideoData & CurrentDownloads missing`;
    }
  }
}

function end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if(typeof newFilePath !== "string") {
      return "newFilePath not string";
  } else if(typeof imageFileName !== "string") {
    return "imageFileName not string";
  } else if(typeof fileType !== "string") {
      return "fileType not string";
  } else if (isNaN(numberOfCreatedScreenshots)) {
      return "numberOfCreatedScreenshots not number";
  } else {
    for (let i = 0; i < numberOfCreatedScreenshots + 1; i++) {
      if (i == 0){
        try {
          if (availableVideos.getAvailableVideos([`${fileName}`, "info"])) {
            availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink"], {});
          } else {            
            availableVideos.updateAvailableVideoData([`${fileName}`], {
              info:{
                title: fileName,
                videoLink: {
                  src : `/video/${fileName}`,
                  type : "video/mp4"
                },
                thumbnailLink: {
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
                type : "video/mp4"
              },
              thumbnailLink: {
              }
            }
          });
        }
      } else if (i < 10) {
        videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}00${i}${fileType}`);
        availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
      } else if (i < 100) {
        videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}0${i}${fileType}`);
        availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
      } else {
        videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}${i}${fileType}`);
        availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
      }
      if (i == numberOfCreatedScreenshots) {
        videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], "completed");
      }
    }
    
    if(currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression"]) === undefined || currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) === "completed") { 
      currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
    } else  {  
      currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "completed");
    } 
    return "end download";
  }
}

module.exports = { // export modules
  createThumbnail,
  start_createThumbnail,
  progress_createThumbnail,
  end_createThumbnail
};
  