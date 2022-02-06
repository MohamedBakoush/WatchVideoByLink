const ffmpegUploadVideo = require("../../../backend/scripts/ffmpeg-upload-video");
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

describe("downloadUploadedVideo", () =>  {   
    it("No Input", async () =>  {
        const downloadUploadedVideo = await ffmpegUploadVideo.downloadUploadedVideo();
        expect(downloadUploadedVideo).toBe("videofile not string");
    });   

    it("valid videofile", async ()=>  {  
        const uploadedFilename = `uploaded-${uuidv4()}`;
        const videofile = `./media/video/${uploadedFilename}.mp4`;
        const downloadUploadedVideo = await ffmpegUploadVideo.downloadUploadedVideo(videofile);
        expect(downloadUploadedVideo).toBe("fileMimeType not string");
    });   

    it("valid videofile, valid fileMimeType", async ()=>  {  
        const uploadedFilename = `uploaded-${uuidv4()}`;
        const videofile = `./media/video/${uploadedFilename}.mp4`;
        const fileMimeType = "video/mp4";
        const downloadUploadedVideo = await ffmpegUploadVideo.downloadUploadedVideo(videofile, fileMimeType);
        expect(downloadUploadedVideo).toBe("uploadedFilename not string");
    });    
});

describe("start_downloadUploadedVideo", () =>  {   
    it("No Input", () =>  {
        const start = ffmpegUploadVideo.start_downloadUploadedVideo();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName", () =>  {
        const fileName = uuidv4();
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName);
        expect(start).toBe("fileMimeType not string");
    });  

    it("valid fileName, valid fileMimeType", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
        });
        // check curret download 
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
    });   

    it("valid fileName, valid fileMimeType, compressUploadedVideo undefined", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType, undefined);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
    });  

    it("valid fileName, valid fileMimeType, compressUploadedVideo false", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType, false);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
        });
        const getVideoData = dataVideos.getVideoData([fileName]);
        expect(getVideoData).toMatchObject({
            video : {
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
    });  

    it("valid fileName, valid fileMimeTypem, compressUploadedVideo true", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType, true);
        expect(start).toBe("start download");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
    });  
}); 

describe("progress_downloadUploadedVideo", () =>  {   
    it("No Input", () =>  {
        const start = ffmpegUploadVideo.progress_downloadUploadedVideo();
        expect(start).toBe("fileName undefined");
    });   

    it("fileName undefined", () =>  {
        const start = ffmpegUploadVideo.progress_downloadUploadedVideo(undefined);
        expect(start).toBe("fileName undefined");
    });  

    it("valid fileName, invalid data", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName);
        expect(progress).toBe("invalid data");
    });  

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {});
        expect(progress).toBe("invalid data.percent");
    }); 

    it("valid fileName, valid data with start_trimVideo compressTrimedVideo false", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType);
        expect(start).toBe("start download");
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
            },
            thumbnail : { 
                "download-status" : "waiting for video"
            } 
        });
        const getVideoData1 = dataVideos.getVideoData([fileName]);
        expect(getVideoData1).toMatchObject({
            video:{
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : 0
            }
        });
    });   

    it("valid fileName, valid data with start_trimVideo compressTrimedVideo true", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const start = ffmpegUploadVideo.start_downloadUploadedVideo(fileName, fileMimeType, true);
        expect(start).toBe("start download");
        const getCurrentDownloads1 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads1).toMatchObject({
            video : { 
                "download-status" : "starting uploaded video download"
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
            video:{
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : "starting uploaded video download"
            }
        });
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
            percent: 0
          });
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "0.00%"
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : 0
            }
        });
    });   

    it("valid fileName, valid data", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
            percent: 0
        });
        expect(progress).toBe("fileMimeType not string"); 
    });  

    it("valid fileName, valid data, valid fileMimeType", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
            percent: 0
        }, fileMimeType);
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : 0
            }
        });
    }); 
    
    it("valid fileName, valid data, valid fileMimeType, compressUploadedVideo false", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
            percent: 0
        }, fileMimeType, false);
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : 0
            }
        });
    }); 

    it("valid fileName, valid data, valid fileMimeType, compressUploadedVideo true", () =>  {
        const fileName = uuidv4();
        const fileMimeType = "video/mp4";
        const progress = ffmpegUploadVideo.progress_downloadUploadedVideo(fileName, {
            percent: 0
        }, fileMimeType, true);
        expect(progress).toBe("update download progress");
        const getCurrentDownloads2 = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(getCurrentDownloads2).toMatchObject({
            video : { 
                "download-status" : "0.00%"
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
                originalVideoSrc : "unknown",
                originalVideoType : fileMimeType,
                download : 0
            }
        });
    });  
});
