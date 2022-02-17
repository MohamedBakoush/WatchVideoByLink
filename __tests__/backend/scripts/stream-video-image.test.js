const streamVideoImage = require("../../../backend/scripts/stream-video-image");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const { v4: uuidv4 } = require("uuid");

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
});

afterEach(() => {    
    dataVideos.resetVideoData();
}); 

const dataVideos_data = {
    "thumbnail": {
        "path": {
            "1": "media/video/folder/thumbnail001.jpg"
        },
      "download": "completed"
    }
};

describe("streamThumbnail", () =>  {  
    it("videoID not string", async () =>  {
        const updated = await streamVideoImage.streamThumbnail();
        expect(updated).toBe("videoID not string");  
    });

    it("invalid videoID", async () =>  {
        const fileName = uuidv4();
        const updated = await streamVideoImage.streamThumbnail(fileName);
        expect(updated).toBe("invalid videoID");  
    });

    it("thumbnailID not string", async () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], {});
        expect(updateVideoData).toBe("updateVideoData");  
        const get_data = dataVideos.getVideoData([fileName]);
        expect(get_data).toMatchObject({});   

        const updated = await streamVideoImage.streamThumbnail(fileName);
        expect(updated).toBe("thumbnailID not number");  
    });

    it("invalid thumbnailID", async () =>  {
        const fileName = uuidv4();
        const updateVideoData = dataVideos.updateVideoData([fileName], dataVideos_data);
        expect(updateVideoData).toBe("updateVideoData");  
        const get_data = dataVideos.getVideoData([fileName]);
        expect(get_data).toMatchObject({});   

        const updated = await streamVideoImage.streamThumbnail(fileName, 2020);
        expect(updated).toBe("invalid thumbnailID");  
    });
}); 