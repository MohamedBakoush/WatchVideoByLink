/**
 * @jest-environment jsdom
 */
const downloadStream = require("../../client/scripts/download-stream");  
const videoPlayerButtons = require("../../client/scripts/video-payer-buttons");   
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;    
let spy, mockHTML, mockHead, mockFavicon, mockArticle; 
beforeAll(() => {
    spy = jest.spyOn(document, "getElementById");
    mockHTML = document.createElement("html"); 
    mockHead = document.createElement("head"); 
    mockHTML.appendChild(mockHead);
    mockFavicon = document.createElement("link");
    mockFavicon.id = "favicon";
    mockFavicon.rel = "icon";
    mockFavicon.href = "../favicon.ico";
    mockFavicon.type = "image/png"; 
    mockHead.appendChild(mockFavicon);
    mockArticle = document.createElement("article");
    mockArticle.id = "websiteContentContainer"; 
    mockHTML.appendChild(mockArticle);
    spy.mockReturnValue(mockHTML); 
});

describe("downloadVideoStream", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  

    it("videoSrc not string", async () =>  { 
        const downloadVideoStream = await downloadStream.downloadVideoStream();   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const downloadVideoStream = await downloadStream.downloadVideoStream("http://localhost:8080/video.mp4");   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("videoType not string");     
    });  

    it("response ok - downloadVideoStream", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-id"  
            })
        );  
        const downloadVideoStream = await downloadStream.downloadVideoStream("http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("video-id");     
    });   

    it("response not ok - failed record video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const downloadVideoStream = await downloadStream.downloadVideoStream("http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("failed record video file");     
    }); 
});  

describe("stopDownloadVideoStream", () =>  {  
    beforeEach(() => {     
        videoPlayerButtons.updateFileNameID("newID");
    });     
      
    afterAll(() => {    
        videoPlayerButtons.updateFileNameID(null); 
        global.fetch = jest.fn(); 
    });  

    it("fileNameID undefined", async () =>  { 
        videoPlayerButtons.updateFileNameID(null); 
        const stopDownloadVideoStream = await downloadStream.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("fileNameID undefined");     
    }); 
    
    it("stop video stream download failed", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false  
            })
        );  
        const stopDownloadVideoStream = await downloadStream.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("stop video stream download failed");     
    });  
});   


describe("addStopDownloadOnWindowClose", () =>  {  
    it("activate addStopDownloadOnWindowClose", () =>  { 
        const addStopDownloadOnWindowClose = downloadStream.addStopDownloadOnWindowClose();   
        expect(addStopDownloadOnWindowClose).toBeDefined();       
        expect(addStopDownloadOnWindowClose).toBe("addStopDownloadOnWindowClose");     
    }); 
});  
 

describe("removeStopDownloadOnWindowClose", () =>  {  
    it("activate removeStopDownloadOnWindowClose", () =>  { 
        const removeStopDownloadOnWindowClose = downloadStream.removeStopDownloadOnWindowClose();   
        expect(removeStopDownloadOnWindowClose).toBeDefined();       
        expect(removeStopDownloadOnWindowClose).toBe("removeStopDownloadOnWindowClose");     
    }); 
});   