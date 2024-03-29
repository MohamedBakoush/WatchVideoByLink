const ffmpegDownloadCompression = require("../../../backend/scripts/ffmpeg-download-compression");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const availableVideos = require("../../../backend/scripts/available-videos");
const availableVideos_json_path = "__tests__/data/available-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
    availableVideos.update_available_videos_path(availableVideos_json_path); 
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    dataVideos.resetVideoData();
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.resetCurrentDownloadVideos();
}); 

describe("get_download_compression_fileNameID", () =>  {    
    it("No Defined: fileNameID", () =>  {
        const getStopCompressionBool = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(getStopCompressionBool).toBe(undefined);
    });     

    it("Defined: fileNameID", () =>  {
        const fileName = uuidv4();
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID(fileName);
        expect(updateCompressionID).toBe(fileName);
        const getStopCompressionBool = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(getStopCompressionBool).toBe(fileName);
    });     
});

describe("update_download_compression_fileNameID", () =>  {    
    it("No Input", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID();
        expect(updateCompressionID).toBe("fileNameID not string");
    });     

    it("Number Input", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID(12);
        expect(updateCompressionID).toBe("fileNameID not string");
    });     

    it("Array Input", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID([]);
        expect(updateCompressionID).toBe("fileNameID not string");
    });     

    it("Object Input", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID({});
        expect(updateCompressionID).toBe("fileNameID not string");
    }); 

    it("Boolean Input", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID(true);
        expect(updateCompressionID).toBe("fileNameID not string");
    });     

    it("String Input", () =>  {
        const fileName = uuidv4();
        const updateCompressionID = ffmpegDownloadCompression.update_download_compression_fileNameID(fileName);
        expect(updateCompressionID).toBe(fileName);
    });     
});

describe("get_stop_compression_download_bool", () =>  {    
    it("No Defined: stop_stream_download_bool", () =>  {
        const getStopCompressionBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(getStopCompressionBool).toBe(undefined);
    });     

    it("Defined: stop_stream_download_bool", () =>  {
        const updateCompressionID = ffmpegDownloadCompression.update_stop_compression_download_bool(true);
        expect(updateCompressionID).toBe(true);
        const getStopCompressionBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(getStopCompressionBool).toBe(true);
    });     
});

describe("update_stop_compression_download_bool", () =>  {    
    it("No Input", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool();
        expect(updateCompressionBool).toBe("input not boolean");
    });     

    it("Number Input", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool(12);
        expect(updateCompressionBool).toBe("input not boolean");
    });     

    it("Array Input", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool([]);
        expect(updateCompressionBool).toBe("input not boolean");
    });     

    it("Object Input", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool({});
        expect(updateCompressionBool).toBe("input not boolean");
    }); 

    it("String Input", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool("test");
        expect(updateCompressionBool).toBe("input not boolean");
    });     

    it("Boolen Input - true", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool(true);
        expect(updateCompressionBool).toBe(true);
    }); 

    it("Boolen Input - false", () =>  {
        const updateCompressionBool = ffmpegDownloadCompression.update_stop_compression_download_bool(false);
        expect(updateCompressionBool).toBe(false);
    });    
});

describe("stopCommpressedVideoDownload", () =>  {   
    it("No Input", () =>  {
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload();
        expect(stopCompression).toBe(false);
    });   
    
    it("Invalid fileName", () =>  {
        const fileName = uuidv4();
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    });   
        
    it("Valid fileName: videoData empty object", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {}); 
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 
        
    it("Valid fileName: CurrentDownloadVideos empty object", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {});
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    });  

    it("Valid fileName: videoData empty object, CurrentDownloadVideos empty object", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {}); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {});
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: videoData downloading", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(true);
        const stopBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(stopBool).toBe(true);
        const stopFileName = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(stopFileName).toBe(fileName);
    });
        
    it("Valid fileName: CurrentDownloadVideos downloading", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "20.00%"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(true);
        const stopBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(stopBool).toBe(true);
        const stopFileName = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(stopFileName).toBe(fileName);
    }); 
        
    it("Valid fileName: CurrentDownloadVideos - ffmpeg and ffprobe unavailable", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffmpeg and ffprobe unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: CurrentDownloadVideos - ffmpeg unavailable", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffmpeg unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 
        
    it("Valid fileName: CurrentDownloadVideos - ffprobe unavailable", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffprobe unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 
  
    it("Valid fileName: CurrentDownloadVideos - unfinished download", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "unfinished download"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: valid videoData, CurrentDownloadVideos - ffmpeg and ffprobe unavailable", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffmpeg and ffprobe unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: valid videoData, CurrentDownloadVideos - ffmpeg unavailable", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffmpeg unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: valid videoData, CurrentDownloadVideos - ffprobe unavailable", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "ffprobe unavailable"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: valid videoData, CurrentDownloadVideos - unfinished download", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "unfinished download"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: videoData downloading, CurrentDownloadVideos empty object", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
              "download": 20.00
            }
        }); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {});
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(true);
        const stopBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(stopBool).toBe(true);
        const stopFileName = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(stopFileName).toBe(fileName);
    }); 
        
    it("Valid fileName: videoData empty object, CurrentDownloadVideos downloading", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {}); 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "20.00%"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(true);
        const stopBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(stopBool).toBe(true);
        const stopFileName = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(stopFileName).toBe(fileName);
    }); 
            
    it("Valid fileName: videoData downloading, CurrentDownloadVideos downloading", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
                "download": "20.00%"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "20.00%"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(true);
        const stopBool = ffmpegDownloadCompression.get_stop_compression_download_bool();
        expect(stopBool).toBe(true);
        const stopFileName = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(stopFileName).toBe(fileName);
    }); 

    it("Valid fileName: videoData completed", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
                "download": "completed"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: CurrentDownloadVideos completed", async () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "completed"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: videoData completed, CurrentDownloadVideos downloading", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
                "download": "completed"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "20.00%"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    });      

    it("Valid fileName: videoData downloding, CurrentDownloadVideos completed", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
                "download": "20.00%"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "completed"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 

    it("Valid fileName: videoData completed, CurrentDownloadVideos completed", async () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            "compression" : {
                "download": "completed"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            "compression" : {
                "download-status": "completed"
            }
        });
        const stopCompression = ffmpegDownloadCompression.stopCommpressedVideoDownload(fileName);
        expect(stopCompression).toBe(false);
    }); 
}); 

