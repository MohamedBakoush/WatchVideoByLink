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