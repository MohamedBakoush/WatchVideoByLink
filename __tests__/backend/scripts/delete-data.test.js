const deleteData = require("../../../backend/scripts/delete-data");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const availableVideos = require("../../../backend/scripts/available-videos");
const availableVideos_json_path = "__tests__/data/available-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");
const FileSystem = require("fs");

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
    availableVideos.update_available_videos_path(availableVideos_json_path); 
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    dataVideos.resetVideoData();
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.resetCurrentDownloadVideos();
}); 

describe("checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion", () =>  {    
    it("No Input", () =>  {
        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion();
        expect(checkCompressedBeforeDeletion).toBe("videoID not string");
    });    

    it("Invalid videoID", () =>  {
        const fileName = uuidv4();
        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(fileName);
        expect(deleteSpecifiedVideo).toBe(`deleted-${fileName}-permanently`);
    });   

    it("Valid videoID - no compression", () =>  {
        const fileName = uuidv4();
        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${fileName}-permanently`);
    });    

    it("Valid videoID - compression - starting", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "starting"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "starting"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID - compression -  downloading", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                "download-status" : "20.27"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID - compression - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();  
 
        const dataVideos_data = {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        };
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    }); 

    it("Valid videoID - compression - completed", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${fileName}-permanently`);
    });     

    it("Invalid videoID, empty folderIDPath", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");   

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, []);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${fileName}-permanently`);
    });   

    it("Valid videoID, empty folderIDPath - compression - starting", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "starting"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "starting"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, []);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, empty folderIDPath - compression -  downloading", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                "download-status" : "20.27"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, []);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, empty folderIDPath - compression - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();  
 
        const dataVideos_data = {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        };
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, []);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    }); 

    it("Valid videoID, empty folderIDPath - compression - completed", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, []);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${fileName}-permanently`);
    });     

    it("Invalid fileName, Invalid folderIDPath", () =>  {
        const fileName = uuidv4();
        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [undefined]);
        expect(checkCompressedBeforeDeletion).toBe("invalid folderIDPath");
    });   
    
    it("Valid videoID, Invalid folderIDPath - compression - starting", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "starting"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "starting"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [undefined]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, Invalid folderIDPath- compression -  downloading", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                "download-status" : "20.27"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [undefined]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, Invalid folderIDPath - compression - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();  
 
        const dataVideos_data = {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        };
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [undefined]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    }); 

    it("Valid videoID, Invalid folderIDPath - compression - completed", () =>  {
        const fileName = uuidv4();   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [undefined]);
        expect(checkCompressedBeforeDeletion).toBe("invalid folderIDPath");
    });     

    it("Valid fileName, Valid folderIDPath", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(createFolder2.folderID, [createFolder1.folderID]);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${createFolder2.folderID}-permanently`);
        
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({});
    });   
    
    it("Valid videoID, Valid folderIDPath - compression - starting", () =>  {
        const fileName = uuidv4();   

        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "starting"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "starting"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [createFolder1.folderID]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, Valid folderIDPath- compression -  downloading", () =>  {
        const fileName = uuidv4();   

        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                "download-status" : "20.27"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [createFolder1.folderID]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    });   

    it("Valid videoID, Valid folderIDPath - compression - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();   

        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   

 
        const dataVideos_data = {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        };
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [createFolder1.folderID]);
        expect(checkCompressedBeforeDeletion.message).toBe("initializing");
    }); 

    it("Valid videoID, Valid folderIDPath - compression - completed", () =>  {
        const fileName = uuidv4();   
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");

        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   


        availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 

        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 

        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const checkCompressedBeforeDeletion = deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(fileName, [createFolder1.folderID]);
        expect(checkCompressedBeforeDeletion).toBe(`deleted-${fileName}-permanently`);
    });   
});

describe("checkCompressedVideoDownloadStatus", () =>  {    
    it("No Input", () =>  {
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus();
        expect(checkCompressedVideoDownloadStatus).toBe("videoID not string");
    });    
    
    it("Invalid videoID: videoData", () =>  {
        const fileName = uuidv4();
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("invalid videoID trough videoData");
    });  

    it("Invalid videoID: CurrentDownloads", () =>  {
        const fileName = uuidv4();
        const dataVideos_data = {
            compression : {
                download: "starting"
            }
        };
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData"); 

        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("invalid videoID trough CurrentDownloads");
    });  

    it("Valid videoID: still downloading", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "20.27%"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("still downloading");
    });  

    it("Valid videoID: videoData - completed", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    });  

    it("Valid videoID: videoData - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "20.27"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    });  

    it("Valid videoID: CurrentDownloads - completed", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "20.27%"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    });  

    it("Valid videoID: CurrentDownloads - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "20.27%"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    });  

    it("Valid videoID: videoData, CurrentDownloads - completed", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "completed"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "completed"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    });  

    it("Valid videoID: videoData, CurrentDownloads - ffmpeg was killed with signal SIGKILL", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([`${fileName}`], {
            compression : {
                download: "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateVideoData).toBe("updateVideoData"); 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            compression : { 
                "download-status" : "ffmpeg was killed with signal SIGKILL"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const checkCompressedVideoDownloadStatus = deleteData.checkCompressedVideoDownloadStatus(fileName);
        expect(checkCompressedVideoDownloadStatus).toBe("start deletion");
    }); 
});

describe("deleteAllVideoData", () =>  {    
    it("No Input", () =>  {
        const deleteSpecifiedVideo = deleteData.deleteAllVideoData();
        expect(deleteSpecifiedVideo).toBe("fileName not string");
    });    

    it("Invalid videoID", () =>  {
        const fileName = uuidv4();
        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(fileName);
        expect(deleteSpecifiedVideo).toBe(`deleted-${fileName}-permanently`);
    });   

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  

        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(fileName);
        expect(deleteSpecifiedVideo).toBe(`deleted-${fileName}-permanently`);
    });   

    it("Valid fileName, empty folderIDPath", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");   

        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(fileName, []);
        expect(deleteSpecifiedVideo).toBe(`deleted-${fileName}-permanently`);
    });   
    
    it("Valid fileName, Invalid folderIDPath", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");   

        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(fileName, [undefined]);
        expect(deleteSpecifiedVideo).toBe("invalid folderIDPath");
    });   
    
    it("Valid fileName, Valid folderIDPath", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   

        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(createFolder2.folderID, [createFolder1.folderID]);
        expect(deleteSpecifiedVideo).toBe(`deleted-${createFolder2.folderID}-permanently`);
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({});
    });   
});

describe("deleteAllFolderData", () =>  {    
    it("No Input", () =>  {
        const deleteAllFolderData = deleteData.deleteAllFolderData();
        expect(deleteAllFolderData).toBe("availableVideosFolderIDPath not array");
    });      

    it("Invalid availableVideosFolderIDPath", () =>  {
        const deleteAllFolderData = deleteData.deleteAllFolderData([uuidv4(), uuidv4()]);
        expect(deleteAllFolderData).toBe("invalid availableVideosFolderIDPath");
    });  

    it("Valid availableVideosFolderIDPath", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath);
        expect(deleteAllFolderData).toBe("currentFolderID not string");
    });    

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID", () =>  {   
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, uuidv4());
        expect(deleteAllFolderData).toBe("startingFolderID not string");
    });    

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID, Invalid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, fileName, fileName);
        expect(deleteAllFolderData).toBe("invalid currentFolderID");
    });    

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Invalid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, createFolder2.folderID, fileName);
        expect(deleteAllFolderData).toBe(`deleted-${createFolder1.folderID}-permanently`);
    });

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID, Valid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, fileName, createFolder2.folderID);
        expect(deleteAllFolderData).toBe("invalid currentFolderID");
    });

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Valid startingFolderID", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, createFolder2.folderID, createFolder2.folderID);
        expect(deleteAllFolderData).toBe(`deleted-${createFolder2.folderID}-permanently`);
    }); 

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Valid startingFolderID", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, createFolder2.folderID, createFolder1.folderID);
        expect(deleteAllFolderData).toBe(`deleted-${createFolder1.folderID}-permanently`);
    });               
});

describe("deleteAllFolderData_emptyFolder", () =>  {    
    it("No Input", () =>  {
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder();
        expect(deleteAllFolderData_emptyFolder).toBe("availableVideosFolderIDPath not array");
    });      

    it("Invalid availableVideosFolderIDPath", () =>  {
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder([uuidv4(), uuidv4()]);
        expect(deleteAllFolderData_emptyFolder).toBe("invalid availableVideosFolderIDPath");
    });  

    it("Valid availableVideosFolderIDPath", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath);
        expect(deleteAllFolderData_emptyFolder).toBe("currentFolderID not string");
    });    

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID", () =>  {   
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData = deleteData.deleteAllFolderData(availableVideosFolderIDPath, uuidv4());
        expect(deleteAllFolderData).toBe("startingFolderID not string");
    });  

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID, Invalid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, fileName, fileName);
        expect(deleteAllFolderData_emptyFolder).toBe("invalid currentFolderID");
    });    

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Invalid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, createFolder2.folderID, fileName);
        expect(deleteAllFolderData_emptyFolder).toBe(`deleted-${createFolder1.folderID}-permanently`);
    });

    it("Valid availableVideosFolderIDPath, Invalid currentFolderID, Valid startingFolderID", () =>  {
        const fileName = uuidv4();
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, fileName, createFolder2.folderID);
        expect(deleteAllFolderData_emptyFolder).toBe("invalid currentFolderID");
    });

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Valid startingFolderID", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, createFolder2.folderID, createFolder2.folderID);
        expect(deleteAllFolderData_emptyFolder).toBe(`deleted-${createFolder2.folderID}-permanently`);
    }); 

    it("Valid availableVideosFolderIDPath, Valid currentFolderID, Valid startingFolderID", () =>  {
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const availableVideosFolderIDPath = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]); 
        const deleteAllFolderData_emptyFolder = deleteData.deleteAllFolderData_emptyFolder(availableVideosFolderIDPath, createFolder2.folderID, createFolder1.folderID);
        expect(deleteAllFolderData_emptyFolder).toBe(`deleted-${createFolder1.folderID}-permanently`);
    });               
});

describe("deleteSpecifiedVideoData", () =>  {    
    it("No Input", () =>  {
        const deleteSpecifiedVideoData = deleteData.deleteSpecifiedVideoData();
        expect(deleteSpecifiedVideoData).toBe("fileName not string");
    });         

    it("1: Valid fileName", () =>  {
        const fileName = uuidv4();

        const updateAvailableVideos_data = {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        };
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], updateAvailableVideos_data);
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  
        const get_available_video_data_1 = availableVideos.getAvailableVideos([fileName]);
        expect(get_available_video_data_1).toMatchObject(updateAvailableVideos_data);   

        const currentDownloadVideos_data = {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        };
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], currentDownloadVideos_data);
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_current_download_data_1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_1).toMatchObject(currentDownloadVideos_data);  

        const dataVideos_data = {
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4",
                "download" : "completed",
              },
              "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download": "completed"
              },
              "thumbnail": {
                "path": {},
                "download": "completed"
              }
        };
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_video_data_1 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_1).toMatchObject(dataVideos_data);   

        const deleteSpecifiedVideoData = deleteData.deleteSpecifiedVideoData(fileName);
        expect(deleteSpecifiedVideoData).toBe(`deleted-${fileName}-permanently`);

        const get_current_download_data_2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_2).toBe(undefined); 
        const get_available_video_data_2 = availableVideos.getAvailableVideos([fileName]);
        expect(get_available_video_data_2).toBe(undefined);   
        const get_video_data_2 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_2).toBe(undefined); 
    });    
    
    it("2: Valid fileName, Valid folderIDPath", () =>  {
        const fileName = uuidv4();

        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
        
        const updateAvailableVideos_data = {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        };
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], updateAvailableVideos_data);
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  
        const get_available_video_data_1 = availableVideos.getAvailableVideos([fileName]);
        expect(get_available_video_data_1).toMatchObject(updateAvailableVideos_data);   

        availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder.folderID);

        const currentDownloadVideos_data = {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        };
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], currentDownloadVideos_data);
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_current_download_data_1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_1).toMatchObject(currentDownloadVideos_data);  

        const dataVideos_data = {
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4",
                "download" : "completed",
              },
              "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download": "completed"
              },
              "thumbnail": {
                "path": {},
                "download": "completed"
              }
        };
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_video_data_1 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_1).toMatchObject(dataVideos_data);   

        const deleteSpecifiedVideoData = deleteData.deleteSpecifiedVideoData(fileName, [createFolder.folderID]);
        expect(deleteSpecifiedVideoData).toBe(`deleted-${fileName}-permanently`);

        const get_current_download_data_2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_2).toBe(undefined); 
        const get_available_video_data_2 = availableVideos.getAvailableVideos([createFolder.folderID, "content", fileName]);
        expect(get_available_video_data_2).toBe(undefined);   
        const get_available_video_data_3 = availableVideos.getAvailableVideos([createFolder.folderID]);
        expect(get_available_video_data_3).toMatchObject({"content": {}, "info": {"inside-folder": "folder-main", "title": "title_folder_test"}});   
        const get_video_data_2 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_2).toBe(undefined); 
    }); 
    
    it("3: Valid fileName, Valid folderIDPath", () =>  {
        const fileName = uuidv4();

        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
        
        const updateAvailableVideos_data = {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        };
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], updateAvailableVideos_data);
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  
        const get_available_video_data_1 = availableVideos.getAvailableVideos([fileName]);
        expect(get_available_video_data_1).toMatchObject(updateAvailableVideos_data);   

        availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder.folderID);

        const currentDownloadVideos_data = {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        };
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], currentDownloadVideos_data);
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_current_download_data_1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_1).toMatchObject(currentDownloadVideos_data);  

        const dataVideos_data = {
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4",
                "download" : "completed",
              },
              "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download": "completed"
              },
              "thumbnail": {
                "path": {},
                "download": "completed"
              }
        };
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_video_data_1 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_1).toMatchObject(dataVideos_data);   

        const deleteSpecifiedVideoData = deleteData.deleteSpecifiedVideoData(fileName, [createFolder.folderID, "content"]);
        expect(deleteSpecifiedVideoData).toBe(`deleted-${fileName}-permanently`);

        const get_current_download_data_2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_current_download_data_2).toBe(undefined); 
        const get_available_video_data_2 = availableVideos.getAvailableVideos([createFolder.folderID, "content", fileName]);
        expect(get_available_video_data_2).toBe(undefined);   
        const get_available_video_data_3 = availableVideos.getAvailableVideos([createFolder.folderID]);
        expect(get_available_video_data_3).toMatchObject({"content": {}, "info": {"inside-folder": "folder-main", "title": "title_folder_test"}});   
        const get_video_data_2 = dataVideos.getVideoData([fileName]);
        expect(get_video_data_2).toBe(undefined); 
 
        expect(deleteData.check_if_file_exits(`./media/video/${fileName}`)).toBe(false); 
    }); 
});

describe("deleteSpecifiedVideo", () =>  {    
    it("No Input", () =>  {
        const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo();
        expect(deleteSpecifiedVideo).toBe("fileName not string");
    });        

    it("Invalid fileName", () =>  {
        const fileName = uuidv4();
        const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo(fileName);
        expect(deleteSpecifiedVideo).toBe(`folder-${fileName}-dosent-exit`);
    });     

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/";
        FileSystem.mkdirSync(`${filepath}${fileName}/`);
        FileSystem.writeFile(`${filepath}${fileName}/video.mp4`, "data", (err) => {
            if (err) throw err;  
            FileSystem.writeFile(`${filepath}${fileName}/thumbnail_1.jpg`, "data", (err) => {
                if (err) throw err;  
                FileSystem.writeFile(`${filepath}${fileName}/thumbnail_2.jpg`, "data", (err) => {
                    if (err) throw err;  
                    FileSystem.writeFile(`${filepath}${fileName}/thumbnail_3.jpg`, "data", (err) => {
                        if (err) throw err;  
                        FileSystem.writeFile(`${filepath}${fileName}/thumbnail_4.jpg`, "data", (err) => {
                            if (err) throw err;  
                            const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo(fileName);
                            expect(deleteSpecifiedVideo).toBe(`deleting-video-${fileName}-permanently`);
                        });
                    });
                });
            });
        });
    });     
});

describe("delete_video_with_provided_path", () =>  {    
    it("No Input", () =>  {
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path();
        expect(delete_video_with_provided_path).toBe("videofile no string");
    });  

    it("InValid videofile", () =>  {
        const videofile = uuidv4();
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(videofile);
        expect(delete_video_with_provided_path).toBe("fileName no string");
    });   

    it("Invalid videofile, Valid fileName", () =>  {
        const videofile = uuidv4();
        const fileName = uuidv4();
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(videofile, fileName);
        expect(delete_video_with_provided_path).toBe("invalid videofile");
    });      

    it("Valid videofile, Valid fileName", () =>  { 
        const fileName = uuidv4(); 
        const filepath = "media/video/";
        FileSystem.writeFile(`${filepath}/${fileName}.mp4`, "data", (err) => {
            if (err) throw err;  
            const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(`${filepath}/${fileName}.mp4`, fileName);
            expect(delete_video_with_provided_path).toBe("delete video");
        });
    });           
});

describe("check_if_file_exits", () =>  {    
    it("No Input", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits();
        expect(check_if_file_exits).toBe("filePath no string");
    });   

    it("Invalid filePath", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits("test");
        expect(check_if_file_exits).toBe(false);
    });   

    it("Valid filePath", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits("__tests__/backend/scripts/delete-data.test.js");
        expect(check_if_file_exits).toBe(true);
    });   
});

describe("read_dir", () =>  {    
    it("No Input", () =>  {
        const dir = deleteData.read_dir();
        expect(dir).toBe("filePath no string");
    });  

    it("Invalid filePath", () =>  {
        const dir = deleteData.read_dir("invalid_path");
        expect(dir).toBe("invalid filepath");
    });  

    it("Valid filePath", () =>  {
        const dir = deleteData.read_dir("__tests__/backend/scripts");
        expect(dir).toBe("valid filepath");
    }); 
    
    it("Valid filePath, callback", () =>  {
        let i = 0;
        expect(i).toBe(0);
        const dir = deleteData.read_dir("__tests__/backend/scripts", () => {
            i = i + 1;
            expect(i).toBe(1);
        });
        expect(dir).toBe("valid filepath");
    });   
});