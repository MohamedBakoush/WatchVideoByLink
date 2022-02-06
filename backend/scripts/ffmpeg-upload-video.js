"use strict";
const FileSystem = require("fs");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const deleteData = require("./delete-data");
const userSettings = require("./user-settings");
const ffmpegImageDownload = require("./ffmpeg-download-image");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");

// upload video file to ./media/video then downoald file
function uploadVideoFile(req, res) {
  if (req.files == undefined) { 
    res.json("invalid-files"); 
  } else if (req.files.file == undefined) {
    res.json("invalid-files.file"); 
  } else if (req.files.file.truncated == undefined) {
    res.json("invalid-files.file.truncated"); 
  } else if(req.files.file.truncated){ 
    res.json("video-size-over-size-limit"); 
  } else {
    const file = req.files.file;
    const fileMimeType = req.files.file.mimetype; 
    const uploadedFilename = `uploaded-${uuidv4()}`;
    const videofile = `./media/video/${uploadedFilename}.mp4`;
    file.mv(videofile, async function(err){
      if (err) { 
        deleteData.delete_video_with_provided_path(videofile, uploadedFilename);
        res.send("error-has-accured");
      } else { 
        const downloadVideo = await downloadUploadedVideo(videofile, fileMimeType, uploadedFilename);
        if (downloadVideo.message == "initializing") {
          const checkDownloadResponse = setInterval(function(){ 
            const getDownloadResponse = ffmpegDownloadResponse.getDownloadResponse([downloadVideo.fileName]);
            if (getDownloadResponse !== undefined) {
              if (getDownloadResponse.message !== undefined) {
                if (getDownloadResponse.message !== "initializing") {
                  clearInterval(checkDownloadResponse);
                  ffmpegDownloadResponse.deleteSpecifiedDownloadResponse(getDownloadResponse.fileName);
                  res.json(getDownloadResponse.message);
                }  
              } else {
                clearInterval(checkDownloadResponse);
                ffmpegDownloadResponse.deleteSpecifiedDownloadResponse(getDownloadResponse.fileName);
                res.json("response-not-found");
              }
            } else {
              clearInterval(checkDownloadResponse);
              res.json("response-not-found");
            }
          }, 50); 
        } else {
          ffmpegDownloadResponse.deleteSpecifiedDownloadResponse(downloadVideo.fileName);
          if (downloadVideo.message !== undefined) {
            res.json(downloadVideo.message);
          } else {
            res.json(downloadVideo);
          }
        }
      }
    });
  }
}