describe("compression_VP9", () =>  {   
    it("No Input", async () =>  {
        const compression_VP9 = await ffmpegDownloadCompression.compression_VP9();
        expect(compression_VP9).toBe("videofile not string");
    });    

    it("Valid videofile", async () =>  {
        const videofile = "./path/video.mp4";
        const compression_VP9 = await ffmpegDownloadCompression.compression_VP9(videofile);
        expect(compression_VP9).toBe("newFilePath not string");
    });  

    it("Valid newFilePath, valid newFilePath", async () =>  {
        const videofile = "./path/video.mp4";
        const newFilePath = "media/video/";
        const compression_VP9 = await ffmpegDownloadCompression.compression_VP9(videofile, newFilePath);
        expect(compression_VP9).toBe("fileName undefined");
    });    

    it("Valid newFilePath, valid newFilePath, invalid fileName", async () =>  {
        const fileName = uuidv4();
        const videofile = "./path/video.mp4";
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const compression_VP9 = await ffmpegDownloadCompression.compression_VP9(videofile, newFilePath, fileName);
        expect(compression_VP9).toBe("videoDetails dosnet exists");
    });  

    it("Valid newFilePath, valid newFilePath, Valid fileName", async () =>  {
        const fileName = uuidv4();
        const videofile = "./path/video.mp4";
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
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
        const compression_VP9 = await ffmpegDownloadCompression.compression_VP9(videofile, newFilePath, fileName);
        expect(compression_VP9).toBe("start compression");
    });  
}); 

describe("start_compression_VP9", () =>  {   
    it("return: start download", () =>  {
        const start = ffmpegDownloadCompression.start_compression_VP9();
        expect(start).toBe("start download");
    });   
}); 

describe("progress_compression_VP9", () =>  {   
    it("No Input", () =>  {
        const progress = ffmpegDownloadCompression.progress_compression_VP9();
        expect(progress).toBe("fileName undefined");
    });   

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName);
        expect(progress).toBe("invalid data");
    });   

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName, {});
        expect(progress).toBe("invalid data.percent");
    });  

    it("valid fileName, valid data - VideoData & CurrentDownloads missing", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName, {
            percent: 0
        });
        expect(progress).toBe(`${fileName} VideoData & CurrentDownloads missing`);
    }); 
    
    it("valid fileName, valid data - CurrentDownloads missing", () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
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
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName, {
            percent: 0
        });
        expect(progress).toBe(`${fileName} CurrentDownloads missing`);
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: 0
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });  
    
    it("valid fileName, valid data - VideoData missing", () =>  {
        const fileName = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
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
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName, {
            percent: 0
        });
        expect(progress).toBe(`${fileName} VideoData missing`);
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toBe(undefined);
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "0.00%"
            },
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
    });  

    it("valid fileName, valid data", () =>  {
        const fileName = uuidv4();
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
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
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
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
        const progress = ffmpegDownloadCompression.progress_compression_VP9(fileName, {
            percent: 0
        });
        expect(progress).toBe("update download progress");
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: 0
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "0.00%"
            },
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
    });  
}); 

describe("end_compression_VP9", () =>  {   
    it("No Input", () =>  {
        const end = ffmpegDownloadCompression.end_compression_VP9();
        expect(end).toBe("fileName undefined");
    });   

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName);
        expect(end).toBe("newFilePath not string");
    });   

    it("Valid fileName, valid newFilePath", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath);
        expect(end).toBe("fileType not string");
    });  

    it("Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
    });  

    it("No VideoData CurrentDownloads: Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
                title: fileName,
                videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toBe(undefined);
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });  

    it("No VideoData: Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "99.9%"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        }); 
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
                title: fileName,
                videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toBe(undefined);
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        });
    });  

    it("No CurrentDownloads: Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "starting",
                "temp-path" : []
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
                title: fileName,
                videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "completed"
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });  

    it("With CurrentDownloads VideoData: Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "starting",
                "temp-path" : []
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "99.9%"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        }); 
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
                title: fileName,
                videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "completed"
                
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        });
    });  

    it("AvaiableVideoData Inside Folder: Valid fileName, valid newFilePath, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const fileType = ".webm";
 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
         
        availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                }
            }
        });

        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder.folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder");  

        dataVideos.updateVideoData([fileName], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "starting",
                "temp-path" : [createFolder.folderID]
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });

        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "99.9%"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        }); 
        const end = ffmpegDownloadCompression.end_compression_VP9(fileName, newFilePath, fileType);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([createFolder.folderID, "content", `${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
                title: fileName,
                videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "completed"
            },
            thumbnail: {
                path: {},
                download: "20.0%"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "20.0%"
            } 
        });
    }); 
}); 