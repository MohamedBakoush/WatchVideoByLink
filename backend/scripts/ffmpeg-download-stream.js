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
let stream_download_fileNameID, stop_stream_download_bool;

// get download stream fileNameID
function get_download_stream_fileNameID(){ 
    if (stream_download_fileNameID !== undefined) {
        return stream_download_fileNameID;
    } else  {
        return undefined;
    } 
}

// update download stream fileNameID
function update_download_stream_fileNameID(new_fileNameID){ 
    stream_download_fileNameID = new_fileNameID;
    return stream_download_fileNameID;
}

// get stop download stream bool
function get_stop_stream_download_bool(){ 
    if (stop_stream_download_bool !== undefined) {
        return stop_stream_download_bool;
    } else  {
        stop_stream_download_bool = false;
    } 
}

// update stop download stream bool
function update_stop_stream_download_bool(bool){ 
    if (typeof bool == "boolean") {
        stop_stream_download_bool = bool;
        return stop_stream_download_bool;
    }
}

// stop video stream download
async function stopDownloadVideoStream(fileNameID) {
    const videoDetails = await videoData.findVideosByID(fileNameID);
    if (videoDetails !== undefined) {
        update_stop_stream_download_bool(true);
        update_download_stream_fileNameID(fileNameID);
        return "stoped video stream download";
    } else {
        return "videoDetails dosnet exists";
    } 
}

// downloads live video stream
async function downloadVideoStream(videoSrc, videoType) {
    const command = new ffmpeg();
    const compressVideoStream = userSettings.checkIfVideoCompress("downloadVideoStream");
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
            command.addInput(videoSrc)
                .on("start", function() {
                    const startDownload = start_downloadVideoStream(fileName, videoSrc, videoType, compressVideoStream);
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
                    progress_downloadVideoStream(fileName, data, videoSrc, videoType, compressVideoStream);
                    if (get_stop_stream_download_bool() === true  && get_download_stream_fileNameID() == fileName) {
                        try {
                            ffmpegPath.STOP(command);
                            update_stop_stream_download_bool(false);
                        } catch (e) {
                            update_stop_stream_download_bool(false);
                        }
                    }
                })
                .on("end", function() { // encoding is complete
                    end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc, videoType, compressVideoStream);
                    const path = newFilePath+fileName+fileType;
                    if (compressVideoStream) { // compress video
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
                .outputOptions(["-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
                .output(`${newFilePath}${fileName}${fileType}`)
                .run();
            return {
                "fileName": fileName,
                "message": "initializing"
            };
        } else {
            return await downloadVideoStream(videoSrc, videoType);
        }
    } else { 
        return {
            "message": ffmpegAvaiable
        };
    } 
}

function start_downloadVideoStream(fileName, videoSrc, videoType, compressVideoStream) {
    if (fileName === undefined) {
        return "fileName undefined";
    } else if (typeof videoSrc !== "string") {
        return "videoSrc not string";
    } else if (typeof videoType !== "string") {
        return "videoType not string";
    } else {
        videoData.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : "starting stream download"
            }
        });
        if (compressVideoStream) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
                video : { 
                    "download-status" : "starting stream download"
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
                    "download-status" : "starting stream download"
                },
                thumbnail : { 
                    "download-status" : "waiting for video"
                } 
            });
        }   
        return "start download"; 
    }
}

function progress_downloadVideoStream(fileName, data, videoSrc, videoType, compressVideoStream) {
    if (fileName === undefined) {
        return "fileName undefined";
    } else if (typeof data !== "object") {
        return "invalid data";
    } else  if (typeof data.timemark !== "string") { 
        return "invalid data.timemark";
    } else {
        if (videoData.getVideoData([`${fileName}`, "video", "download"]) !== undefined 
        && currentDownloadVideos.getCurrentDownloads([`${fileName}`, "video", "download-status"]) !== undefined) {
            if(videoData.getVideoData([`${fileName}`, "video", "download"]) !== "downloading"){
                videoData.updateVideoData([`${fileName}`, "video", "download"], "downloading");
            }
            videoData.updateVideoData([`${fileName}`, "video", "timemark"], data.timemark);
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"],  data.timemark);
            return "update download progress";    
        } else {
            const start_response = start_downloadVideoStream(fileName, videoSrc, videoType, compressVideoStream);
            if (start_response == "start download") {
                if(videoData.getVideoData([`${fileName}`, "video", "download"]) !== "downloading"){
                    videoData.updateVideoData([`${fileName}`, "video", "download"], "downloading");
                }
                videoData.updateVideoData([`${fileName}`, "video", "timemark"], data.timemark);
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"],  data.timemark); 
                return "update download progress";    
            } else {
                return start_response;
            }
        }
    }
}

function end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc, videoType, compressVideoStream) {   
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
        if (compressVideoStream) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
                video : {
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
                video : {
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
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"],  "completed");
        if (compressVideoStream) { // addition of compress video data 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"],  "starting video compression"); 
        }
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"],  "starting thumbnail download"); 
        return "end download";  
    }      
}
module.exports = { // export modules
    get_download_stream_fileNameID,
    update_download_stream_fileNameID,
    get_stop_stream_download_bool,
    update_stop_stream_download_bool,
    stopDownloadVideoStream,
    downloadVideoStream,
    start_downloadVideoStream,
    progress_downloadVideoStream
};
  