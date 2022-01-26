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

describe("deleteSpecifiedVideoData", () =>  {  
    it("No input", () =>  { 
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData();
        expect(deleteSpecifiedVideoData).toBe("undefined Unavaiable");  
    });

    it("Invalid fileName", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedVideoData = dataVideos.deleteSpecifiedVideoData(fileName);
        expect(deleteSpecifiedVideoData).toBe(`${fileName} Unavaiable`);  
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