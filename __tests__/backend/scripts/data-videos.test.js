const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
});

afterEach(() => {    
    dataVideos.resetVideoData();
}); 