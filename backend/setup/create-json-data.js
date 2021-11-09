"use strict";
const FileSystem = require("fs");

// create available videos main/test json files
function create_available_videos() {
    const availableVideosData = {};
    createJsonFile("./data/available-videos.json", availableVideosData);
    createJsonFile("./__tests__/data/available-videos.test.json", availableVideosData);
}

// create current download videos main/test json files
function create_current_download_videos() {
    const currentDownloadVideosData = {};
    createJsonFile("./data/current-download-videos.json", currentDownloadVideosData);
    createJsonFile("./__tests__/data/current-download-videos.test.json", currentDownloadVideosData);
}

// create data videos main/test json files
function create_data_videos() {
    const dataVideosData = {};
    createJsonFile("./data/data-videos.json", dataVideosData);
    createJsonFile("./__tests__/data/data-videos.test.json", dataVideosData);
}

// create user settings main/test json files
function create_user_settings() {
    const userSettingsData = {
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
            }
        }
    };
    createJsonFile("./data/user-settings.json", userSettingsData);
    createJsonFile("./__tests__/data/user-settings.test.json", userSettingsData);
}

// create json file with provided data
function createJsonFile(path, data) {
    FileSystem.writeFile(path, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err); 
            return err;
        } else {
            console.log(`${path} has been created`);
            return `${path} has been created`;
        }
    });   
}

module.exports = { // export modules 
    create_available_videos,
    create_current_download_videos,
    create_data_videos,
    create_user_settings
};