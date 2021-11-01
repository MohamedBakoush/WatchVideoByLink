"use strict"; 
const path = require("path");
const FileSystem = require("fs"); 

let data_videos_path = "data/data-videos.json";
const data_videos  = FileSystem.readFileSync(data_videos_path);
let videoData = JSON.parse(data_videos);

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

  
// updated data videos path
function update_data_videos_path(newPath){  
    if (update_json_path_validity(newPath) == "valid path") {
        const data_videos  = FileSystem.readFileSync(newPath);
        videoData = JSON.parse(data_videos);
        data_videos_path = newPath;
        return "videoData updated";
    }
}

// returns current video downloads
function getVideoData(path_array){ 
    if (path_array !== undefined) { 
        if (path_array.length !== 0) { 
            let dataPath = "videoData";
            for (let i = 0; i < path_array.length; i++) { 
                if (i == path_array.length - 1) { 
                    return eval(dataPath)[path_array[i]];
                } else  { 
                    dataPath += `[path_array[${i}]]`;
                }
            } 
        }  else  { 
            return "invalid array path";
        } 
    } else {
        return videoData;
    }
}

// return video data to its inital state
function resetVideoData(){
    videoData = {};
    const newVideoData = JSON.stringify(videoData, null, 2);
    FileSystem.writeFileSync(data_videos_path, newVideoData);
    return "resetVideoData";
}

// check if id provided is corresponding to videos
function findVideosByID(id){
    if (videoData[id] === undefined) { // if id is invalid
        return undefined;
    } else { // if valid return videos[id]
        return videoData[id];
    }
}

// updates video data by for provided id
function updateVideoDataByID(videoID, Data){
    videoData[videoID] = Data;
    const newVideoData = JSON.stringify(videoData, null, 2);
    FileSystem.writeFileSync(data_videos_path, newVideoData);
    return videoData[videoID];
}

// update video data
function updateVideoData(path_array, data) {
    if (path_array.length !== 0 || path_array !== undefined) { 
        let dataPath = "videoData";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                eval(dataPath)[path_array[i]] = data;
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
        const newVideoData = JSON.stringify(videoData, null, 2);
        FileSystem.writeFileSync(data_videos_path, newVideoData);
    }    
}

// delete videoData by id if exist
function deleteSpecifiedVideoData(fileName) {
    if (findVideosByID(fileName) !== undefined) {
        delete videoData[`${fileName}`]; 
        const deleteVideoData = JSON.stringify(videoData, null, 2);
        FileSystem.writeFileSync(data_videos_path, deleteVideoData);
    } else {
        return `${fileName} Unavaiable`; 
    }  
}

module.exports = { // export modules 
    update_data_videos_path,
    getVideoData,
    resetVideoData,
    findVideosByID, 
    updateVideoDataByID,
    updateVideoData,
    deleteSpecifiedVideoData,
};