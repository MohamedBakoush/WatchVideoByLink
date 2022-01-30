"use strict";
const FileSystem = require("fs");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const availableVideos = require("./available-videos");

// set timeout for a set amount of time in ms
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

// check if video compression is downloading before data deletion 
async function checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(videoID, folderIDPath) {
  // stop video compression
  const stopCommpressedVideoDownloadBool = ffmpegCompressionDownload.stopCommpressedVideoDownload(videoID); 
  if (stopCommpressedVideoDownloadBool) { 
    await checkCompressedVideoDownloadStatus(videoID);
    return deleteAllVideoData(videoID, folderIDPath); 
  } else { // compressed video isn't downloading 
    return deleteAllVideoData(videoID, folderIDPath); 
  }
}

// try untill compressed video gets killed with signal SIGKILL or finnishes download 
async function checkCompressedVideoDownloadStatus(videoID) {
    try {
        if (videoData.getVideoData([`${videoID}`, "compression"])) {
            if (videoData.getVideoData([`${videoID}`, "compression", "download"]) == "completed" ||
                videoData.getVideoData([`${videoID}`, "compression", "download"]) == "ffmpeg was killed with signal SIGKILL") {  
                return "start deletion"; 
            } else if(currentDownloadVideos.getCurrentDownloads([videoID, "compression"])){
                if (currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "completed" || 
                    currentDownloadVideos.getCurrentDownloads([videoID, "compression", "download-status"]) == "ffmpeg was killed with signal SIGKILL") {  
                    return "start deletion";    
                } else {  
                    await sleep(200);
                    return checkCompressedVideoDownloadStatus(videoID); 
                }
            } else {  
                await sleep(200);
                return checkCompressedVideoDownloadStatus(videoID); 
            }
        } else { // stop interval and start data deletion
            return "start deletion"; 
        }
    } catch (error) { 
        await sleep(200);
        return checkCompressedVideoDownloadStatus(videoID); 
    } 
}

// deletes all video id data
function deleteAllVideoData(fileName, folderIDPath) {
  try {   
    if (fileName.includes("folder-")) {  
      if ((folderIDPath === undefined || folderIDPath.length === 0) && availableVideos.getAvailableVideos([fileName]) !== "invalid array path"){ 
        deleteAllFolderData([fileName, "content"], fileName, fileName); 
      } else {  
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath);
        deleteAllFolderData([...availableVideosFolderIDPath, fileName, "content"], fileName, fileName);
      }    
    } else { 
      // delete currentDownloadVideos by id if exist 
      currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
      // delete videoData by id if exist 
      videoData.deleteSpecifiedVideoData(fileName); 
      // delete availableVideos by id if exist  
      if (folderIDPath === undefined || folderIDPath.length === 0) {
        availableVideos.deleteSpecifiedAvailableVideosData(fileName); 
      } else {
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array(folderIDPath);
        if (availableVideosFolderIDPath !== "folderIDPath array input empty" && availableVideosFolderIDPath !== "invalid folderIDPath") {
          availableVideos.deleteSpecifiedAvailableVideosData(fileName, availableVideosFolderIDPath); 
        } else {
          availableVideos.deleteSpecifiedAvailableVideosData(fileName, folderIDPath); 
        } 
      }
      // delete specified video by id if exist  
      deleteSpecifiedVideo(fileName); 
    }
    return `deleted-${fileName}-permanently`;
  } catch (error) {
    return `failed-to-delete-${fileName}-permanently`;
  }
}

