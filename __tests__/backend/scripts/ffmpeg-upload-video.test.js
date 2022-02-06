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

