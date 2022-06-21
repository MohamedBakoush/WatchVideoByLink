const ffmpegDownloadVideo = require("../../../backend/scripts/ffmpeg-download-video");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const { v4: uuidv4 } = require("uuid");

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

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
});

afterEach(() => {    
    dataVideos.resetVideoData();
}); 

describe("update_data_videos_path", () =>  {  
    afterAll(() => { 
        dataVideos.update_data_videos_path(dataVideos_json_path);
    });

    it("invalid path", () =>  {
        const updated = dataVideos.update_data_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = dataVideos.update_data_videos_path("__tests__/backend/scripts/data-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("videoData updated", () =>  {
        const updated = dataVideos.update_data_videos_path(dataVideos_json_path);
        expect(updated).toBe("videoData updated");  
    }); 
}); 

describe("getVideoData", () =>  {   
    it("No input - path array", () =>  {
        const getVideoData = dataVideos.getVideoData();
        expect(getVideoData).toMatchObject({}); 
    }); 

    it("Empty path array", () =>  {
        const getVideoData = dataVideos.getVideoData([]);
        expect(getVideoData).toBe(undefined); 
    }); 

    it("Invalid path array", () =>  {
        const getVideoData = dataVideos.getVideoData([undefined]);
        expect(getVideoData).toBe(undefined); 
    }); 

    it("Get Specified Video Data", () =>  { 
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_data = dataVideos.getVideoData([fileName]);
        expect(get_data).toMatchObject(dataVideos_data);   
    });
}); 

describe("resetVideoData", () =>  {  
    it("resetVideoData", () =>  {
        const reset = dataVideos.resetVideoData();
        expect(reset).toBe("resetVideoData");  
        const data = dataVideos.getVideoData();
        expect(data).toMatchObject({}); 
    });
}); 

describe("findVideosByID", () =>  {  
    it("No input", () =>  {
        const findVideosByID = dataVideos.findVideosByID();
        expect(findVideosByID).toBe(undefined);  
    });

    it("invalid id", () =>  {
        const fileName = uuidv4();
        const findVideosByID = dataVideos.findVideosByID(fileName);
        expect(findVideosByID).toBe(undefined);  
    });

    it("input empty array", () =>  {
        const findVideosByID = dataVideos.findVideosByID([]);
        expect(findVideosByID).toBe(undefined);  
    });

    it("input array", () =>  {
        const fileName = uuidv4();
        const findVideosByID = dataVideos.findVideosByID([fileName]);
        expect(findVideosByID).toBe(undefined);  
    });

    it("Valid id", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  

        const findVideosByID = dataVideos.findVideosByID(fileName);
        expect(findVideosByID).toMatchObject(dataVideos_data); 
    });
}); 

describe("updateVideoData", () =>  {  
    it("No Input", () =>  { 
        const updateVideoData = dataVideos.updateVideoData();
        expect(updateVideoData).toBe("invalid path_array");  
    }); 

    it("undefined path_array", () =>  {
        const updateVideoData = dataVideos.updateVideoData(undefined);
        expect(updateVideoData).toBe("invalid path_array");  
    }); 

    it("undefined path_array undefined data", () =>  {
        const updateVideoData = dataVideos.updateVideoData(undefined, undefined);
        expect(updateVideoData).toBe("invalid path_array");  
    }); 

    it("invalid path_array undefined data", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData(fileName, undefined);
        expect(updateVideoData).toBe("invalid path_array");  
    }); 

    it("invalid path_array valid data", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData(fileName, {});
        expect(updateVideoData).toBe("invalid path_array");  
    }); 

    it("empty path_array invalid data", () =>  {
        const updateVideoData = dataVideos.updateVideoData([], undefined);
        expect(updateVideoData).toBe("invalid path_array");  
    });

    it("valid path_array invalid data", () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], undefined);
        expect(updateVideoData).toBe("invalid data");  
    });

    it("Valid", () =>  { 
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_data = dataVideos.getVideoData([fileName]);
        expect(get_data).toMatchObject(dataVideos_data);   
    });
}); 

describe("inputSelectedIDIntoFolderID_tempPath", () =>  {  
    it("No Input", () =>  { 
        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDIntoFolderID_tempPath();
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("invalid selectedID & folderID");  
    }); 

    it("Valid selectedID, Invaldi folderID", () =>  { 
        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDIntoFolderID_tempPath("id", undefined);
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("invalid folderID");  
    }); 

    it("Invalid selectedID, Valid folderID", () =>  { 
        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDIntoFolderID_tempPath(undefined, "id");
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("invalid selectedID");  
    }); 

    it("failed-updated-temp-path", () =>  { 
        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDIntoFolderID_tempPath("id", "id");
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("failed-updated-temp-path");  
    }); 

    it("updated-temp-path", () =>  {  
        const folder_id = uuidv4();

        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType, true);
        expect(end).toBe("end download");

        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDIntoFolderID_tempPath(fileName, folder_id);
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("updated-temp-path");  

        const getVideoData = dataVideos.getVideoData([fileName, "compression", "temp-path"]);
        expect(getVideoData).toEqual([folder_id]);
    }); 
});

