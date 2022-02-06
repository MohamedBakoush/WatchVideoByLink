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

describe("trimVideo", () =>  {   
    it("No Input", async () =>  {
        const trimVideo = await ffmpegDownloadTrimedVideo.trimVideo();
        expect(trimVideo).toBe("videoSrc not string");
    });   

    it("valid videoSec", async ()=>  {  
        const videoSrc = "http://localhost:8080/video.mp4";
        const trimVideo = await ffmpegDownloadTrimedVideo.trimVideo(videoSrc);
        expect(trimVideo).toBe("videoType not string");
    });   

    it("valid videoSec, valid videoType", async ()=>  {  
        const videoSrc = "http://localhost:8080/video.mp4";
        const videoType = "video/mp4";
        const trimVideo = await ffmpegDownloadTrimedVideo.trimVideo(videoSrc, videoType);
        expect(trimVideo).toBe("newStartTime not number");
    });   

    it("valid videoSec, valid videoType, valid newStartTime", async ()=>  {  
        const videoSrc = "http://localhost:8080/video.mp4";
        const videoType = "video/mp4";
        const newStartTime = 20.20;
        const trimVideo = await ffmpegDownloadTrimedVideo.trimVideo(videoSrc, videoType, newStartTime);
        expect(trimVideo).toBe("newEndTime not number");
    });  
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
            compression : { 
                "download-status" : "waiting for video"
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

describe("progress_trimVideo", () =>  {   
    it("No Input", () =>  {
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo();
        expect(progress).toBe("fileName undefined");
    });    

    it("invalid fileName", () =>  {
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(undefined);
        expect(progress).toBe("fileName undefined");
    });   

    it("valid fileName, invalid data", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName);
        expect(progress).toBe("invalid data");
    });   

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {});
        expect(progress).toBe("invalid data.percent");
    });

    it("valid fileName, valid object, valid videoSrc, with start_trimVideo compressTrimedVideo false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime, false);
        expect(start).toBe("start download"); 
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting trim video download"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData1 = dataVideos.getVideoData([fileName]);
        expect(getVideoData1).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : "starting trim video download"
            }
        });
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        });
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27%"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData2 = dataVideos.getVideoData([fileName]);
        expect(getVideoData2).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : 20.27
            }
        });
    });   

    it("valid fileName, valid object, valid videoSrc, with start_trimVideo compressTrimedVideo true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const start = ffmpegDownloadTrimedVideo.start_trimVideo(fileName, videoSrc, videoType, newStartTime, newEndTime, true);
        expect(start).toBe("start download"); 
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting trim video download"
            },
            compression : { 
                "download-status" : "waiting for video"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData1 = dataVideos.getVideoData([fileName]);
        expect(getVideoData1).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : "starting trim video download"
            }
        });
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        });
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27%"
            },
            compression : { 
                "download-status" : "waiting for video"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData2 = dataVideos.getVideoData([fileName]);
        expect(getVideoData2).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : 20.27
            }
        });
    });   

    it("valid fileName, valid object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        });
        expect(progress).toBe("videoSrc not string");
    });  

    it("valid fileName, valid object, valid videoSrc", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        }, videoSrc);
        expect(progress).toBe("videoType not string");
    });  

    it("valid fileName, valid object, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        }, videoSrc, videoType);
        expect(progress).toBe("newStartTime not number");
    });   

    it("valid fileName, valid object, valid videoSrc, valid videoType, valid newStartTime", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        }, videoSrc, videoType, newStartTime);
        expect(progress).toBe("newEndTime not number");
    });    

    it("valid fileName, valid object, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressTrimedVideo false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        }, videoSrc, videoType, newStartTime, newEndTime);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27%"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData2 = dataVideos.getVideoData([fileName]);
        expect(getVideoData2).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : 20.27
            }
        });
    });    

    it("valid fileName, valid object, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressTrimedVideo true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const progress = ffmpegDownloadTrimedVideo.progress_trimVideo(fileName, {
            percent: 20.27
        }, videoSrc, videoType, newStartTime, newEndTime, true);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27%"
            },
            compression : { 
                "download-status" : "waiting for video"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData2 = dataVideos.getVideoData([fileName]);
        expect(getVideoData2).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                download : 20.27
            }
        });
    });    
}); 

describe("end_trimVideo", () =>  {   
    it("No Input", () =>  {
        const end = ffmpegDownloadTrimedVideo.end_trimVideo();
        expect(end).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(undefined);
        expect(end).toBe("fileName undefined");
    });  
    
    it("valid fileName", () =>  {
        const fileName = uuidv4();
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName);
        expect(end).toBe("newFilePath not string");
    });  

    it("valid fileName, valid newFilePath", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath);
        expect(end).toBe("fileType not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType);
        expect(end).toBe("videoSrc not string");
    });

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const videoSrc = "videoSrc";
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType, videoSrc);
        expect(end).toBe("videoType not string");
    });

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType, videoSrc, videoType);
        expect(end).toBe("newStartTime not number");
    });

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, valid newStartTime", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType, videoSrc, videoType, newStartTime);
        expect(end).toBe("newEndTime not number");
    });

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressVideo false", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType, videoSrc, videoType, newStartTime, newEndTime);
        expect(end).toBe("end download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video: {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
    });

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, valid newStartTime, valid newEndTime, compressVideo true", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".mp4";
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const newStartTime = 20.20;
        const newEndTime = 100.20;
        const end = ffmpegDownloadTrimedVideo.end_trimVideo(fileName, newFilePath, fileType, videoSrc, videoType, newStartTime, newEndTime, true);
        expect(end).toBe("end download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "starting video compression"
            },
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video: {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                newVideoStartTime: newStartTime,
                newVideoEndTime: newEndTime,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "starting"
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
    });
}); 