"use strict";
const FileSystem = require("fs");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const userSettings = require("./user-settings");
const ffmpegImageDownload = require("./ffmpeg-download-image");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");

// check if original video src path exits
async function checkIfVideoSrcOriginalPathExits(videoSrc) {
  try {
    if (videoSrc.includes("/video/")) { // if videoSrc includes /video/, split src at /video/ and attempt to findVideosByID
      const videoDetails = await videoData.findVideosByID(videoSrc.split("/video/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        return videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          return videoDetails.video.path;  
        } else { // videofile = inputted videos src 
          return videoSrc;
        } 
      }
    } else if (videoSrc.includes("/compressed/")) {
      const videoDetails = await videoData.findVideosByID(videoSrc.split("/compressed/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        return videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          return videoDetails.video.path;
        } else { // videofile = inputted videos src 
          return videoSrc;
        } 
      }
    } else { // videofile = inputted videos src  
      return videoSrc;
    } 
  } catch (error) { // videofile = inputted videos src 
    return videoSrc;
  } 
}

// download full video
async function downloadVideo(videoSrc, videoType) {
    const command = new ffmpeg();
    const videofile = await checkIfVideoSrcOriginalPathExits(videoSrc);
    const compressVideo = userSettings.checkIfVideoCompress("downloadVideo");
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
            command.addInput(videofile)
                .on("start", function() {
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], fileName);
                videoData.updateVideoData([`${fileName}`], {
                    video : {
                        originalVideoSrc : videoSrc,
                        originalVideoType : videoType,
                        download : "starting full video download"
                    }
                });

                if (compressVideo) { // addition of compress video data
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
                        video : { 
                            "download-status" : "starting full video download"
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
                            "download-status" : "starting full video download"
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
                if (compressVideo) { // addition of compress video data
                    videoData.updateVideoData([`${fileName}`], {
                        video: {
                            originalVideoSrc : videoSrc,
                            originalVideoType : videoType,
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
                        originalVideoSrc : videoSrc,
                        originalVideoType : videoType,
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
                if (compressVideo) { // addition of compress video data   
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");             
                } 
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download");

                console.log("Video Transcoding succeeded !");
                const path = newFilePath+fileName+fileType;
                if (compressVideo) { // compress video
                    ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName);
                }
                ffmpegImageDownload.createThumbnail(path, newFilePath, fileName);
                })
                .on("error", function(error) {
                /// error handling
                console.log(`Encoding Error: ${error.message}`);
                if (error.message === "Cannot find ffmpeg") {
                    FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
                        if (err) throw err;
                        console.log(`\n removed ${newFilePath} dir \n`);
                    });
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "Cannot-find-ffmpeg");
                } else {
                    // there could be diffrent types of errors that exists and some may contain content in the newly created path
                    // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
                    ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "ffmpeg-failed");
                }
                })
                .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
                .output(`${newFilePath}${fileName}${fileType}`)
                .run();

            ffmpegDownloadResponse.updateDownloadResponse([fileName], {
                "fileName": fileName,
                "message": "initializing"
            });

            return {
                "fileName": fileName,
                "message": "initializing"
            };
        } else {
            // TODO: create new fileName and try again
            console.log("videoDetails already exists");
        }
    } else { 
        return {
            "message": ffmpegAvaiable
        };
    }
}

// downlaod trimed video
async function trimVideo(req, res) {
    const command = new ffmpeg();
    const videoSrc = req.body.videoSrc;
    const videofile = await checkIfVideoSrcOriginalPathExits(videoSrc);
    const compressTrimedVideo = userSettings.checkIfVideoCompress("trimVideo");
    const start = req.body.newStartTime;
    const end = req.body.newEndTime;
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
        command.addInput(videofile)
            .on("start", function() {
            res.json(fileName);
            videoData.updateVideoData([`${fileName}`], {
                video:{
                originalVideoSrc : req.body.videoSrc,
                originalVideoType : req.body.videoType,
                newVideoStartTime: req.body.newStartTime,
                newVideoEndTime: req.body.newEndTime,
                download : "starting trim video download"
                }
            });
            
            if (compressTrimedVideo) { // addition of compress video data
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
                video : { 
                    "download-status" : "starting trim video download"
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
                    "download-status" : "starting trim video download"
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
            if (compressTrimedVideo) { // addition of compress video data
                videoData.updateVideoData([`${fileName}`], {
                video: {
                    originalVideoSrc: req.body.videoSrc,
                    originalVideoType: req.body.videoType,
                    newVideoStartTime: req.body.newStartTime,
                    newVideoEndTime: req.body.newEndTime,
                    path: newFilePath+fileName+fileType,
                    videoType: "video/mp4",
                    download: "completed"
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
                    originalVideoSrc: req.body.videoSrc,
                    originalVideoType: req.body.videoType,
                    newVideoStartTime: req.body.newStartTime,
                    newVideoEndTime: req.body.newEndTime,
                    path: newFilePath+fileName+fileType,
                    videoType: "video/mp4",
                    download: "completed"
                },
                thumbnail: {
                    path: {},
                    download: "starting"
                }
                });
            }
        
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "completed");
            if (compressTrimedVideo) { // addition of compress video data
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");
            }        
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download");

            console.log("Video Transcoding succeeded !");
            const path = newFilePath+fileName+fileType;
            if (compressTrimedVideo) { // compress video
                ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName); 
            }
            ffmpegImageDownload.createThumbnail(path, newFilePath, fileName);
            })
            .on("error", function(error) {
            /// error handling
            console.log(`Encoding Error: ${error.message}`);
            if (error.message === "Cannot find ffmpeg") {
                FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
                if (err) throw err;
                console.log(`\n removed ${newFilePath} dir \n`);
                });
                res.json("Cannot-find-ffmpeg");
            } else {
                // there could be diffrent types of errors that exists and some may contain content in the newly created path
                // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
                res.json("ffmpeg-failed");
            }
            })
            // .addInputOption("-y")
            .outputOptions([`-ss ${start}`, `-t ${(end-start)}`, "-vcodec copy", "-acodec copy"])
            .output(`${newFilePath}${fileName}${fileType}`)
            .run();
        } else {
            // TODO: create new fileName and try again
            console.log("videoDetails already exists");
        }
    } else { 
        res.json(ffmpegAvaiable);
    } 
}

module.exports = { // export modules
    checkIfVideoSrcOriginalPathExits,
    downloadVideo,
    trimVideo
};
