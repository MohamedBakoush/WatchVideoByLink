"use strict"; 
const FileSystem = require("fs"); 
const checkPathValidity = require("./check-path-validity");

let user_settings_path = "data/user-settings.json";
const user_settings = FileSystem.readFileSync(user_settings_path);
let userSettings = JSON.parse(user_settings); 

// updated user settings path
function update_user_settings_path(newPath){  
    const checkJsonValidity = checkPathValidity.update_json_path_validity(newPath);
    if (checkJsonValidity == "valid path") {
        const user_settings = FileSystem.readFileSync(newPath);  
        userSettings = JSON.parse(user_settings);
        user_settings_path = newPath;
        return "userSettings updated";
    } else  { 
        return checkJsonValidity;
    }
}

// update specified user settings
function updateUserSettingsData(path_array, data) { 
    if (Array.isArray(path_array) && path_array.length !== 0) {
        if (data !== undefined) {
            let dataPath = "userSettings";
            for (let i = 0; i < path_array.length; i++) { 
                if (i == path_array.length - 1) { 
                    eval(dataPath)[path_array[i]] = data;
                    const newUserSettings = JSON.stringify(userSettings, null, 2);
                    FileSystem.writeFileSync(user_settings_path, newUserSettings);
                    return "updateUserSettingsData";
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

// get specified user setting
function getUserSettings(path_array) { 
    if (Array.isArray(path_array)) {
        if (path_array.length !== 0) { 
            let dataPath = "userSettings";
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
        return userSettings;
    }
}   

// return user settings to its inital state
function resetUserSettings(){
    try {
        userSettings = {
            "videoPlayer": {
                "volume": 1,
                "muted": false,
                "chromecast": false
            },
            "download": {
                "compression": {
                    "downloadVideoStream": false,
                    "downloadVideo": false,
                    "trimVideo": false,
                    "downloadUploadedVideo": false
                },
                "confirmation": {
                    "downloadVideoStream": false,
                    "trimVideo": false,
                    "downloadVideo": false
                }
            }
        }; 
        const newUserSettings = JSON.stringify(userSettings, null, 2);
        FileSystem.writeFileSync(user_settings_path, newUserSettings);
        return "resetUserSettings";
    } catch (error) {
        return error;
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
    resetUserSettings,
    updateVideoPlayerVolume,
    checkIfVideoCompress,
    updateCompressVideoDownload
};