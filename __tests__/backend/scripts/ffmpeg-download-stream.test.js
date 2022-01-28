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

describe("get_download_stream_fileNameID", () =>  {    
    it("No Defined: fileNameID", () =>  {
        const getStreamID = ffmpegDownloadStream.get_download_stream_fileNameID();
        expect(getStreamID).toBe(undefined);
    });     

    it("Defined: fileNameID", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID("test_id");
        expect(updateStreamID).toBe("test_id");
        const getStreamID = ffmpegDownloadStream.get_download_stream_fileNameID();
        expect(getStreamID).toBe("test_id");
    });     
});

describe("update_download_stream_fileNameID", () =>  {    
    it("No Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID();
        expect(updateStreamID).toBe("fileNameID not string");
    });     

    it("Number Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID(12);
        expect(updateStreamID).toBe("fileNameID not string");
    });     

    it("Array Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID([]);
        expect(updateStreamID).toBe("fileNameID not string");
    });     

    it("Object Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID({});
        expect(updateStreamID).toBe("fileNameID not string");
    }); 

    it("Boolean Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID(true);
        expect(updateStreamID).toBe("fileNameID not string");
    });     

    it("String Input", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_download_stream_fileNameID("test_id");
        expect(updateStreamID).toBe("test_id");
    });     
});

describe("get_stop_stream_download_bool", () =>  {    
    it("No Defined: stop_stream_download_bool", () =>  {
        const getStopDownloadBoll = ffmpegDownloadStream.get_stop_stream_download_bool();
        expect(getStopDownloadBoll).toBe(undefined);
    });     

    it("Defined: stop_stream_download_bool", () =>  {
        const updateStreamID = ffmpegDownloadStream.update_stop_stream_download_bool(true);
        expect(updateStreamID).toBe(true);
        const getStopDownloadBoll = ffmpegDownloadStream.get_stop_stream_download_bool();
        expect(getStopDownloadBoll).toBe(true);
    });     
});

describe("update_stop_stream_download_bool", () =>  {    
    it("No Input", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool();
        expect(updateStreamDownloadBool).toBe("input not boolean");
    });     

    it("Number Input", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool(12);
        expect(updateStreamDownloadBool).toBe("input not boolean");
    });     

    it("Array Input", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool([]);
        expect(updateStreamDownloadBool).toBe("input not boolean");
    });     

    it("Object Input", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool({});
        expect(updateStreamDownloadBool).toBe("input not boolean");
    }); 

    it("String Input", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool("test");
        expect(updateStreamDownloadBool).toBe("input not boolean");
    });     

    it("Boolen Input - true", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool(true);
        expect(updateStreamDownloadBool).toBe(true);
    }); 

    it("Boolen Input - false", () =>  {
        const updateStreamDownloadBool = ffmpegDownloadStream.update_stop_stream_download_bool(false);
        expect(updateStreamDownloadBool).toBe(false);
    });    
});

