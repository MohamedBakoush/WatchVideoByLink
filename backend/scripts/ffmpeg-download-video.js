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

// download full video
async function downloadVideo(videoSrc, videoType) {
    const command = new ffmpeg();
    const videofile = await videoData.checkIfVideoSrcOriginalPathExits(videoSrc);
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
            ffmpegDownloadResponse.updateDownloadResponse([fileName], {
                "fileName": fileName,
                "message": "initializing"
            });
            command.addInput(videofile)
                .on("start", function() {
                    const startDownload = start_downloadVideo(fileName, videoSrc, videoType, compressVideo);
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
                    progress_downloadVideo(fileName, data, videoSrc, videoType, compressVideo);
                })
                .on("end", function() {
                    end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType, compressVideo);
                    const path = newFilePath+fileName+fileType;
                    if (compressVideo) {
                        ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName);
                    }
                    ffmpegImageDownload.createThumbnail(path, newFilePath, fileName);        
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
                })
                .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
                .output(`${newFilePath}${fileName}${fileType}`)
                .run();
            return {
                "fileName": fileName,
                "message": "initializing"
            };
        } else {
            return await downloadVideo(videoSrc, videoType);
        }
    } else { 
        return {
            "message": ffmpegAvaiable
        };
    }
}

function start_downloadVideo(fileName, videoSrc, videoType, compressVideo) {
    if (fileName !== undefined) {
        if (typeof videoSrc === "string" && typeof videoType === "string" ) {
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
            return "start download";
        } else if (typeof videoSrc !== "string" && typeof videoType === "string" ) {
            return "videoSrc not string";
        } else if (typeof videoSrc === "string" && typeof videoType !== "string" ) {
            return "videoType not string";
        } else {
            return "videoSrc videoType not string";
        }
    }else {
        return "fileName undefined";
    }
}

function progress_downloadVideo(fileName, data, videoSrc, videoType, compressVideo) {
    if (fileName !== undefined) {
        if (typeof data === "object") {
            if (typeof data.percent === "number") {
                if (videoData.getVideoData([`${fileName}`, "video", "download"]) !== undefined && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "video", "download-status"]) !== undefined) {
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
                    return "update download progress";
                } else{ 
                    const start_response = start_downloadVideo(fileName, videoSrc, videoType, compressVideo);
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
                        return "update download progress";
                    } else {
                        return start_response;
                    }
                }
            } else {
                return "invalid data.percent";
            }
        } else {
            return "invalid data";
        }
    } else {
        return "fileName undefined";
    }
}

function end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType, compressVideo) {
    if(fileName === undefined ) {
        return "fileName undefined";
    } else if(typeof newFilePath !== "string") {
        return "newFilePath not string";
    } else if(typeof fileType !== "string") {
        return "fileType not string";
    } else if(typeof videoSrc !== "string") {
        return "videoSrc not string";
    } else if(typeof videoType !== "string") {
        return "videoType not string";
    } else {
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
    downloadVideo,
    start_downloadVideo,
    progress_downloadVideo,
    end_downloadVideo
};
