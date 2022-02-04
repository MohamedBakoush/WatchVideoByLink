"use strict";
const FileSystem = require("fs");
const { v4: uuidv4 } = require("uuid");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const availableVideos = require("./available-videos");

// check if video compression is downloading before data deletion 
function checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(videoID, folderIDPath) {
  if (typeof videoID !== "string") {
    return "videoID not string";
  } else {
    const stopCommpressedVideoDownloadBool = ffmpegCompressionDownload.stopCommpressedVideoDownload(videoID); 
    if (stopCommpressedVideoDownloadBool) {  
      const id = uuidv4();
      ffmpegDownloadResponse.updateDownloadResponse([id], {
        "id": id,
        "message": "initializing"
      });
      const checkDownloadResponse = setInterval(function(){ 
        const downloadStatus = checkCompressedVideoDownloadStatus(videoID);
        if (downloadStatus === "start deletion") {
          clearInterval(checkDownloadResponse);
          const deleteAllVideoDataResponse = deleteAllVideoData(videoID, folderIDPath); 
          if (ffmpegDownloadResponse.getDownloadResponse([id, "message"]) !== undefined) {
              ffmpegDownloadResponse.updateDownloadResponse([id, "message"], deleteAllVideoDataResponse);
          }
        } else if (downloadStatus !== "still downloading") {
          clearInterval(checkDownloadResponse);
          if (ffmpegDownloadResponse.getDownloadResponse([id, "message"]) !== undefined) {
              ffmpegDownloadResponse.updateDownloadResponse([id, "message"], downloadStatus);
          }
        }
      }, 50);  
      return {
        "id": id,
        "message": "initializing"
      };
    } else { // compressed video isn't downloading 
      return deleteAllVideoData(videoID, folderIDPath); 
    }
  }
}

// try untill compressed video gets killed with signal SIGKILL or finnishes download 
function checkCompressedVideoDownloadStatus(videoID) {
  if (typeof videoID !== "string") {
    return "videoID not string";
  } else if (videoData.getVideoData([`${videoID}`, "compression"]) === undefined) {
    return "invalid videoID trough videoData";
  } else if (currentDownloadVideos.getCurrentDownloads([videoID, "compression"])  === undefined) {
    return "invalid videoID trough CurrentDownloads";
  } else {
    if (videoData.getVideoData([`${videoID}`, "compression", "download"]) == "completed"
      || videoData.getVideoData([`${videoID}`, "compression", "download"]) == "ffmpeg was killed with signal SIGKILL"
      || currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "completed" 
      || currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "ffmpeg was killed with signal SIGKILL") {  
      return "start deletion";    
    } else {   
      return "still downloading";
    } 
  }
}

// deletes all video id data
function deleteAllVideoData(fileName, folderIDPath) {
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else if (!Array.isArray(folderIDPath))  {
    return deleteSpecifiedVideoData(fileName); 
  } else if (availableVideos.getAvailableVideos(availableVideos.availableVideosfolderPath_Array(folderIDPath)) === undefined && folderIDPath.length !== 0) {
    return "invalid folderIDPath";
  } else {
    if (fileName.includes("folder-")) {
      const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath); 
      if (!Array.isArray(availableVideosFolderIDPath)){ 
        return deleteAllFolderData([fileName, "content"], fileName, fileName); 
      } else {  
        return deleteAllFolderData([...availableVideosFolderIDPath, fileName, "content"], fileName, fileName);
      }    
    } else { 
      return deleteSpecifiedVideoData(fileName, folderIDPath); 
    }
  }
}

