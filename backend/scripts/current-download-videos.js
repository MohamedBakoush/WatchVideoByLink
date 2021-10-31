"use strict"; 
const path = require("path");
const FileSystem = require("fs"); 

let current_download_videos_path = "data/current-download-videos.json";
const current_download_videos = FileSystem.readFileSync(current_download_videos_path);
let currentDownloadVideos = JSON.parse(current_download_videos);

// check validity of json path
function update_json_path_validity(newPath) {
  if (FileSystem.existsSync(newPath)) {
    try {
      if (path.extname(newPath) === ".json") { 
        return "valid path";
      } else {
        return "input path not json"; 
      }
    } catch (error) {
      return error;
    }
  } else {
    return "invalid path";
  }
}

// updated current download videos path
function update_current_download_videos_path(newPath){ 
    if (update_json_path_validity(newPath) == "valid path") {
        const current_download_videos = FileSystem.readFileSync(newPath);
        currentDownloadVideos = JSON.parse(current_download_videos);
        current_download_videos_path = newPath;
        return "currentDownloadVideos updated";
    }  
}

// returns current video downloads
function getCurrentDownloads(path_array){
  if (path_array !== undefined) {
    if (path_array.length !== 0) {
      let dataPath = "currentDownloadVideos";
      for (let i = 0; i < path_array.length; i++) { 
          if (i == path_array.length - 1) { 
              return eval(dataPath)[path_array[i]];
          } else  { 
              dataPath += `[path_array[${i}]]`;
          }
      } 
    } else {
      return "invalid array path";
    }
  } else  { 
    return currentDownloadVideos;
  } 
}

// return current video downloads to its inital state
function resetCurrentDownloadVideos(){
    currentDownloadVideos = {};
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync(current_download_videos_path, newCurrentDownloadVideos);
    return "resetCurrentDownloadVideos";
}


// check if id provided is corresponding to video download
function findCurrentDownloadByID(id){
    if (currentDownloadVideos[id] === undefined) { // if id is invalid
      return undefined;
    } else { // if valid return videos[id]
      return currentDownloadVideos[id];
    }
} 

function updateCurrentDownloadVideos(path_array, data) {  
  if (path_array.length !== 0 || path_array !== undefined) { 
      let dataPath = "currentDownloadVideos";
      for (let i = 0; i < path_array.length; i++) { 
          if (i == path_array.length - 1) { 
              eval(dataPath)[path_array[i]] = data;
          } else  { 
              dataPath += `[path_array[${i}]]`;
          }
      } 
      const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
      FileSystem.writeFileSync(current_download_videos_path, newCurrentDownloadVideos);  
  }   
}

// deletes current video downloads by for provided id
function updateCurrentDownloadByID(videoID, Data){
    currentDownloadVideos[videoID] = Data;
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync(current_download_videos_path, newCurrentDownloadVideos);
    return currentDownloadVideos[videoID];
}

// delete currentDownloadVideos by id if exist
function deleteSpecifiedCurrentDownloadVideosData(fileName) {
  if (findCurrentDownloadByID(fileName) !== undefined) {
    delete currentDownloadVideos[`${fileName}`]; 
    const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync(current_download_videos_path, deleteCurrentDownloadVideos);
  } else {
    return `${fileName} Unavaiable`; 
  }
}

module.exports = { // export modules  
  update_current_download_videos_path,
  getCurrentDownloads,
  resetCurrentDownloadVideos,
  findCurrentDownloadByID,
  updateCurrentDownloadByID,
  updateCurrentDownloadVideos,
  deleteSpecifiedCurrentDownloadVideosData
};