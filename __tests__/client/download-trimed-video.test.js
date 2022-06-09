/**
 * @jest-environment jsdom
 */
 const downloadTrimedVideo = require("../../client/scripts/download-trimed-video");     
 const videoPlayerButtons = require("../../client/scripts/video-payer-buttons");   
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

describe("createTrimVideo", () =>  { 
    it("player undefined", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo();   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("player undefined");     
    }); 

    it("downloadVideoContainer undefined", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoContainer undefined");     
    }); 

    it("downloadVideoMenu undefined", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoMenu undefined");     
    }); 

    it("downloadVideoButton undefined", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoButton undefined");     
    }); 

    it("downloadVideoMenuContent undefined", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container, container, container);    
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("downloadVideoMenuContent undefined");     
    }); 

    it("videoSrc not string", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container, container, container, container);   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("videoSrc not string");     
    }); 

    it("videoType not string", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container, container, container, container, "http://localhost:8080/video.mp4");   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("videoType not string");     
    }); 

    it("createTrimVideo", () =>  { 
        const createTrimVideo = downloadTrimedVideo.createTrimVideo(container, container, container, container, container, "http://localhost:8080/video.mp4", "video/mp4");   
        expect(createTrimVideo).toBeDefined();       
        expect(createTrimVideo).toBe("createTrimVideo");     
    }); 
});  


describe("trimVideo", () =>  {  
    afterAll(() => {     
        global.fetch = jest.fn(); 
        videoPlayerButtons.updateFileNameID(null); 
    });  

    it("videoSrc not string", async () =>  { 
        const trimVideo = await downloadTrimedVideo.trimVideo();   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("videoSrc not string");     
    });  

    it("videoType not string", async () =>  { 
        const trimVideo = await downloadTrimedVideo.trimVideo("http://localhost:8080/video.mp4");   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("videoType not string");     
    });  

    it("startTime undefined", async () =>  { 
        const trimVideo = await downloadTrimedVideo.trimVideo("http://localhost:8080/video.mp4", "video/mp4");   
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("startTime undefined");     
    });  

    it("endTime undefined", async () =>  { 
        const trimVideo = await downloadTrimedVideo.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0);   
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
        const trimVideo = await downloadTrimedVideo.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0, 212);  
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("video-id");     
    }); 

    it("response not ok - failed download trimed video file", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        );  
        const trimVideo = await downloadTrimedVideo.trimVideo("http://localhost:8080/video.mp4", "video/mp4", 0, 212);  
        expect(trimVideo).toBeDefined();       
        expect(trimVideo).toBe("failed download trimed video file");     
    }); 
});  

describe("backToMainVideoButton", () =>  {  
    it("downloadVideoContainer undefined", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton();   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoContainer undefined");     
    }); 
    
    it("downloadVideoButton undefined", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton(container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoButton undefined");     
    }); 
    
    it("downloadVideoMenu undefined", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton(container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadVideoMenu undefined");     
    }); 

    it("downloadTrimButton undefined", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton(container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("downloadTrimButton undefined");     
    }); 

    it("trimVideoBody undefined", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton(container, container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("trimVideoBody undefined");     
    }); 

    it("activate backToMainVideoButton", () =>  { 
        const backToMainVideoButton = downloadTrimedVideo.backToMainVideoButton(container, container, container, container, container);   
        expect(backToMainVideoButton).toBeDefined();       
        expect(backToMainVideoButton).toBe("backToMainVideoButton");     
    }); 
});  