// download full video
async function downloadUploadedVideo(videofile, fileMimeType, uploadedFilename) {
  if (typeof videofile !== "string") {
    return "videofile not string";
  } else if (typeof fileMimeType !== "string") {
    return "fileMimeType not string";
  } else if (typeof uploadedFilename !== "string") {
    return "uploadedFilename not string";
  } else {
    const command = new ffmpeg(); 
    const compressUploadedVideo = userSettings.checkIfVideoCompress("downloadUploadedVideo");
    const filepath = "media/video/"; 
    const fileName = uuidv4();
    const fileType = ".mp4";
    const newFilePath = `${filepath}${fileName}/`;
    const videoDetails = await videoData.findVideosByID(fileName);
    const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
    if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {  
      if (videoDetails == undefined) {
        if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
            FileSystem.mkdirSync(`${filepath}${fileName}/`);
        }
        ffmpegDownloadResponse.updateDownloadResponse([fileName], {
            "fileName": fileName,
            "message": "initializing"
        });
        command.addInput(videofile)
          .on("start", function() { 
            const startDownload = start_downloadUploadedVideo(fileName, fileMimeType, compressUploadedVideo);
            if (startDownload == "start download") {
              if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                  ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "downloading-uploaded-video");
              }
            } else {
                if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "ffmpeg-failed");
                }
                ffmpegPath.SIGKILL(command);
                deleteData.deleteAllVideoData(fileName);
                deleteData.delete_video_with_provided_path(videofile, uploadedFilename);
            }
          })
          .on("progress", function(data) { 
            progress_downloadUploadedVideo(fileName, data, fileMimeType, compressUploadedVideo);
          })
          .on("end", function() { 
            end_downloadUploadedVideo(fileName, newFilePath, fileType, videofile, fileMimeType, compressUploadedVideo);
            const path = newFilePath+fileName+fileType; 
            if (compressUploadedVideo === true) {
              ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName);
            }
            ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 
            deleteData.delete_video_with_provided_path(videofile, uploadedFilename);
          })
          .on("error", function(error) {
            console.log(`Encoding Error: ${error.message}`);
            if (error.message === "Cannot find ffmpeg") {
                if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "Cannot-find-ffmpeg");
                }
            } else {
                if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "ffmpeg-failed");
                }
            }
            deleteData.deleteAllVideoData(fileName);
            deleteData.delete_video_with_provided_path(videofile, uploadedFilename);
          })
          .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
          .output(`${newFilePath}${fileName}${fileType}`)
          .run();
        return {
            "fileName": fileName,
            "message": "initializing"
        };
      } else { 
        return await downloadUploadedVideo(videofile, uploadedFilename, fileMimeType);
      }   
    } else {
      deleteData.delete_video_with_provided_path(videofile, uploadedFilename);
      return {
          "message": ffmpegAvaiable
      };
    }
  }
}

function start_downloadUploadedVideo(fileName, fileMimeType, compressUploadedVideo) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if (typeof fileMimeType !== "string") {
      return "fileMimeType not string";
  } else {
    videoData.updateVideoData([`${fileName}`], {
      video:{
        originalVideoSrc : "unknown",
        originalVideoType : fileMimeType,
        download : "starting uploaded video download"
      }
    });
    if (compressUploadedVideo === true) {
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
    return "start download"; 
  }
}

function progress_downloadUploadedVideo(fileName, data, fileMimeType, compressUploadedVideo) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if (typeof data !== "object") {
      return "invalid data";
  } else  if (typeof data.percent !== "number") { 
      return "invalid data.percent";
  } else {
    if (videoData.getVideoData([`${fileName}`, "video", "download"]) !== undefined 
    && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "video", "download-status"]) !== undefined) {
      videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);
      if(data.percent < 0){ 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
      } else{
        try {
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);
        } catch (error) {
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
        }
      }  
    } else {
      const start_response = start_downloadUploadedVideo(fileName, fileMimeType, compressUploadedVideo);
      if (start_response == "start download") {
        videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);
        if(data.percent < 0){ 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
        } else{
          try {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);
          } catch (error) {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
          }
        }    
      } else {
        return start_response;
      }
    }
  }
}

function end_downloadUploadedVideo(fileName, newFilePath, fileType, videofile, fileMimeType, compressUploadedVideo) {
  if (fileName === undefined) {
    return "fileName undefined";
  } else if(typeof newFilePath !== "string") {
      return "newFilePath not string";
  } else if(typeof fileType !== "string") {
      return "fileType not string";
  } else if (typeof videofile !== "string") {
      return "videofile not string";
  } else if (typeof fileMimeType !== "string") {
      return "fileMimeType not string";
  } else {
    if (compressUploadedVideo === true) {
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
      currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
          video : { 
              "download-status" : "completed"
          },
          compression : { 
              "download-status" : "starting video compression"
          },
          thumbnail : { 
              "download-status" : "starting thumbnail download"
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
      currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
          video : { 
              "download-status" : "completed"
          },
          thumbnail : { 
              "download-status" : "starting thumbnail download"
          } 
      });
    }
    return "end download";
  }
}
module.exports = { // export modules
  uploadVideoFile,
  downloadUploadedVideo,
  start_downloadUploadedVideo,
  progress_downloadUploadedVideo,
  end_downloadUploadedVideo
};
  