// delete all folder content plus selected folder
// 1. If folder is detected go in, Delete all video data found 
// 2. if folder is empty delete folder and go up one folder, if folder contained folders repeat 1 
// 3. stop when current folder id reached starting folder id
function deleteAllFolderData(availableVideosFolderIDPath, currentFolderID, startingFolderID) { 
  if (Object.keys(availableVideos.getAvailableVideos([...availableVideosFolderIDPath])).length == 0) {
    const newAvailableVideosFolderPath = [...availableVideosFolderIDPath];
    newAvailableVideosFolderPath.length = newAvailableVideosFolderPath.indexOf(currentFolderID);  
    const insideFolderIDPath = [...newAvailableVideosFolderPath, currentFolderID, "info", "inside-folder"];
    const insideFolderID = availableVideos.getAvailableVideos(insideFolderIDPath);  
    availableVideos.deleteSpecifiedAvailableVideosData(currentFolderID, newAvailableVideosFolderPath);
    if (currentFolderID !== startingFolderID && insideFolderID !== "folder-main" && Object.keys(availableVideos.getAvailableVideos(newAvailableVideosFolderPath)).length == 0) {
      deleteAllFolderData(newAvailableVideosFolderPath, insideFolderID, startingFolderID); 
    } 
  } else {
    Object.keys(availableVideos.getAvailableVideos([...availableVideosFolderIDPath])).forEach(function(fileName, i, array) {
      if (fileName.includes("folder-")) {
        deleteAllFolderData([...availableVideosFolderIDPath, fileName, "content"], fileName, startingFolderID); 
      } else { 
        // delete specified video by id from availableVideos
        availableVideos.deleteSpecifiedAvailableVideosData(fileName, availableVideosFolderIDPath);
        // delete currentDownloadVideos by id if exist 
        currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
        // delete videoData by id if exist 
        videoData.deleteSpecifiedVideoData(fileName); 
        // delete specified video by id if exist  
        deleteSpecifiedVideo(fileName); 
      }
      if (i == array.length - 1) {
        try { 
          if (Object.keys(availableVideos.getAvailableVideos([...availableVideosFolderIDPath])).length == 0) {   
            const newAvailableVideosFolderPath = [...availableVideosFolderIDPath];
            newAvailableVideosFolderPath.length = newAvailableVideosFolderPath.indexOf(currentFolderID);  
            const insideFolderIDPath = [...newAvailableVideosFolderPath, currentFolderID, "info", "inside-folder"];
            const insideFolderID = availableVideos.getAvailableVideos(insideFolderIDPath);  
            availableVideos.deleteSpecifiedAvailableVideosData(currentFolderID, newAvailableVideosFolderPath);
            if (currentFolderID !== startingFolderID && insideFolderID !== "folder-main" &&  Object.keys(availableVideos.getAvailableVideos(availableVideosFolderIDPath)).length == 0) { 
              deleteAllFolderData(newAvailableVideosFolderPath, insideFolderID, startingFolderID); 
            } 
          } 
        } catch (error) {
          return error;
        }
      }
    });
  }
}
 
// delete specified video from server if exist  
function deleteSpecifiedVideo(fileName) {  
  // check if folder exists
  if(FileSystem.existsSync(`./media/video/${fileName}`)){ 
    FileSystem.readdir(`./media/video/${fileName}`, (err, files) => {
      if (err) throw err;
      if (!files.length) {
        // directory empty, delete folder
        FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
          if (err) throw err; 
          return `video-id-${fileName}-data-permanently-deleted`;
        });
      } else {
        // folder not empty
        FileSystem.readdir(`./media/video/${fileName}`, (err, files) => {
          if (err) throw err;
          let completedCount = 0;
          for (const file of files) {
            completedCount += 1;
            FileSystem.rename(`./media/video/${fileName}/${file}`, `media/deleted-videos/deleted-${file}`, (err) => {
              if (err) throw err;
              // delete the video
              FileSystem.unlink(`media/deleted-videos/deleted-${file}`, (err) => {
                if (err) throw err;
                if (files.length == completedCount) { // if file length is same as completedCount then delete folder
                  // reset completedCount
                  completedCount = 0;
                  // delete folder
                  FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
                    if (err) throw err;  
                    return `video-id-${fileName}-data-permanently-deleted`;
                  });
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
        return "file renamed";
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
      return "file deleted";
    } else {
      return "invalid filepath";
    }
  } 
}

module.exports = { // export modules
    sleep,
    checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion,
    checkCompressedVideoDownloadStatus,
    deleteAllVideoData,
    deleteAllFolderData,
    deleteSpecifiedVideo,
    delete_video_with_provided_path,
    check_if_file_exits,
    rename_file,
    unlink_file
};