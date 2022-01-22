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

    it("currentDownloadVideos updated", () =>  {
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
