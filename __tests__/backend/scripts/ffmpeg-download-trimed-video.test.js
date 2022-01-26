const ffmpegDownloadTrimedVideo = require("../../../backend/scripts/ffmpeg-download-trimed-video");
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

describe("start_trimVideo", () =>  {   
    it("No Input", () =>  {
        const start = ffmpegDownloadTrimedVideo.start_trimVideo();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName, invalid videoSrc", () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName);
        expect(start).toBe("videoSrc not string");
    });  

    it("valid fileName, valid videoSrc, invalid videoType", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = undefined;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType);
        expect(start).toBe("videoType not string");
    });  
 
    it("valid fileName, valid videoSrc, valid videoType, invalid newStartTime", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = undefined;
        const newEndTime = undefined;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime);
        expect(start).toBe("newStartTime not number"); 
    });   

    it("valid fileName, valid videoSrc, valid videoType, valid newStartTime, invalid newEndTime", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 0;
        const newEndTime = undefined;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime);
        expect(start).toBe("newEndTime not number"); 
    });   

    it("valid fileName, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressTrimedVideo false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 0;
        const newEndTime = 20;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime);
        expect(start).toBe("start download"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting trim video download"
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
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : "starting trim video download"
            }
        });
    });   
    
    it("valid fileName, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressTrimedVideo true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 0;
        const newEndTime = 20;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime, true);
        expect(start).toBe("start download"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting trim video download"
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
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : "starting trim video download"
            }
        });
    });   
}); 