// delete all folder content plus selected folder
// 1. If folder is detected go in, Delete all video data found 
// 2. if folder is empty delete folder and go up one folder, if folder contained folders repeat 1 
// 3. stop when current folder id reached starting folder id
function deleteAllFolderData(availableVideosFolderIDPath, currentFolderID, startingFolderID) { 
  if (!Array.isArray(availableVideosFolderIDPath)) {
    return "availableVideosFolderIDPath not array";
  } else if (availableVideos.getAvailableVideos(availableVideosFolderIDPath) === undefined) {
    return "invalid availableVideosFolderIDPath";
  } else if (typeof currentFolderID !== "string") {
    return "currentFolderID not string";
  } else if (typeof startingFolderID !== "string") {
    return "startingFolderID not string";
  } else {
    if (Object.keys(availableVideos.getAvailableVideos([...availableVideosFolderIDPath])).length == 0) {
      return deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, currentFolderID, startingFolderID);
    } else {
      Object.keys(availableVideos.getAvailableVideos([...availableVideosFolderIDPath])).forEach(function(fileName, i, array) {
        if (fileName.includes("folder-")) {
          deleteAllFolderData([...availableVideosFolderIDPath, fileName, "content"], fileName, startingFolderID); 
        } else { 
          deleteSpecifiedVideoData(fileName, availableVideosFolderIDPath);
        }
        if (i == array.length - 1) {
          deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, currentFolderID, startingFolderID);
        }
      });
      return `deleted-${currentFolderID}-permanently`;
    }
  }
}

function deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, currentFolderID, startingFolderID) {
  if (!Array.isArray(availableVideosFolderIDPath)) {
    return "availableVideosFolderIDPath not array";
  } else if (availableVideos.getAvailableVideos(availableVideosFolderIDPath) === undefined) {
    return "invalid availableVideosFolderIDPath";
  } else if (typeof currentFolderID !== "string") {
    return "currentFolderID not string";
  } else if (typeof startingFolderID !== "string") {
    return "startingFolderID not string";
  } else if (Object.keys(availableVideos.getAvailableVideos(availableVideosFolderIDPath)).length !== 0) {   
    return "folder path not empty";
  } else if (availableVideosFolderIDPath.indexOf(currentFolderID) == -1) {
    return "invalid currentFolderID";
  } else {
    const newAvailableVideosFolderPath = [...availableVideosFolderIDPath];
    newAvailableVideosFolderPath.length = newAvailableVideosFolderPath.indexOf(currentFolderID);  
    const insideFolderIDPath = [...newAvailableVideosFolderPath, currentFolderID, "info", "inside-folder"];
    const insideFolderID = availableVideos.getAvailableVideos(insideFolderIDPath);  
    const deleteData = availableVideos.deleteSpecifiedAvailableVideosData(currentFolderID, newAvailableVideosFolderPath); 
    if (deleteData === `${currentFolderID} deleted` && (currentFolderID === startingFolderID || insideFolderID === "folder-main")) { 
      return `deleted-${currentFolderID}-permanently`;
    } else if (availableVideos.getAvailableVideos(newAvailableVideosFolderPath) === undefined) {
      return "newAvailableVideosFolderPath undefined";
    } else {
      return deleteAllFolderData(newAvailableVideosFolderPath, insideFolderID, startingFolderID); 
    }
  }
}

function deleteSpecifiedVideoData(fileName, folderIDPath) {
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else {
    // delete availableVideos by id if exist  
    if (Array.isArray(folderIDPath)) {
      const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath);
      if (availableVideos.getAvailableVideos(availableVideosFolderIDPath) !== undefined) { 
        availableVideos.deleteSpecifiedAvailableVideosData(fileName, availableVideosFolderIDPath); 
      } else if (availableVideos.getAvailableVideos(folderIDPath) !== undefined) { 
        availableVideos.deleteSpecifiedAvailableVideosData(fileName, folderIDPath); 
      } else {
        availableVideos.deleteSpecifiedAvailableVideosData(fileName); 
      }
    } else {
      availableVideos.deleteSpecifiedAvailableVideosData(fileName); 
    }
    // delete currentDownloadVideos by id if exist 
    currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
    // delete videoData by id if exist 
    videoData.deleteSpecifiedVideoData(fileName); 
    // delete specified video by id if exist  
    deleteSpecifiedVideo(fileName);  
    return `deleted-${fileName}-permanently`;
  }
}

