const ffmpegDownloadVideo = require("../../../backend/scripts/ffmpeg-download-video");
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

describe("start_downloadVideo", () =>  {   
    it("No Input", () =>  {
        const start = ffmpegDownloadVideo.start_downloadVideo();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const start = ffmpegDownloadVideo.start_downloadVideo(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName, invalid videoSrc, invalid videoType", () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName);
        expect(start).toBe("videoSrc videoType not string");
    });  

    it("valid fileName, valid videoSrc, invalid videoType", () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, "videoSrc");
        expect(start).toBe("videoType not string");
    });  

    it("valid fileName, invalid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, undefined, "videoType");
        expect(start).toBe("videoSrc not string");
    });  

    it("valid fileName, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, videoSrc, videoType);
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

    it("valid fileName, valid videoSrc, valid videoType, compressVideo false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, videoSrc, videoType, false);
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

    it("valid fileName, valid videoSrc, valid videoType, compressVideo true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, videoSrc, videoType, true);
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

describe("progress_downloadVideo", () =>  {   
    it("No Input", () =>  {
        const progress = ffmpegDownloadVideo.progress_downloadVideo();
        expect(progress).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const progress = ffmpegDownloadVideo.progress_downloadVideo(undefined);
        expect(progress).toBe("fileName undefined");
    });  

    it("valid fileName, invalid data", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName);
        expect(progress).toBe("invalid data");
    });  

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {});
        expect(progress).toBe("invalid data.percent");
    });  

    it("valid fileName, valid data with start_downloadVideo", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadVideo.start_downloadVideo(fileName, videoSrc, videoType, false);
        expect(start).toBe("start download");
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting full video download"
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
                download : "starting full video download"
            }
        });
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            frames: 1,
            currentFps: 0,
            currentKbps: NaN,
            targetSize: 0,
            timemark: "00:00:00.00",
            percent: 0
          });
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "0.00%"
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
                download : 0
            }
        });
    });  

    it("valid fileName, valid data without start_downloadVideo", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            frames: 1,
            currentFps: 0,
            currentKbps: NaN,
            targetSize: 0,
            timemark: "00:00:00.00",
            percent: 0
          });
        expect(progress).toBe("videoSrc videoType not string");
    });  

    it("valid fileName, valid data without start_downloadVideo, valid videoSrc, invalid videoType, compressVideo undefined", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = undefined;
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            frames: 1,
            currentFps: 0,
            currentKbps: NaN,
            targetSize: 0,
            timemark: "00:00:00.00",
            percent: 0
          }, videoSrc, videoType);
        expect(progress).toBe("videoType not string");
    });  

    it("valid fileName, valid data without start_downloadVideo, invalid videoSrc, valid videoType, compressVideo undefined", () =>  {
        const fileName = uuidv4();
        const videoSrc = undefined;
        const videoType = "videoType";
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            frames: 1,
            currentFps: 0,
            currentKbps: NaN,
            targetSize: 0,
            timemark: "00:00:00.00",
            percent: 0
          }, videoSrc, videoType);
        expect(progress).toBe("videoSrc not string");
    });  

    it("valid fileName, valid data without start_downloadVideo, valid videoSrc, valid videoType, compressVideo undefined", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            percent: 20.27
          }, videoSrc, videoType);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "20.27%"
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
                download : 20.27
            }
        });
    });  

    it("valid fileName, valid data without start_downloadVideo, valid videoSrc, valid videoType, compressVideo false", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            percent: 20.27
          }, videoSrc, videoType, false);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "20.27%"
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
                download : 20.27
            }
        });
    });  

    it("valid fileName, valid data without start_downloadVideo, valid videoSrc, valid videoType, compressVideo true", () =>  {
        const fileName = uuidv4();
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadVideo.progress_downloadVideo(fileName, {
            percent: 20.27
          }, videoSrc, videoType, true);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
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
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : 20.27
            }
        });
    });  
}); 

describe("end_downloadVideo", () =>  {   
    it("No Input", () =>  {
        const end = ffmpegDownloadVideo.end_downloadVideo();
        expect(end).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const end = ffmpegDownloadVideo.end_downloadVideo(undefined);
        expect(end).toBe("fileName undefined");
    });  

    it("valid fileName", () =>  {
        const fileName = uuidv4();
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName);
        expect(end).toBe("newFilePath not string");
    });  

    it("valid fileName, valid newFilePath", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath);
        expect(end).toBe("fileType not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType);
        expect(end).toBe("videoSrc not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType, videoSrc);
        expect(end).toBe("videoType not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, compressVideo false", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType);
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

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, compressVideo true", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadVideo.end_downloadVideo(fileName, newFilePath, fileType, videoSrc, videoType, true);
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