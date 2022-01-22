const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");

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

describe("getCurrentDownloads", () =>  {   
    it("No input - path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads();
        expect(getCurrentDownloads).toMatchObject({}); 
    }); 

    it("Empty path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([]);
        expect(getCurrentDownloads).toBe("invalid array path"); 
    }); 

    it("Invalid path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([undefined]);
        expect(getCurrentDownloads).toBe("invalid array path"); 
    }); 

    it("Get Specified Video Data", () =>  { 
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_data = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_data).toMatchObject({
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });   
    });
}); 
