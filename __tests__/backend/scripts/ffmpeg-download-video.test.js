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

describe("checkIfVideoSrcOriginalPathExits", () =>  {   
    it("No Input", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits();
        expect(checkIfVideoSrcOriginalPathExits).toBe(undefined);
    });  
        
    it("Input String", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits("test");
        expect(checkIfVideoSrcOriginalPathExits).toBe("test");
    });  

    it("Input URL", async () =>  {
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits("http://localhost:8080/test.mp4");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/test.mp4");
    });  

    it("/video/: Invalid fileName", async () =>  { 
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits("http://localhost:8080/video/invalid");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/video/invalid");
    }); 

    it("/compressed/: Invalid fileName", async () =>  { 
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits("http://localhost:8080/compressed/invalid");
        expect(checkIfVideoSrcOriginalPathExits).toBe("http://localhost:8080/compressed/invalid");
    }); 

    it("/video/: Valid fileName, Invalid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], undefined);
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe(`http://localhost:8080/video/${fileName}`);
    }); 

    it("/compressed/: Valid fileName, Invalid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], undefined);
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe(`http://localhost:8080/compressed/${fileName}`);
    }); 

    it("/video/: Valid fileName, Valid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], dataVideos_data);
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe("videoFilePath");
    }); 

    it("/compressed/: Valid fileName, Valid Data", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([fileName], dataVideos_data);
        const checkIfVideoSrcOriginalPathExits = await ffmpegDownloadVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${fileName}`);
        expect(checkIfVideoSrcOriginalPathExits).toBe("videoFilePath");
    }); 
}); 
