const index = require("./index");   
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
global.history = dom.window.history;
const videoURL = "http://localhost:8080/?t=video/mp4?v=http://localhost:8080/video.mp4";     
const container = document.createElement("section");
history.replaceState = jest.fn();   

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

describe("showVideoFromUrl", () =>  {    
    it("Valid URL - showVideoFromUrl", () =>  { 
        const showVideoFromUrl = index.showVideoFromUrl(videoURL);   
        expect(showVideoFromUrl).toBeDefined();       
        expect(showVideoFromUrl).toBe("showVideoFromUrl");     
    });    

    it("Invalid URL - redirect to homepage", () =>  { 
        const showVideoFromUrl = index.showVideoFromUrl("invalid url");   
        expect(showVideoFromUrl).toBeDefined();       
        expect(showVideoFromUrl).toBe("redirect to homepage");     
    });    

    it("showVideoFromUrl didnt work", () =>  { 
        const showVideoFromUrl = index.showVideoFromUrl();   
        expect(showVideoFromUrl).toBeDefined();       
        expect(showVideoFromUrl).toBe("showVideoFromUrl didnt work");     
    });    
}); 

describe("showDetails", () =>  {    
    it("display showDetails", () =>  { 
        const showDetails = index.showDetails();   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("showDetails");     
    });       
}); 

describe("uploadVideoDetails", () =>  {    
    it("videoLink undefined", () =>  { 
        const uploadVideoDetails = index.uploadVideoDetails();   
        expect(uploadVideoDetails).toBeDefined();       
        expect(uploadVideoDetails).toBe("videoLink undefined");     
    });    

    it("display uploadVideoDetails", () =>  { 
        const uploadVideoDetails = index.uploadVideoDetails(container);   
        expect(uploadVideoDetails).toBeDefined();       
        expect(uploadVideoDetails).toBe("uploadVideoDetails");     
    });       
}); 