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
        const getStreamID = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(getStreamID).toBe(undefined);
    });     

    it("Defined: fileNameID", () =>  {
        const fileName = uuidv4();
        const updateStreamID = ffmpegDownloadCompression.update_download_compression_fileNameID(fileName);
        expect(updateStreamID).toBe(fileName);
        const getStreamID = ffmpegDownloadCompression.get_download_compression_fileNameID();
        expect(getStreamID).toBe(fileName);
    });     
});