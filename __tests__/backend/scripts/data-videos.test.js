const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
});

afterEach(() => {    
    dataVideos.resetVideoData();
}); 

describe("update_data_videos_path", () =>  {  
    afterAll(() => { 
        dataVideos.update_data_videos_path(dataVideos_json_path);
    });

    it("invalid path", () =>  {
        const updated = dataVideos.update_data_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = dataVideos.update_data_videos_path("__tests__/backend/scripts/data-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("currentDownloadVideos updated", () =>  {
        const updated = dataVideos.update_data_videos_path(dataVideos_json_path);
        expect(updated).toBe("videoData updated");  
    }); 
}); 