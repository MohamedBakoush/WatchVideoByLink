const ffmpegDownloadStream = require("../../../backend/scripts/ffmpeg-download-stream");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");

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

describe("start_downloadVideoStream", () =>  {   
    it("No Input", () =>  {
        const start = ffmpegDownloadStream.start_downloadVideoStream();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const start = ffmpegDownloadStream.start_downloadVideoStream(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName", () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName);
        expect(start).toBe("videoSrc not string");
    });  

    it("valid fileName, valid videoSrc", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = undefined;
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType);
        expect(start).toBe("videoType not string");
    });  

    it("valid fileName, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType);
        expect(start).toBe("start download"); 
    }); 

    it("valid fileName, valid videoSrc, valid videoType, compressVideoStream false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType, false);
        expect(start).toBe("start download"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting stream download"
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
                download : "starting stream download"
            }
        });
    });  

    it("valid fileName, valid videoSrc, valid videoType, compressVideoStream true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType, true);
        expect(start).toBe("start download"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting stream download"
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
                download : "starting stream download"
            }
        });
    });  
}); 