describe("downloadVideoStream", () =>  {    
    it("No Input", async () =>  {
        const downloadVideo = await ffmpegDownloadStream.downloadVideoStream();
        expect(downloadVideo).toBe("videoSrc not string");
    });    

    it("Invalid videoSec, Invalid videoType", async ()=>  {  
        const videoSrc = "undefined";
        const videoType = undefined;
        const downloadVideoStream = await ffmpegDownloadStream.downloadVideoStream(videoSrc, videoType);
        expect(downloadVideoStream).toBe("videoType not string");
    });   

    it("Valid videoSec, Invalid videoType", async ()=>  {  
        const videoSrc = "http://localhost:8080/video.mp4";
        const videoType = undefined;
        const downloadVideoStream = await ffmpegDownloadStream.downloadVideoStream(videoSrc, videoType);
        expect(downloadVideoStream).toBe("videoType not string");
    });   

    it("Invalid videoSec, Valid videoType", async ()=>  {  
        const videoSrc = undefined;
        const videoType = "video/mp4";
        const downloadVideoStream = await ffmpegDownloadStream.downloadVideoStream(videoSrc, videoType);
        expect(downloadVideoStream).toBe("videoSrc not string");
    });   
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

describe("progress_trimVideo", () =>  {   
    it("No Input", () =>  {
        const progress = ffmpegDownloadStream.progress_downloadVideoStream();
        expect(progress).toBe("fileName undefined");
    });    

    it("invalid fileName", () =>  {
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(undefined);
        expect(progress).toBe("fileName undefined");
    });   

    it("valid fileName, invalid data", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName);
        expect(progress).toBe("invalid data");
    });   

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {});
        expect(progress).toBe("invalid data.timemark");
    });

    it("valid fileName, valid object", () =>  {
        const fileName = uuidv4(); 
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        });
        expect(progress).toBe("videoSrc not string"); 
    });   
 
    it("valid fileName, valid object with start_downloadVideoStream - compressVideoStream false", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType, false);
        expect(start).toBe("start download"); 
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting stream download"
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
                download : "starting stream download"
            }
        });
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        });
        expect(progress).toBe("update download progress"); 
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27"
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
                download : "downloading",
                timemark: "20.27"
            }
        });
    });   
 
    it("valid fileName, valid object with start_downloadVideoStream - compressVideoStream true", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const start = ffmpegDownloadStream.start_downloadVideoStream(fileName, videoSrc, videoType, true);
        expect(start).toBe("start download"); 
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
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
        const getVideoData1 = dataVideos.getVideoData([fileName]);
        expect(getVideoData1).toMatchObject({
            video : {
                originalVideoSrc : videoSrc,
                originalVideoType : videoType,
                download : "starting stream download"
            }
        });
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        });
        expect(progress).toBe("update download progress"); 
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "20.27"
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
                download : "downloading",
                timemark: "20.27"
            }
        });
    }); 

    it("valid fileName, valid object, valid videoSrc", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        }, videoSrc);
        expect(progress).toBe("videoType not string"); 
    });   

    it("valid fileName, valid object, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        }, videoSrc, videoType);
        expect(progress).toBe("update download progress"); 
    });   

    it("valid fileName, valid object, valid videoSrc, valid videoType, compressVideoStream false", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        }, videoSrc, videoType, false);
        expect(progress).toBe("update download progress"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "20.27"
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
                download : "downloading",
                timemark: "20.27"
            }
        });
    });  

    it("valid fileName, valid object, valid videoSrc, valid videoType, compressVideoStream true", () =>  {
        const fileName = uuidv4(); 
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const progress = ffmpegDownloadStream.progress_downloadVideoStream(fileName, {
            timemark: "20.27"
        }, videoSrc, videoType, true);
        expect(progress).toBe("update download progress"); 
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "20.27"
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
                download : "downloading",
                timemark: "20.27"
            }
        });
    });  
}); 

describe("end_downloadVideo", () =>  {   
    it("No Input", () =>  {
        const end = ffmpegDownloadStream.end_downloadVideoStream();
        expect(end).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const end = ffmpegDownloadStream.end_downloadVideoStream(undefined);
        expect(end).toBe("fileName undefined");
    });  

    it("valid fileName", () =>  {
        const fileName = uuidv4();
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName);
        expect(end).toBe("newFilePath not string");
    });  

    it("valid fileName, valid newFilePath", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath);
        expect(end).toBe("fileType not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath, fileType);
        expect(end).toBe("videoSrc not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc);
        expect(end).toBe("videoType not string");
    });  

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc, videoType);
        expect(end).toBe("end download");
    });  

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, compressVideoStream false", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc, videoType, false);
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

    it("valid fileName, valid newFilePath, valid fileType, valid videoSrc, valid videoType, compressVideoStream true", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const fileType = ".mp4";
        const newFilePath = `${filepath}${fileName}/`;
        const videoSrc = "videoSrc";
        const videoType = "videoType";
        const end = ffmpegDownloadStream.end_downloadVideoStream(fileName, newFilePath, fileType, videoSrc, videoType, true);
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