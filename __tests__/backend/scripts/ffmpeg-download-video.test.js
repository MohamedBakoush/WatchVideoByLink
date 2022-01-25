const ffmpegDownloadVideo = require("../../../backend/scripts/ffmpeg-download-video");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
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
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    dataVideos.resetVideoData();
    currentDownloadVideos.resetCurrentDownloadVideos();
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

describe("start_downloadVideo", () =>  {   
    it("No Input", async () =>  {
        const start = ffmpegDownloadVideo.start_downloadVideo();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", async () =>  {
        const start = ffmpegDownloadVideo.start_downloadVideo(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName, invalid videoSrc, invalid videoType", async () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName);
        expect(start).toBe("videoSrc videoType not string");
    });  

    it("valid fileName, valid videoSrc, invalid videoType", async () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, "videoSrc");
        expect(start).toBe("videoType not string");
    });  

    it("valid fileName, invalid videoSrc, valid videoType", async () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, undefined, "videoType");
        expect(start).toBe("videoSrc not string");
    });  

    it("valid fileName, valid videoSrc, valid videoType", async () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, "videoSrc", "videoType");
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting full video download"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        // check curret download 
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : "starting full video download"
            }
        });
    });  

    it("valid fileName, valid videoSrc, valid videoType, compressVideo false", async () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, "videoSrc", "videoType", false);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting full video download"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : "starting full video download"
            }
        });
    });  

    it("valid fileName, valid videoSrc, valid videoType, compressVideo true", async () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, "videoSrc", "videoType", true);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting full video download"
            },
            compression : { 
                "download-status" : "waiting for video"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : "starting full video download"
            }
        });
    });  
}); 
