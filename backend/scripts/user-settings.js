"use strict"; 
const path = require("path");
const FileSystem = require("fs"); 

let user_settings_path = "data/user-settings.json";
const user_settings = FileSystem.readFileSync(user_settings_path);
let userSettings = JSON.parse(user_settings); 

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

// updated user settings path
function update_user_settings_path(newPath){  
    if (update_json_path_validity(newPath) == "valid path") {
        const user_settings = FileSystem.readFileSync(newPath);  
        userSettings = JSON.parse(user_settings);
        user_settings_path = newPath;
        return "userSettings updated";
    }
}

// update specified user settings
function updateUserSettingsData(path_array, data) { 
    if (path_array.length !== 0 || path_array !== undefined) { 
        let dataPath = "userSettings";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                eval(dataPath)[path_array[i]] = data;
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
        const newUserSettings = JSON.stringify(userSettings, null, 2);
        FileSystem.writeFileSync(user_settings_path, newUserSettings);
    }  
} 

// get specified user setting
function getUserSettings(path_array) { 
    if (path_array.length !== 0 || path_array !== undefined) { 
        let dataPath = "userSettings";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                return eval(dataPath)[path_array[i]];
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
    }  else  { 
        return userSettings;
    } 
}   

// update video player volume settings
function updateVideoPlayerVolume(videoPlayerVolume, videoPlayerMuted) {
    if (!isNaN(videoPlayerVolume) && typeof videoPlayerMuted == "boolean") {
        updateUserSettingsData(["videoPlayer", "volume"], videoPlayerVolume);
        updateUserSettingsData(["videoPlayer", "muted"], videoPlayerMuted);
        return "updated-video-player-volume";
    } else if (!isNaN(videoPlayerVolume) && typeof videoPlayerMuted !== "boolean") {
        return "muted-invaid";
    } else if (isNaN(videoPlayerVolume) && typeof videoPlayerMuted == "boolean") {
        return "volume-invaid";
    } else {
        return "volume-muted-invaid";
    }
}

// check if video compress true or false
function checkIfVideoCompress(downloadType) {
    try {
        const compressionDownloadType = getUserSettings(["download", "compression", `${downloadType}`]);
        if (typeof compressionDownloadType == "boolean") {
            return compressionDownloadType;
        } else {
            return false; 
        }
    } catch (error) {
        return false; 
    }  
}

// update compress Video Download
function updateCompressVideoDownload(downloadType, bool) { 
    if (typeof bool == "boolean") { 
        updateUserSettingsData(["download", "compression", `${downloadType}`], bool); 
        return `compress video download ${downloadType} updated`; 
    } else {
        return "invalid bool";
    } 
}

module.exports = { // export modules 
    update_user_settings_path,
    updateUserSettingsData,
    getUserSettings,
    updateVideoPlayerVolume,
    checkIfVideoCompress,
    updateCompressVideoDownload
};