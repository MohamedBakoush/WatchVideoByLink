const currentVideoDownloads = require("./currentVideoDownloads");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;  
window.HTMLCanvasElement.prototype.getContext = jest.fn();

const videoID = "videoID";
let spy, mockHTML, mockArticle; 
beforeAll(() => {
    spy = jest.spyOn(document, "getElementById");
    mockHTML = document.createElement("html");  
    mockArticle = document.createElement("article");
    mockArticle.id = `${videoID}-download-status-container`; 
    mockHTML.appendChild(mockArticle);
    spy.mockReturnValue(mockHTML); 
});

describe("loadAvailableVideoDownloadDetails", () =>  { 
    it("start fetch", () =>  { 
        const loadAvailableVideoDownloadDetails = currentVideoDownloads.loadAvailableVideoDownloadDetails();   
        expect(loadAvailableVideoDownloadDetails).toBeDefined();       
        expect(loadAvailableVideoDownloadDetails).toBe("start fetch available download video details");     
    });    
}); 

describe("stopAvailableVideoDownloadDetails", () =>  { 
    it("stop fetch", () =>  { 
        const stopAvailableVideoDownloadDetails = currentVideoDownloads.stopAvailableVideoDownloadDetails();   
        expect(stopAvailableVideoDownloadDetails).toBeDefined();       
        expect(stopAvailableVideoDownloadDetails).toBe("stop fetch available download video details");     
    });    
}); 

describe("deleteVideoDataPermanently", () =>  {     
    beforeAll(() => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => `video-id-${videoID}-data-permanently-deleted`  
            })
        );
    });

    it("valid id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently(videoID);   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("video data permanently deleted");     
    });    

    it("invalid id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently("invalid-id");   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("failed to delete video data permanently");     
    }); 

    it("no id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently();   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("failed to delete video data permanently");     
    }); 

    it("Request Error", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => `video-id-${videoID}-data-permanently-deleted`  
            })
        );
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently(videoID); 
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("Request Error");     
    }); 
}); 