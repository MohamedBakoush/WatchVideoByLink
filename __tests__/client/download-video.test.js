/**
 * @jest-environment jsdom
 */
const videoPlayerButtons = require("../../client/scripts/video-payer-buttons");   
const download_video = require("../../client/scripts/download-video");   
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
const container = document.createElement("section");
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

describe("downloadVideoButton", () =>  {  
    it("container undefined", () =>  {   
        const downloadVideoButton = download_video.downloadVideoButton();   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("container undefined");     
    });  
    
    it("videoSrc not string", () =>  {   
        const downloadVideoButton = download_video.downloadVideoButton(container);   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("videoSrc not string");     
    });   

    it("videoType not string", () =>  {   
        const downloadVideoButton = download_video.downloadVideoButton(container, "http://localhost:8080/video.mp4");   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("videoType not string");     
    });   

    it("display downloadVideoButton", () =>  {   
        const downloadVideoButton = download_video.downloadVideoButton(container,  "http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("downloadVideoButton");     
    });  
}); 

describe("downloadVideo", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  


    it("videoSrc not string", async () =>  { 
        const downloadVideo = await download_video.downloadVideo();   
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const downloadVideo = await download_video.downloadVideo("http://localhost:8080/video.mp4");   
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("videoType not string");     
    });  

    it("response ok - downloadVideo", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-id"  
            })
        );  
        const downloadVideo = await download_video.downloadVideo("http://localhost:8080/video.mp4", "video/mp4");  
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("video-id");     
    }); 

    it("response not ok - failed download video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const downloadVideo = await download_video.downloadVideo("http://localhost:8080/video.mp4", "video/mp4");  
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("failed download video file");     
    }); 
});  