"use strict";
const ffmpeg = require("fluent-ffmpeg");
const currentDownloadVideos = require("./current-download-videos");
const availableVideos = require("./available-videos");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");

// creates images from provided video
async function createThumbnail(videofile, newFilePath, fileName) {
  const imageFileName = "thumbnail";
  const fileType = ".jpg";
  const numberOfImages = 8;
  let duration = 0;
  let numberOfCreatedScreenshots = 0;
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
          const command = new ffmpeg();
            command.addInput(videofile)
              .on("start", () => {
                console.log("start createThumbnail");
              })
    
              .on("progress", (data) => {
                console.log("progress", data);
                // update numberOfCreatedScreenshots
                numberOfCreatedScreenshots = data.frames; 
    
                if(data.percent < 0){ // if data.percent is less then 0 then show 0.00%
                  videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], 0.00);
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "0.00%");
                }else{ //update data with with data.percent
                  try {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], data.percent);
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent.toFixed(2)}%`);
                  } catch (error) {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], data.percent);
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent}%`);
                  }
                }
    
              })
              .on("end", () => {
                // encoding is complete
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
        
              })
              .on("error", (error) => {
                  /// error handling
                  console.log(`Encoding Error: ${error.message}`);
              })
              .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
              .output(`${newFilePath}${fileName}-${imageFileName}%03d${fileType}`)
              .run();
        } else { // duration less or equal to 0
          try { // delete data
            if (videoData.getVideoData([`${fileName}`]) || currentDownloadVideos.getCurrentDownloads()[`${fileName}`]) { // if videodata and currentDownloadVideos is avaiable 
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
  } else if(ffmpegAvaiable == "Cannot-find-ffmpeg-ffprobe"){
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");
  } else if(ffmpegAvaiable == "Cannot-find-ffmpeg"){ 
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");
  } else if(ffmpegAvaiable == "Cannot-find-ffprobe"){ 
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable");
  }
}

module.exports = { // export modules
  createThumbnail
};
  