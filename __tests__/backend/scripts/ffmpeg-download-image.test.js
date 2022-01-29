const ffmpegDownloadImage = require("../../../backend/scripts/ffmpeg-download-image");
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

describe("createThumbnail", () =>  {   
    it("No Input", async() =>  {
        const createThumbnail = await ffmpegDownloadImage.createThumbnail();
        expect(createThumbnail).toBe("videofile not string");
    });   

    it("Valid videofile", async () =>  {
        const videofile = "./path/video.mp4";
        const createThumbnail = await ffmpegDownloadImage.createThumbnail(videofile);
        expect(createThumbnail).toBe("newFilePath not string");
    });  

    it("Valid newFilePath, valid newFilePath", async () =>  {
        const videofile = "./path/video.mp4";
        const newFilePath = "media/video/";
        const createThumbnail = await ffmpegDownloadImage.createThumbnail(videofile, newFilePath);
        expect(createThumbnail).toBe("fileName undefined");
    });    

    it("Valid newFilePath, valid newFilePath, invalid fileName", async () =>  {
        const fileName = uuidv4();
        const videofile = "./path/video.mp4";
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const createThumbnail = await ffmpegDownloadImage.createThumbnail(videofile, newFilePath, fileName);
        expect(createThumbnail).toBe("videoDetails dosnet exists");
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
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const createThumbnail = await ffmpegDownloadImage.createThumbnail(videofile, newFilePath, fileName);
        expect(createThumbnail).toBe("start create thumbnail");
    });  
}); 

describe("start_createThumbnail", () =>  {   
    it("return: start download", () =>  {
        const start = ffmpegDownloadImage.start_createThumbnail();
        expect(start).toBe("start download");
    });   
}); 

describe("progress_createThumbnail", () =>  {   
    it("No Input", () =>  {
        const progress = ffmpegDownloadImage.progress_createThumbnail();
        expect(progress).toBe("fileName undefined");
    });   

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName);
        expect(progress).toBe("invalid data");
    });   

    it("valid fileName, empty object", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {});
        expect(progress).toBe("invalid data.percent");
    });  

    it("valid fileName, valid data - VideoData & CurrentDownloads missing", () =>  {
        const fileName = uuidv4();
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
            thumbnail: {
                path: {},
                download: 0
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });   

    it("compression true: valid fileName, valid data - CurrentDownloads missing", () =>  {
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
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
                download: "starting"
            },
            thumbnail: {
                path: {},
                download: 0
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
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
            thumbnail : { 
                "download-status" : "0.00%"
            } 
        });
    });  

    it("compression true: valid fileName, valid data - VideoData missing", () =>  {
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
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
                "download-status" : "starting video compression"
            },
            thumbnail : { 
                "download-status" : "0.00%"
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
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "starting thumbnail download"
            } 
        });
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
            thumbnail: {
                path: {},
                download: 0
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "0.00%"
            } 
        });
    });  

    it("compression true: alid fileName, valid data", () =>  {
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
        const progress = ffmpegDownloadImage.progress_createThumbnail(fileName, {
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
                download: "starting"
            },
            thumbnail: {
                path: {},
                download: 0
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "starting video compression"
            },
            thumbnail : { 
                "download-status" : "0.00%"
            } 
        });
    });  
}); 

describe("end_createThumbnail", () =>  {   
    it("No Input", () =>  {
        const end = ffmpegDownloadImage.end_createThumbnail();
        expect(end).toBe("fileName undefined");
    });   

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const end = ffmpegDownloadImage.end_createThumbnail(fileName);
        expect(end).toBe("newFilePath not string");
    });   

    it("Valid fileName, valid newFilePath", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath);
        expect(end).toBe("imageFileName not string");
    });  

    it("valid fileName, valid newFilePath, valid imageFileName", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName);
        expect(end).toBe("fileType not string");
    });   

    it("valid fileName, valid newFilePath, valid imageFileName, valid fileType", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType);
        expect(end).toBe("numberOfCreatedScreenshots not number");
    }); 

    it("valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots not integer", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 2.2;
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("numberOfCreatedScreenshots value not integer");
    });   

    it("valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots less then 0", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = -2;
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("numberOfCreatedScreenshots less then 0");
    });   

    it("No Previous VideoData CurrentDownloads: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 2;
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
              }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toBe(undefined);
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });   

    it("No Previous VideoData without compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8;
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "99.9%"
            } 
        });
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
              }
            }
        });
        const getVideoData = dataVideos.getVideoData([`${fileName}`]);
        expect(getVideoData).toBe(undefined);
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });   

    it("No Previous VideoData with compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8; 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "20.0%"
            },
            thumbnail : { 
                "download-status" : "99.9%"
            } 
        }); 
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
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
                "download-status" : "20.0%"
            },
            thumbnail : { 
                "download-status" : "completed"
            } 
        });
    }); 

    it("No Previous CurrentDownloads without compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8; 
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
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
            thumbnail: {
                path: {},
                download: "completed"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    });   

    it("No Previous CurrentDownloads with compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8; 
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "20.0%"
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
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
            thumbnail: {
                path: {},
                download: "completed"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    }); 

    it("Previous CurrentDownloads VideoData without compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8; 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            thumbnail : { 
                "download-status" : "99.9%"
            } 
        });
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
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
            thumbnail: {
                path: {},
                download: "completed"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toBe(undefined);
    }); 

    it("Previous CurrentDownloads VideoData with compression: valid fileName, valid newFilePath, valid imageFileName, valid fileType, valid numberOfCreatedScreenshots", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/"; 
        const newFilePath = `${filepath}${fileName}/`;
        const imageFileName = "thunbnail";
        const fileType = ".jpg";
        const numberOfCreatedScreenshots = 8; 
        currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "20.0%"
            },
            thumbnail : { 
                "download-status" : "99.9%"
            } 
        });
        dataVideos.updateVideoData([`${fileName}`], {
            video : {
                originalVideoSrc : "videoSrc",
                originalVideoType : "videoType",
                path: "newFilePath+fileName+fileType",
                videoType : "video/mp4",
                download : "completed",
            },
            compression : {
                download: "20.0%"
            },
            thumbnail: {
                path: {},
                download: "starting"
            }
        });
        const end = ffmpegDownloadImage.end_createThumbnail(fileName, newFilePath, imageFileName, fileType, numberOfCreatedScreenshots);
        expect(end).toBe("end download");
        const getAvailableVideos = availableVideos.getAvailableVideos([`${fileName}`]);
        expect(getAvailableVideos).toMatchObject({
            info:{
              title: fileName,
              videoLink: {
                src : `/video/${fileName}`,
                type : "video/mp4"
              },
              thumbnailLink: {
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
            thumbnail: {
                path: {},
                download: "completed"
            }
        });
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([`${fileName}`]);
        expect(getCurrentDownloads).toMatchObject({
            video : { 
                "download-status" : "completed"
            },
            compression : { 
                "download-status" : "20.0%"
            },
            thumbnail : { 
                "download-status" : "completed"
            } 
        });
    }); 
}); 
