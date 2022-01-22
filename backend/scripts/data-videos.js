"use strict"; 
const FileSystem = require("fs"); 
const checkPathValidity = require("./check-path-validity");

let data_videos_path = "data/data-videos.json";
const data_videos  = FileSystem.readFileSync(data_videos_path);
let videoData = JSON.parse(data_videos);
  
// updated data videos path
function update_data_videos_path(newPath){  
    const checkJsonValidity = checkPathValidity.update_json_path_validity(newPath);
    if (checkJsonValidity == "valid path") {
        const data_videos  = FileSystem.readFileSync(newPath);
        videoData = JSON.parse(data_videos);
        data_videos_path = newPath;
        return "videoData updated";
    } else {
        return checkJsonValidity;
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
    updateVideoData,
    deleteSpecifiedVideoData,
};