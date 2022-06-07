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
    if (Array.isArray(path_array)) {
        if (path_array.length !== 0) { 
            let dataPath = "videoData";
            for (let i = 0; i < path_array.length; i++) { 
                if (i == path_array.length - 1) { 
                    try {
                        if (eval(dataPath)[path_array[i]] !== undefined) {
                            return eval(dataPath)[path_array[i]];
                        } else {
                            return undefined;
                        }
                    } catch (error) {
                        return undefined;
                    }
                } else  { 
                    dataPath += `[path_array[${i}]]`;
                }
            } 
        }  else  { 
            return undefined;
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
    if (Array.isArray(path_array) && path_array.length !== 0) {
        if (data !== undefined) {
            let dataPath = "videoData";
            for (let i = 0; i < path_array.length; i++) { 
                if (i == path_array.length - 1) { 
                    eval(dataPath)[path_array[i]] = data;
                    const newVideoData = JSON.stringify(videoData, null, 2);
                    FileSystem.writeFileSync(data_videos_path, newVideoData);
                    return "updateVideoData";  
                } else  { 
                    dataPath += `[path_array[${i}]]`;
                }
            }     
        } else {
            return "invalid data";
        }
    } else {
        return "invalid path_array";
    }     
}

// input selected element into temp-path for a downloading video avaiable at avaiable-videos
function inputSelectedIDIntoFolderID_tempPath(selectedID, folderID) { 
    if (typeof selectedID == "string" && typeof folderID == "string") {
        if (getVideoData([`${selectedID}`,"compression", "temp-path"]) !== undefined) {
            const temp_path_array = getVideoData([`${selectedID}`,"compression", "temp-path"]); 
            updateVideoData([`${selectedID}`,"compression", "temp-path"], [...temp_path_array, folderID]);
            return "updated-temp-path";
        } else {
            return "failed-updated-temp-path";
        }
    } else if (typeof selectedID !== "string" && typeof folderID == "string") {
       return "invalid selectedID";
    } else if (typeof selectedID == "string" && typeof folderID !== "string") {
        return "invalid folderID"; 
    } else {
        return "invalid selectedID & folderID"; 
    }
}

// input selected element id out of temp-path for a downloading video avaiable at avaiable-videos
function inputSelectedIDOutOfFolderID_tempPath(selectedID, folderIDPath) { 
    if (Array.isArray(folderIDPath) && typeof selectedID == "string") {
        if (getVideoData([`${selectedID}`,"compression", "temp-path"]) !== undefined) {
            updateVideoData([`${selectedID}`,"compression", "temp-path"], folderIDPath);
            return "updated-temp-path";
        } else {
            return "failed-updated-temp-path";
        }
    } else if (!Array.isArray(folderIDPath) && typeof selectedID == "string") {
        return "invalid folderIDPath";
    } else if (Array.isArray(folderIDPath) && typeof selectedID !== "string") {
        return "invalid selectedID";
    } else {
        return "invalid selectedID & folderIDPath"; 
    }
}

// delete videoData by id if exist
function deleteSpecifiedVideoData(fileName) {
    if (findVideosByID(fileName) !== undefined) {
        delete videoData[`${fileName}`]; 
        const deleteVideoData = JSON.stringify(videoData, null, 2);
        FileSystem.writeFileSync(data_videos_path, deleteVideoData);
        return `${fileName} deleted`;
    } else {
        return `${fileName} Unavaiable`; 
    }  
}

// check if original video src path exits
async function checkIfVideoSrcOriginalPathExits(videoSrc) {
  try {
    if (videoSrc.includes("/video/")) { // if videoSrc includes /video/, split src at /video/ and attempt to findVideosByID
      const videoDetails = await findVideosByID(videoSrc.split("/video/")[1]);
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
      const videoDetails = await findVideosByID(videoSrc.split("/compressed/")[1]);
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

module.exports = { // export modules 
    update_data_videos_path,
    getVideoData,
    resetVideoData,
    findVideosByID, 
    updateVideoData,
    inputSelectedIDIntoFolderID_tempPath,
    inputSelectedIDOutOfFolderID_tempPath,
    deleteSpecifiedVideoData,
    checkIfVideoSrcOriginalPathExits
};