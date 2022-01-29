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
    });  
}); 