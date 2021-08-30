const streamVideo = require("./streamVideo");

describe("findVideosByID", () =>  {
    beforeAll(() => {       
        streamVideo.updateVideoDataByID("test0", {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
    });

    afterAll(() => { 
        streamVideo.deleteVideoDataByID("test0");
    });

    it("Avaiable Video Data", () =>  {
        const findVideosByID = streamVideo.findVideosByID("test0");
        expect(findVideosByID).toBeDefined(); 
        expect(findVideosByID.video.download).toBe("completed"); 
        expect(findVideosByID.thumbnail.download).toBe("completed"); 
    });

    it("UnAvaiable Video Data", () =>  {
        const findVideosByID = streamVideo.findVideosByID();
        expect(findVideosByID).toBeUndefined();
    });
}); 

describe("updateVideoDataByID", () =>  { 
    afterAll(() => { 
        streamVideo.deleteVideoDataByID("test1");
    });

    it("Update Video Data", () =>  {
        const updateVideoDataByID = streamVideo.updateVideoDataByID("test1", {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
        expect(updateVideoDataByID).toBeDefined(); 
        expect(updateVideoDataByID.video.download).toBe("completed"); 
        expect(updateVideoDataByID.thumbnail.download).toBe("completed"); 
    });
}); 

describe("deleteVideoDataByID", () =>  { 
    beforeAll(() => {       
        streamVideo.updateVideoDataByID("test2", {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
    });

    it("Delete Video Data", () =>  {
        const deleteVideoDataByID = streamVideo.deleteVideoDataByID("test2");
        expect(deleteVideoDataByID).toBe("Deleted test2");   
    });

    it("VideoID Unavaiable", () =>  {
        const deleteVideoDataByID = streamVideo.deleteVideoDataByID("test3");
        expect(deleteVideoDataByID).toBe("test3 Unavaiable");   
    });
}); 
