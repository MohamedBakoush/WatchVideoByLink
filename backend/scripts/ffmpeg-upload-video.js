"use strict";
const FileSystem = require("fs");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const userSettings = require("./user-settings");
const ffmpegImageDownload = require("./ffmpeg-download-image");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");

// upload video file to ./media/video then downoald file
function uploadVideoFile(req, res) {
  if(req.files) {
    const file = req.files.file;
    const filename = uuidv4();
    const fileMimeType = req.files.file.mimetype; 
    if(req.files.file.truncated){  // file size greater then limit
      res.json("video-size-over-size-limit"); 
    } else { // file size smaller then limit
      file.mv(`./media/video/${filename}.mp4`, function(err){
        if (err) { 
          res.send("error-has-accured");
        } else { 
          downloadUploadedVideo(`./media/video/${filename}.mp4`, filename, fileMimeType, res);
        }
      });
    }
  }
}

// download full video
async function downloadUploadedVideo(videofile, fileName, fileMimeType, res) {
  const command = new ffmpeg(); 
  const compressUploadedVideo = userSettings.checkIfVideoCompress("downloadUploadedVideo");
  const filepath = "media/video/"; 
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const path = newFilePath+fileName+fileType; 
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {  
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {  
          res.json("downloading-uploaded-video");
          videoData.updateVideoData([`${fileName}`], {
            video:{
              originalVideoSrc : "unknown",
              originalVideoType : fileMimeType,
              download : "starting uploaded video download"
            }
          });
          
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          } else {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          }

        })
        .on("progress", function(data) { 
          console.log("progress", data);

          videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);

          if(data.percent < 0){ 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
          }else{
            try {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);
            } catch (error) {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
            }
          }           
        })
        .on("end", function() { 
          /// encoding is complete, so callback or move on at this point
          if (compressUploadedVideo) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : videofile,
                originalVideoType: fileMimeType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              compression : {
                download: "starting"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          } else {
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : videofile,
                originalVideoType: fileMimeType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          }

          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "completed");
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");              
          }
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download"); 

          console.log("Video Transcoding succeeded !");
          if (compressUploadedVideo) { // compress video
            ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName);
          }
          ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 

          deleteData.delete_video_with_provided_path(videofile, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log(`Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            deleteData.delete_video_with_provided_path(videofile, fileName);
            // delete created folder
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            deleteData.delete_video_with_provided_path(videofile, fileName);
            res.json("ffmpeg-failed");
          }
        })
        .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else { 
        console.log("videoDetails already exists");
      }   
  } else {
    deleteData.delete_video_with_provided_path(videofile, fileName);
    res.json(ffmpegAvaiable);
  }
}

module.exports = { // export modules
  uploadVideoFile,
  downloadUploadedVideo
};
  