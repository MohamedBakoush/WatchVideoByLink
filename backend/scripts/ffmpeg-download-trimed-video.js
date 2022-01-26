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

// downlaod trimed video
async function trimVideo(videoSrc, videoType, newStartTime, newEndTime) {
    const command = new ffmpeg();
    const videofile = await videoData.checkIfVideoSrcOriginalPathExits(videoSrc);
    const compressTrimedVideo = userSettings.checkIfVideoCompress("trimVideo");
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
                    const startDownload = start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime, compressTrimedVideo);
                    if (startDownload == "start download") {
                        if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                            ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], fileName);
                        }
                    } else {
                        if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                            ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "ffmpeg-failed");
                        }
                        ffmpegPath.SIGKILL(command);
                        deleteData.deleteAllVideoData(fileName);
                    }
                })
                .on("progress", function(data) {
                console.log("progress", data);

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

                })
                .on("end", function() {
                    if (compressTrimedVideo) { // addition of compress video data
                        videoData.updateVideoData([`${fileName}`], {
                            video: {
                                originalVideoSrc: videoSrc,
                                originalVideoType: videoType,
                                newVideoStartTime: newStartTime,
                                newVideoEndTime: newEndTime,
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
                                originalVideoSrc: videoSrc,
                                originalVideoType: videoType,
                                newVideoStartTime: newStartTime,
                                newVideoEndTime: newEndTime,
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
                        if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                            ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "Cannot-find-ffmpeg");
                        }
                    } else {
                        // there could be diffrent types of errors that exists and some may contain content in the newly created path
                        // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
                        if (ffmpegDownloadResponse.getDownloadResponse([fileName, "message"]) !== undefined) {
                            ffmpegDownloadResponse.updateDownloadResponse([fileName, "message"], "ffmpeg-failed");
                        }
                    }
                })
                // .addInputOption("-y")
                .outputOptions([`-ss ${newStartTime}`, `-t ${(newEndTime-newStartTime)}`, "-vcodec copy", "-acodec copy"])
                .output(`${newFilePath}${fileName}${fileType}`)
                .run();
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

function start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime, compressTrimedVideo) {
    videoData.updateVideoData([`${fileName}`], {
        video:{
            originalVideoSrc : videoSrc,
            originalVideoType : videoType,
            newVideoStartTime: newStartTime,
            newVideoEndTime: newEndTime,
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
    return "start download";
}

module.exports = { // export modules
    trimVideo
};
