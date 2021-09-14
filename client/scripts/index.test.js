 
const index = require("./index");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
global.history = dom.window.history;
const videoURL = "http://localhost:8080/?t=video/mp4?v=http://localhost:8080/video.mp4";     
const container = document.createElement("section");
history.pushState = jest.fn();   
history.replaceState = jest.fn();   
window.HTMLCanvasElement.prototype.getContext = jest.fn();

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

const videoPlayerSettings = {  
    "volume": 1,
    "muted": true,
    "chromecast": false 
};

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

describe("getVideoPlayerSettings", () =>  {    
    afterEach(() => {    
        global.fetch = jest.fn();
    });
    
    it("response ok", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () =>  videoPlayerSettings
            })
        ); 
        const getVideoPlayerSettings = await index.getVideoPlayerSettings();   
        expect(getVideoPlayerSettings).toBeDefined();       
        expect(getVideoPlayerSettings.volume).toBe(1);    
        expect(getVideoPlayerSettings.muted).toBe(true);  
        expect(getVideoPlayerSettings.chromecast).toBe(false);     
    });        

    it("response false", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const getVideoPlayerSettings = await index.getVideoPlayerSettings();   
        expect(getVideoPlayerSettings).toBeDefined();       
        expect(getVideoPlayerSettings.volume).toBe(1);    
        expect(getVideoPlayerSettings.muted).toBe(false); 
        expect(getVideoPlayerSettings.chromecast).toBe(false);            
    });   
    
    it("Failed fetch video player settings", async () =>  {   
        const getVideoPlayerSettings = await index.getVideoPlayerSettings();   
        expect(getVideoPlayerSettings).toBeDefined();       
        expect(getVideoPlayerSettings).toBe("Failed fetch video player settings");               
    }); 
});    

describe("updateVideoPlayerVolume", () =>  {    
    afterEach(() => {    
        global.fetch = jest.fn();
    });
    
    it("volume-muted-invaid", async () =>  {  
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume();   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("volume-muted-invaid");    
    });     
    
    it("muted-invaid", async () =>  {  
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume(1);   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("muted-invaid");    
    });     
     
    it("volume-invaid", async () =>  {  
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume(undefined, true);   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("volume-invaid");    
    });    
     
    it("updated-video-player-volume", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "updated-video-player-volume"

            })
        ); 
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume(1, true);   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("updated-video-player-volume");    
    });     

    it("Failed to update video volume messages", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume(1, true);   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("Failed to update video volume messages");    
    });     

    it("Failed fetch video player volume update", async () =>  {  
        const updateVideoPlayerVolume = await index.updateVideoPlayerVolume(1, true);   
        expect(updateVideoPlayerVolume).toBeDefined();       
        expect(updateVideoPlayerVolume).toBe("Failed fetch video player volume update");    
    });       
});    

describe("getVideoUrlAuto", () =>  {     
    it("url_link not string", () =>  {  
        const getVideoUrlAuto = index.getVideoUrlAuto();   
        expect(getVideoUrlAuto).toBeDefined();       
        expect(getVideoUrlAuto).toBe("url_link not string");    
    });    
    
    it("getVideoUrlAuto", () =>  {  
        const getVideoUrlAuto = index.getVideoUrlAuto("http://localhost:8080/");   
        expect(getVideoUrlAuto).toBeDefined();       
        expect(getVideoUrlAuto).toBe("getVideoUrlAuto");    
    });    
});    