const availableVideos = require("../../../backend/scripts/available-videos");

beforeAll(() => {    
    availableVideos.update_available_videos_path("__tests__/data/available-videos.test.json"); 
});

describe("update_json_path_validity", () =>  {  
    it("invalid path", () =>  {
        const updated = availableVideos.update_json_path_validity();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = availableVideos.update_json_path_validity("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("valid path", () =>  {
        const updated = availableVideos.update_json_path_validity("__tests__/data/available-videos.test.json");
        expect(updated).toBe("valid path");  
    }); 
}); 

describe("update_available_videos_path", () =>  {  
    afterAll(() => { 
        availableVideos.update_available_videos_path("__tests__/data/available-videos.test.json");
    });

    it("invalid path", () =>  {
        const updated = availableVideos.update_available_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = availableVideos.update_available_videos_path("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("availableVideos updated", () =>  {
        const updated = availableVideos.update_available_videos_path("__tests__/data/available-videos.test.json");
        expect(updated).toBe("availableVideos updated");  
    }); 
}); 

describe("resetAvailableVideos", () =>  {  
    it("resetAvailableVideos", () =>  {
        const reset = availableVideos.resetAvailableVideos();
        expect(reset).toBe("resetAvailableVideos");  
        const data = availableVideos.getAvailableVideos();
        expect(data).toMatchObject({}); 
    });
}); 
