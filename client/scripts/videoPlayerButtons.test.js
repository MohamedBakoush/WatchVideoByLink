/**
 * @jest-environment jsdom
 */
const videoPlayerButtons = require("./videoPlayerButtons");   
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

describe("updateFileNameID", () =>  {    
    beforeEach(() => {    
        videoPlayerButtons.updateFileNameID(null); 
    }); 

    afterAll(() => {    
        videoPlayerButtons.updateFileNameID(null); 
    }); 

    it("no input - expect undefined", () =>  {  
        const fileNameID = videoPlayerButtons.updateFileNameID(null);  
        expect(fileNameID).toBeUndefined();     
    });   
     
    it("undefined input - expect undefined", () =>  { 
        const fileNameID = videoPlayerButtons.updateFileNameID(undefined);  
        expect(fileNameID).toBeUndefined();     
        expect(fileNameID).toBe(undefined);  
    });  
     
    it("number input - expect undefined", () =>  { 
        const updatedFileNameID = videoPlayerButtons.updateFileNameID(123);  
        expect(updatedFileNameID).toBeUndefined();  
        expect(updatedFileNameID).toBe(undefined);     
    }); 

    it("string input - expect ccf40c5d-640b-44e8-ae3b-7e4563a44d29", () =>  { 
        const updatedFileNameID = videoPlayerButtons.updateFileNameID("ccf40c5d-640b-44e8-ae3b-7e4563a44d29");  
        expect(updatedFileNameID).toBeDefined(); 
        expect(updatedFileNameID).toBe("ccf40c5d-640b-44e8-ae3b-7e4563a44d29");      
    }); 
}); 

describe("backToHomePageButton", () =>  {    
    it("container undefined", () =>  {  
        const backToHomePageButton = videoPlayerButtons.backToHomePageButton();   
        expect(backToHomePageButton).toBeDefined();       
        expect(backToHomePageButton).toBe("container undefined");     
    });

    it("display backToHomePageButton", () =>  {  
        const backToHomePageButton = videoPlayerButtons.backToHomePageButton(container);   
        expect(backToHomePageButton).toBeDefined();       
        expect(backToHomePageButton).toBe("backToHomePageButton");     
    });  
}); 

describe("downloadVideoButton", () =>  {  
    it("container undefined", () =>  {   
        const downloadVideoButton = videoPlayerButtons.downloadVideoButton();   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("container undefined");     
    });  
    
    it("videoSrc not string", () =>  {   
        const downloadVideoButton = videoPlayerButtons.downloadVideoButton(container);   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("videoSrc not string");     
    });   

    it("videoType not string", () =>  {   
        const downloadVideoButton = videoPlayerButtons.downloadVideoButton(container, "http://localhost:8080/video.mp4");   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("videoType not string");     
    });   

    it("display downloadVideoButton", () =>  {   
        const downloadVideoButton = videoPlayerButtons.downloadVideoButton(container,  "http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoButton).toBeDefined();       
        expect(downloadVideoButton).toBe("downloadVideoButton");     
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
        const stopDownloadVideoStream = await videoPlayerButtons.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("fileNameID undefined");     
    }); 
    
    it("stoped video stream download", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "stoped video stream download"  
            })
        );  
        const stopDownloadVideoStream = await videoPlayerButtons.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("stoped video stream download");     
    });  

    it("videoDetails dosnet exists", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "videoDetails dosnet exists"  
            })
        );  
        const stopDownloadVideoStream = await videoPlayerButtons.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("videoDetails dosnet exists");     
    });  

    it("stop video stream download failed", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false  
            })
        );  
        const stopDownloadVideoStream = await videoPlayerButtons.stopDownloadVideoStream();   
        expect(stopDownloadVideoStream).toBeDefined();       
        expect(stopDownloadVideoStream).toBe("stop video stream download failed");     
    });  
});   

describe("addStopDownloadOnWindowClose", () =>  {  
    it("activate addStopDownloadOnWindowClose", () =>  { 
        const addStopDownloadOnWindowClose = videoPlayerButtons.addStopDownloadOnWindowClose();   
        expect(addStopDownloadOnWindowClose).toBeDefined();       
        expect(addStopDownloadOnWindowClose).toBe("addStopDownloadOnWindowClose");     
    }); 
});  

describe("removeStopDownloadOnWindowClose", () =>  {  
    it("activate removeStopDownloadOnWindowClose", () =>  { 
        const removeStopDownloadOnWindowClose = videoPlayerButtons.removeStopDownloadOnWindowClose();   
        expect(removeStopDownloadOnWindowClose).toBeDefined();       
        expect(removeStopDownloadOnWindowClose).toBe("removeStopDownloadOnWindowClose");     
    }); 
});  