const videosBeingDeleted = [];
// delete specified video from server if exist  
function deleteSpecifiedVideo(fileName) { 
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else if (!check_if_file_exits(`./media/video/${fileName}`)){
    return `folder-${fileName}-dosent-exit`;
  } else if (!Array.isArray(videosBeingDeleted))  {
    return "videosBeingDeleted not array";
  } else if (videosBeingDeleted.includes(fileName)) {
    return `${fileName}-already-being-deleted`;
  } else {
    videosBeingDeleted.push(fileName);
    read_dir(`./media/video/${fileName}`, (files) => { 
      if (!files.length) {
        remove_dir(`./media/video/${fileName}`);
      } else { // folder not empty
        read_dir(`./media/video/${fileName}`, (files) => {
          let completedCount = 0;
          for (const file of files) {
            completedCount += 1;
            rename_file(`./media/video/${fileName}/${file}`, "media/deleted-videos", `deleted-${file}`, () => {
              unlink_file(`media/deleted-videos/deleted-${file}`, () => {
                if (files.length == completedCount) {
                  completedCount = 0; // reset completedCount
                  remove_dir(`./media/video/${fileName}`, () => {
                    const fileName_index = videosBeingDeleted.indexOf(fileName);
                    if (fileName_index !== -1) {
                      videosBeingDeleted.splice(fileName_index, 1);
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
    return `deleting-video-${fileName}-permanently`;
  }
}

// delete video file with provided video path
function delete_video_with_provided_path(videofile, fileName) {
  if (typeof videofile !== "string") {
    return "videofile no string";
  } else if (typeof fileName !== "string") {
    return "fileName no string";
  } else {
    if (check_if_file_exits(videofile)) {
      rename_file(videofile, "media/deleted-videos", `deleted-${fileName}.mp4`, () => {
        unlink_file(`media/deleted-videos/deleted-${fileName}.mp4`);
      });  
      return "delete video";
    } else {
      return "invalid videofile";
    }
  }
}

function check_if_file_exits(filePath) {
  if (typeof filePath !== "string") {
    return "filePath no string";
  } else {
    if (FileSystem.existsSync(filePath)) {   
      return true;
    } else {
      return false;
    }
  }
}

function rename_file(filePath, newPath, newFileName, callback) {
  if (typeof filePath !== "string") {
    return "filePath no string";
  } else if (typeof newPath !== "string") {
    return "newPath no string";
  } else if (typeof newFileName !== "string") {
    return "newFileName no string";
  } else {
    if (check_if_file_exits(filePath)) {
      if (check_if_file_exits(newPath)) {
        FileSystem.rename(filePath, `${newPath}/${newFileName}`,  (err) => {
          if (err) throw err;
          if (typeof callback === "function") {
            callback();
          }
        });
        return "renamed file";
      } else {
        return "invalid newPath";
      }
    } else {
      return "invalid filepath";
    }
  }
}

function unlink_file(filePath, callback) {
  if (typeof filePath !== "string") {
    return "filePath no string";
  } else {
    if (check_if_file_exits(filePath)) {
      FileSystem.unlink(filePath, (err) => {
        if (err) throw err;
        if (typeof callback === "function") {
          callback();
        }
      }); 
      return "deleting file";
    } else {
      return "invalid filepath";
    }
  } 
}

function remove_dir(filePath, callback) {
  if (typeof filePath !== "string") {
    return "filePath no string";
  } else {
    if (check_if_file_exits(filePath)) {
      FileSystem.rmdir(filePath, (err) => {
        if (err) throw err;  
        if (typeof callback === "function") {
          callback();
        }
      });
      return "removeing folder";
    } else {
      return "invalid filepath";
    }
  } 
}

function read_dir(filePath, callback) {
  if (typeof filePath !== "string") {
    return "filePath no string";
  } else {
    if (check_if_file_exits(filePath)) {
      FileSystem.readdir(filePath, (err, files) => {
        if (err) throw err;  
        if (typeof callback === "function") {
          callback(files);
        }
      });
      return "valid filepath";
    } else {
      return "invalid filepath";
    }
  } 
}

module.exports = { // export modules
    checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion,
    checkCompressedVideoDownloadStatus,
    deleteAllVideoData,
    deleteAllFolderData,
    deleteAllFolderData_emptyFolder,
    deleteSpecifiedVideoData,
    deleteSpecifiedVideo,
    delete_video_with_provided_path,
    check_if_file_exits,
    rename_file,
    unlink_file,
    remove_dir,
    read_dir
};