describe("inputSelectedIDOutOfFolderID_tempPath", () =>  {  
    it("No Input", () =>  { 
        const inputSelectedIDOutOfFolderID_tempPath = dataVideos.inputSelectedIDOutOfFolderID_tempPath();
        expect(inputSelectedIDOutOfFolderID_tempPath).toBe("invalid selectedID & folderIDPath");  
    }); 

    it("Valid selectedID, Invaldid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID_tempPath = dataVideos.inputSelectedIDOutOfFolderID_tempPath("id", undefined);
        expect(inputSelectedIDOutOfFolderID_tempPath).toBe("invalid folderIDPath");  
    }); 

    it("Invalid selectedID, Valid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID_tempPath = dataVideos.inputSelectedIDOutOfFolderID_tempPath(undefined, ["id"]);
        expect(inputSelectedIDOutOfFolderID_tempPath).toBe("invalid selectedID");  
    }); 

    it("failed-updated-temp-path", () =>  { 
        const inputSelectedIDOutOfFolderID_tempPath = dataVideos.inputSelectedIDOutOfFolderID_tempPath("id", ["id"]);
        expect(inputSelectedIDOutOfFolderID_tempPath).toBe("failed-updated-temp-path");  
    }); 

    it("updated-temp-path", () =>  { 
        const folder_id1 = uuidv4();
        const folder_id2 = uuidv4();
 
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType, true);
        expect(end).toBe("end download");

        const inputSelectedIDIntoFolderID_tempPath = dataVideos.inputSelectedIDOutOfFolderID_tempPath(fileName, [folder_id1, folder_id2]);
        expect(inputSelectedIDIntoFolderID_tempPath).toBe("updated-temp-path");  

        const getVideoData = dataVideos.getVideoData([fileName, "compression", "temp-path"]);
        expect(getVideoData).toEqual([folder_id1, folder_id2]);
    }); 
});

describe("deleteSpecifiedVideoData", () =>  {  
    it("No input", () =>  { 
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData();
        expect(deleteSpecifiedVideoData).toBe("undefined unavaiable");  
    });

    it("Invalid fileName", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData(fileName);
        expect(deleteSpecifiedVideoData).toBe(`${fileName} unavaiable`);  
    });

    it("empty array", () =>  {  
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData([]);
        expect(deleteSpecifiedVideoData).toBe(" unavaiable");  
    });

    it("Invalid array", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData([fileName]);
        expect(deleteSpecifiedVideoData).toBe(`${fileName} unavaiable`);  
    });

    it("Delete fileName", () =>  { 
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data); 
        expect(updateVideoData).toBe("updateVideoData");  

        const getVideoData_1 = dataVideos.getVideoData();
        expect(getVideoData_1[fileName]).toMatchObject(dataVideos_data);    

        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData(fileName);
        expect(deleteSpecifiedVideoData).toBe(`${fileName} deleted`); 

        const getVideoData_2 = dataVideos.getVideoData();
        expect(getVideoData_2).toMatchObject({}); 
    }); 

    it("Delete path_array", () =>  { 
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data); 
        expect(updateVideoData).toBe("updateVideoData");  

        const getVideoData_1 = dataVideos.getVideoData();
        expect(getVideoData_1[fileName]).toMatchObject(dataVideos_data);    

        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData([fileName, "video", "download"]);
        expect(deleteSpecifiedVideoData).toBe(`${fileName},video,download deleted`); 

        const getVideoData_2 = dataVideos.getVideoData([fileName]);
        expect(getVideoData_2).toMatchObject({
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4"
            },
            "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download" : "completed",
            },
            "thumbnail": {
                "path": {},
                "download": "completed"
            }
        }); 
    }); 
}); 

describe("checkIfVideoSrcOriginalPathExits", () =>  {   
    it("No Input", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits();
        expect(checkIfVideoSrcOriginalPathExits).toBe(undefined);
    });  
        
    it("Input String", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits("test");
        expect(checkIfVideoSrcOriginalPathExits).toBe("test");
    });  

    it("Input URL", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits("http://localhost:8080/test.mp4");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/test.mp4");
    });  

    it("/video/: Invalid fileName", async () =>  { 
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits("http://localhost:8080/video/invalid");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/video/invalid");
    }); 

    it("/compressed/: Invalid fileName", async () =>  { 
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits("http://localhost:8080/compressed/invalid");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/compressed/invalid");
    }); 

    it("/video/: Valid fileName, Invalid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], undefined);
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe(`http://localhost:8080/video/${fileName}`);
    }); 

    it("/compressed/: Valid fileName, Invalid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], undefined);
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe(`http://localhost:8080/compressed/${fileName}`);
    }); 

    it("/video/: Valid fileName, Valid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], dataVideos_data);
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe("videoFilePath");
    }); 

    it("/compressed/: Valid fileName, Valid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], dataVideos_data);
        const checkIfVideoSrcOriginalPathExits = await dataVideos.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe("videoFilePath");
    }); 
}); 