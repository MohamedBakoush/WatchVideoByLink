"use strict";
const FileSystem = require("fs");
const { v4: uuidv4 } = require("uuid");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegDownloadResponse = require("./ffmpeg-download-response");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const availableVideos = require("./available-videos");

// check if video compression is downloading before data deletion 
async function checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(videoID, folderIDPath) {
  const id = uuidv4();
  const stopCommpressedVideoDownloadBool = ffmpegCompressionDownload.stopCommpressedVideoDownload(videoID); 
  if (stopCommpressedVideoDownloadBool) {  
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

// try untill compressed video gets killed with signal SIGKILL or finnishes download 
function checkCompressedVideoDownloadStatus(videoID) {
  if (videoData.getVideoData([`${videoID}`, "compression"])) {
    if (videoData.getVideoData([`${videoID}`, "compression", "download"]) == "completed" ||
      videoData.getVideoData([`${videoID}`, "compression", "download"]) == "ffmpeg was killed with signal SIGKILL") {  
      return "start deletion"; 
    } else if(currentDownloadVideos.getCurrentDownloads([videoID, "compression"])){
        if (currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "completed" || 
            currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "ffmpeg was killed with signal SIGKILL") {  
            return "start deletion";    
        } else {   
          return "still downloading";
        }
    } else {  
      return "still downloading";
    }
  } else { // stop interval and start data deletion
      return "start deletion"; 
  }
}

// deletes all video id data
function deleteAllVideoData(fileName, folderIDPath) {
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else if (!Array.isArray(folderIDPath)) {
    return "folderIDPath not array";
  } else {
    try {   
      if (fileName.includes("folder-")) {  
        if ((folderIDPath === undefined || folderIDPath.length === 0) && availableVideos.getAvailableVideos([fileName]) !== "invalid array path"){ 
          deleteAllFolderData([fileName, "content"], fileName, fileName); 
        } else {  
          const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath);
          deleteAllFolderData([...availableVideosFolderIDPath, fileName, "content"], fileName, fileName);
        }    
      } else { 
        deleteSpecifiedVideoData(fileName, folderIDPath); 
      }
      return `deleted-${fileName}-permanently`;
    } catch (error) {
      return `failed-to-delete-${fileName}-permanently`;
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
      deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, currentFolderID, startingFolderID);
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
  } else {
    if (Object.keys(availableVideos.getAvailableVideos(availableVideosFolderIDPath)).length == 0) {   
      const newAvailableVideosFolderPath = [...availableVideosFolderIDPath];
      newAvailableVideosFolderPath.length = newAvailableVideosFolderPath.indexOf(currentFolderID);  
      const insideFolderIDPath = [...newAvailableVideosFolderPath, currentFolderID, "info", "inside-folder"];
      const insideFolderID = availableVideos.getAvailableVideos(insideFolderIDPath);  
      availableVideos.deleteSpecifiedAvailableVideosData(currentFolderID, newAvailableVideosFolderPath); 
      const getFolderContents = availableVideos.getAvailableVideos(availableVideosFolderIDPath);
      if (currentFolderID === startingFolderID) {
        return "starting and current folderID same";
      } else if (insideFolderID === "folder-main") { 
        return "insideFolderID = folder-main";
      } else if (getFolderContents === undefined) {
        return "folder path undefined";
      } else if (Object.keys(getFolderContents).length !== 0) {
        return "folder path not empty";
      } else {
        return deleteAllFolderData(newAvailableVideosFolderPath, insideFolderID, startingFolderID); 
      }
    } else {
      return "folder path not empty";
    }
  }
}

function deleteSpecifiedVideoData(fileName, folderIDPath) {
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else if (folderIDPath !== undefined && !Array.isArray(folderIDPath)) {
    // delete currentDownloadVideos by id if exist 
    currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
    // delete videoData by id if exist 
    videoData.deleteSpecifiedVideoData(fileName); 
    // delete availableVideos by id if exist  
    const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath);
    if (availableVideosFolderIDPath !== "folderIDPath array input empty" && availableVideosFolderIDPath !== "invalid folderIDPath") {
      availableVideos.deleteSpecifiedAvailableVideosData(fileName, availableVideosFolderIDPath); 
    } else {
      availableVideos.deleteSpecifiedAvailableVideosData(fileName, folderIDPath); 
    } 
    // delete specified video by id if exist  
    deleteSpecifiedVideo(fileName); 
    return `deleted-${fileName}-permanently`;
  } else {
    // delete currentDownloadVideos by id if exist 
    currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
    // delete videoData by id if exist 
    videoData.deleteSpecifiedVideoData(fileName); 
    // delete availableVideos by id if exist  
    availableVideos.deleteSpecifiedAvailableVideosData(fileName); 
    // delete specified video by id if exist  
    deleteSpecifiedVideo(fileName);  
    return `deleted-${fileName}-permanently`;
  }
}

// delete specified video from server if exist  
function deleteSpecifiedVideo(fileName) { 
  if (typeof fileName !== "string") {
    return "fileName not string";
  } else {
    if(check_if_file_exits(`./media/video/${fileName}`)){ 
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
                    remove_dir(`./media/video/${fileName}`);
                  }
                });
              });
            }
          });
        }
      });
    } else{ // folder dosent exit 
      return `video-id-${fileName}-data-permanently-deleted`;
    }
  } 
}

// delete video file with provided video path
function delete_video_with_provided_path(videofile, fileName) {
  if (typeof videofile !== "string") {
    return "videofile no string";
  } else if (typeof fileName !== "string") {
    return "fileName no string";
  } else {
    rename_file(videofile, "media/deleted-videos", `deleted-${fileName}.mp4`, () => {
      unlink_file(`media/deleted-videos/deleted-${fileName}.mp4`);
    });   
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
      return "read directory";
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
    deleteSpecifiedVideo,
    delete_video_with_provided_path,
    check_if_file_exits,
    rename_file,
    unlink_file,
    remove_dir,
    read_dir
};