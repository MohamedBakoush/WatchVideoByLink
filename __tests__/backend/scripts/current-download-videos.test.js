const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";

beforeAll(() => {    
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    currentDownloadVideos.resetCurrentDownloadVideos();
}); 

describe("update_current_download_videos_path", () =>  {  
    afterAll(() => { 
        currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path);
    });

    it("invalid path", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path("__tests__/backend/scripts/current-download-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("currentDownloadVideos updated", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path);
        expect(updated).toBe("currentDownloadVideos updated");  
    }); 
}); 
