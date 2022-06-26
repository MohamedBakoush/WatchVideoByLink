const userSettings = require("../../../backend/scripts/user-settings");
const userSettings_json_path = "__tests__/data/user-settings.test.json";

beforeAll(() => {    
    userSettings.update_user_settings_path(userSettings_json_path); 
    userSettings.resetUserSettings();
});

afterEach(() => {    
    userSettings.resetUserSettings();
}); 

describe("update_user_settings_path", () =>  {  
    afterAll(() => { 
        userSettings.update_user_settings_path(userSettings_json_path);
    });

    it("invalid path", () =>  {
        const updated = userSettings.update_user_settings_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = userSettings.update_user_settings_path("__tests__/backend/scripts/user-settings.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("availableVideos updated", () =>  {
        const updated = userSettings.update_user_settings_path(userSettings_json_path);
        expect(updated).toBe("userSettings updated");  
    }); 
}); 

describe("updateUserSettingsData", () =>  {  
    it("undefined undefined", () =>  {
        const updateUserSettingsData = userSettings.updateUserSettingsData(undefined, undefined);
        expect(updateUserSettingsData).toBe("invalid path_array");  
    }); 

    it("invalid path_array", () =>  {
        const updateUserSettingsData = userSettings.updateUserSettingsData(undefined, {});
        expect(updateUserSettingsData).toBe("invalid path_array");  
    }); 

    it("invalid data", () =>  { 
        const updateUserSettingsData = userSettings.updateUserSettingsData([undefined], undefined);
        expect(updateUserSettingsData).toBe("invalid data");  
    }); 
 
    it("Update download compression downloadVideo", () =>  { 
        const get_download_compression_downloadVideo = userSettings.getUserSettings(["download", "compression", "downloadVideo"]); 
        expect(get_download_compression_downloadVideo).toBe(false);   
        const update = userSettings.updateUserSettingsData(["download", "compression", "downloadVideo"], true);
        expect(update).toBe("updateUserSettingsData");  
        const result = userSettings.getUserSettings(["download", "compression", "downloadVideo"]); 
        expect(result).toBe(true);   
    }); 

    it("Update videoPlayer volume", () =>  { 
        const get_videoPlayer_volume = userSettings.getUserSettings(["videoPlayer", "volume"]); 
        expect(get_videoPlayer_volume).toBe(1);   
        const update = userSettings.updateUserSettingsData(["videoPlayer", "volume"], 0.5);
        expect(update).toBe("updateUserSettingsData");  
        const result = userSettings.getUserSettings(["videoPlayer", "volume"]); 
        expect(result).toBe(0.5);   
    }); 

    it("Update download confirmation", () =>  { 
        const get_download_confirmation = userSettings.getUserSettings(["download", "confirmation"]); 
        expect(get_download_confirmation).toMatchObject({
            "downloadVideoStream": false,
            "trimVideo": false,
            "downloadVideo": false
        });   
        const update = userSettings.updateUserSettingsData(["download", "confirmation"], {
            "downloadVideoStream": true,
            "trimVideo": true,
            "downloadVideo": true
        });
        expect(update).toBe("updateUserSettingsData");  
        const result = userSettings.getUserSettings(["download", "confirmation"]); 
        expect(result).toMatchObject({
            "downloadVideoStream": true,
            "trimVideo": true,
            "downloadVideo": true
        });   
    }); 

    it("Update videoPlayer", () =>  { 
        const get_videoPlayer = userSettings.getUserSettings(["videoPlayer"]); 
        expect(get_videoPlayer).toMatchObject({
            "volume": 1,
            "muted": false,
            "chromecast": false,
            "seekForward": 30,
            "seekBackward": 10
        });   
        const update = userSettings.updateUserSettingsData(["videoPlayer"], {
            "volume": 0.5,
            "muted": true,
            "chromecast": true,
            "seekForward": 10,
            "seekBackward": 5
        });
        expect(update).toBe("updateUserSettingsData");  
        const result = userSettings.getUserSettings(["videoPlayer"]); 
        expect(result).toMatchObject({
            "volume": 0.5,
            "muted": true,
            "chromecast": true,
            "seekForward": 10,
            "seekBackward": 5
        });   
    }); 
}); 

describe("getUserSettings", () =>  {   
    it("No input - path array", () =>  {
        const getUserSettings = userSettings.getUserSettings();
        expect(getUserSettings).toMatchObject({}); 
    }); 

    it("Empty path array", () =>  {
        const getUserSettings = userSettings.getUserSettings([]);
        expect(getUserSettings).toBe(undefined); 
    }); 

    it("Invalid path array", () =>  {
        const getUserSettings = userSettings.getUserSettings([undefined]);
        expect(getUserSettings).toBe(undefined); 
    }); 

    it("Get videoPlayer", () =>  {  
        const get_data = userSettings.getUserSettings(["videoPlayer"]); 
        expect(get_data).toMatchObject({
            "volume": 1,
            "muted": false,
            "chromecast": false,
            "seekForward": 30,
            "seekBackward": 10
        });   
    });

    it("Get download", () =>  {  
        const get_data = userSettings.getUserSettings(["download"]); 
        expect(get_data).toMatchObject({
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
        });   
    });
}); 

describe("resetUserSettings", () =>  {  
    it("resetUserSettings", () =>  {
        const reset = userSettings.resetUserSettings();
        expect(reset).toBe("resetUserSettings");  
        const data = userSettings.getUserSettings();
        expect(data).toMatchObject({
            "videoPlayer": {
                "volume": 1,
                "muted": false,
                "chromecast": false,
                "seekForward": 30,
                "seekBackward": 10
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
        }); 
    });
}); 

describe("updateVideoPlayerVolume", () =>  {
    it("volume-muted-invaid", () =>  {   
        const updateVolume = userSettings.updateVideoPlayerVolume(undefined, undefined);
        expect(updateVolume).toBe("volume-muted-invaid");
    }); 

    it("volume-invaid", () =>  {   
        const updateVolume = userSettings.updateVideoPlayerVolume(undefined, false);
        expect(updateVolume).toBe("volume-invaid");
    }); 

    it("muted-invaid", () =>  {   
        const updateVolume = userSettings.updateVideoPlayerVolume(0.1, undefined);
        expect(updateVolume).toBe("muted-invaid");
    }); 

    it("updated-video-player-volume", () =>  {   
        const updateVolume = userSettings.updateVideoPlayerVolume(0.1, true);
        expect(updateVolume).toBe("updated-video-player-volume");
    }); 
}); 

describe("checkIfVideoCompress", () =>  {
    it("Invalid downloadType", () =>  {
        const videoCompress = userSettings.checkIfVideoCompress(undefined);
        expect(videoCompress).toBe(false);
    });  

    it("downloadVideoStream true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideoStream", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadVideoStream");
        expect(videoCompress).toBe(true);
    });  

    it("downloadVideoStream false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideoStream", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadVideoStream");
        expect(videoCompress).toBe(false);
    });  

    it("downloadVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadVideo");
        expect(videoCompress).toBe(true);
    });  
    
    it("downloadVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadVideo");
        expect(videoCompress).toBe(false);
    });  

    it("trimVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("trimVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("trimVideo");
        expect(videoCompress).toBe(true);
    });  
    
    it("trimVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("trimVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("trimVideo");
        expect(videoCompress).toBe(false);
    });  

    it("downloadUploadedVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadUploadedVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadUploadedVideo");
        expect(videoCompress).toBe(true);
    });  
    
    it("downloadUploadedVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadUploadedVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
        const videoCompress = userSettings.checkIfVideoCompress("downloadUploadedVideo");
        expect(videoCompress).toBe(false);
    }); 
}); 

describe("updateCompressVideoDownload", () =>  {
    it("No Input", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload();
        expect(updateCompressVideoDownload).toBe("invalid bool");
    });  

    it("Invalid downloadType", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload(undefined);
        expect(updateCompressVideoDownload).toBe("invalid bool");
    });  

    it("Invalid downloadType Invalid bool", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload(undefined, undefined);
        expect(updateCompressVideoDownload).toBe("invalid bool");
    });  

    it("Valid downloadType Invalid bool", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideoStream", undefined);
        expect(updateCompressVideoDownload).toBe("invalid bool");
    });  

    it("Invalid downloadType Valid bool", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload(undefined, true);
        expect(updateCompressVideoDownload).toBe("invalid downloadType");
    });  

    it("downloadVideoStream true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideoStream", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
    });  

    it("downloadVideoStream false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideoStream", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
    });  

    it("downloadVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
    });  
    
    it("downloadVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
    });  

    it("trimVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("trimVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
    });  
    
    it("trimVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("trimVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
    });  

    it("downloadUploadedVideo true", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadUploadedVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
    });  
    
    it("downloadUploadedVideo false", () =>  {
        const updateCompressVideoDownload = userSettings.updateCompressVideoDownload("downloadUploadedVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
    }); 
}); 