describe("downloadVideoStream", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  

    it("videoSrc not string", async () =>  { 
        const downloadVideoStream = await videoPlayerButtons.downloadVideoStream();   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const downloadVideoStream = await videoPlayerButtons.downloadVideoStream("http://localhost:8080/video.mp4");   
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
        const downloadVideoStream = await videoPlayerButtons.downloadVideoStream("http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("video-id");     
    });   

    it("response not ok - failed record video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const downloadVideoStream = await videoPlayerButtons.downloadVideoStream("http://localhost:8080/video.mp4", "video/mp4");   
        expect(downloadVideoStream).toBeDefined();       
        expect(downloadVideoStream).toBe("failed record video file");     
    }); 
});  

describe("downloadVideo", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  


    it("videoSrc not string", async () =>  { 
        const downloadVideo = await videoPlayerButtons.downloadVideo();   
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const downloadVideo = await videoPlayerButtons.downloadVideo("http://localhost:8080/video.mp4");   
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
        const downloadVideo = await videoPlayerButtons.downloadVideo("http://localhost:8080/video.mp4", "video/mp4");  
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("video-id");     
    }); 

    it("response not ok - failed download video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const downloadVideo = await videoPlayerButtons.downloadVideo("http://localhost:8080/video.mp4", "video/mp4");  
        expect(downloadVideo).toBeDefined();       
        expect(downloadVideo).toBe("failed download video file");     
    }); 
});  

describe("trimVideo", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  

    it("videoSrc not string", async () =>  { 
        const trimVideo = await videoPlayerButtons.trimVideo();   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const trimVideo = await videoPlayerButtons.trimVideo("http://localhost:8080/video.mp4");   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("videoType not string");     
    });  

    it("startTime undefined", async () =>  { 
        const trimVideo = await videoPlayerButtons.trimVideo("http://localhost:8080/video.mp4", "video/mp4");   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("startTime undefined");     
    });  

    it("endTime undefined", async () =>  { 
        const trimVideo = await videoPlayerButtons.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0);   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("endTime undefined");     
    });  

    it("response ok - trimVideo", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-id"  
            })
        );  
        const trimVideo = await videoPlayerButtons.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0, 212);  
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("video-id");     
    }); 

    it("response not ok - failed download trimed video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const trimVideo = await videoPlayerButtons.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0, 212);  
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("failed download trimed video file");     
    }); 
});  

describe("backToMainVideoButton", () =>  {  
    it("downloadVideoContainer undefined", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton();   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoContainer undefined");     
    }); 
    
    it("downloadVideoButton undefined", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton(container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoButton undefined");     
    }); 
    
    it("downloadVideoMenu undefined", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton(container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoMenu undefined");     
    }); 

    it("downloadTrimButton undefined", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton(container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadTrimButton undefined");     
    }); 

    it("trimVideoBody undefined", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton(container, container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("trimVideoBody undefined");     
    }); 

    it("activate backToMainVideoButton", () =>  { 
        const backToMainVideoButton = videoPlayerButtons.backToMainVideoButton(container, container, container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("backToMainVideoButton");     
    }); 
});  

describe("createTrimVideo", () =>  { 
    it("player undefined", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo();   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("player undefined");     
    }); 

    it("downloadVideoContainer undefined", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoContainer undefined");     
    }); 

    it("downloadVideoMenu undefined", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoMenu undefined");     
    }); 

    it("downloadVideoButton undefined", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoButton undefined");     
    }); 

    it("downloadVideoMenuContent undefined", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container, container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoMenuContent undefined");     
    }); 

    it("videoSrc not string", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container, container, container, container);   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("videoSrc not string");     
    }); 

    it("videoType not string", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container, container, container, container, "http://localhost:8080/video.mp4");   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("videoType not string");     
    }); 

    it("createTrimVideo", () =>  { 
        const createTrimVideo = videoPlayerButtons.createTrimVideo(container, container, container, container, container, "http://localhost:8080/video.mp4", "video/mp4");   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("createTrimVideo");     
    }); 
});  

describe("secondsToHms", () =>  {    
    it("sec undefined", () =>  {  
        const secondsToHms = videoPlayerButtons.secondsToHms();   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("sec undefined");     
    });  

    it("354354 -> 98:25:54", () =>  {  
        const secondsToHms = videoPlayerButtons.secondsToHms(354354);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("98:25:54");     
    });  

    it("213213 -> 59:13:33", () =>  {  
        const secondsToHms = videoPlayerButtons.secondsToHms(213213);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("59:13:33");     
    });  

    it("323 -> 00:05:23", () =>  {  
        const secondsToHms = videoPlayerButtons.secondsToHms(323);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("00:05:23");     
    });  

    it("negative nuber -> 00:00:00", () =>  {  
        const secondsToHms = videoPlayerButtons.secondsToHms(-456);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("00:00:00");     
    });  
}); 