/**
 * @jest-environment jsdom
 */
const index = require("./index");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
global.history = dom.window.history;
const videoURL = "http://localhost:8080/?t=video/mp4?v=http://localhost:8080/video.mp4";     
const container = document.createElement("section");
const inputFileTypeContainer = document.createElement("input");
inputFileTypeContainer.type = "File";  
history.pushState = jest.fn();   
history.replaceState = jest.fn(); 
function FormDataMock() {
    this.append = jest.fn();
}  
global.FormData = FormDataMock; 
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
 
describe("uploadFile", () =>  {    
    afterEach(() => {    
        global.fetch = jest.fn();
    });

    it("data undefined", async () =>  { 
        const uploadFile = await index.uploadFile();   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("data undefined");     
    });    
    
    it("videoLink undefined", async () =>  { 
        const uploadFile = await index.uploadFile(inputFileTypeContainer);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("videoLink undefined");     
    });    

    it("newUploadVideoForm undefined", async () =>  { 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("newUploadVideoForm undefined");     
    });    

    it("Response ok - downloading-uploaded-video", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "downloading-uploaded-video"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("downloading-uploaded-video");     
    });   
    
    it("Response ok - video-size-over-size-limit", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-size-over-size-limit"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("video-size-over-size-limit");     
    });

    it("Response ok - Cannot-find-ffmpeg-ffprobe", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "Cannot-find-ffmpeg-ffprobe"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("Cannot-find-ffmpeg-ffprobe");     
    });
    
    it("Response ok - Cannot-find-ffmpeg", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "Cannot-find-ffmpeg"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("Cannot-find-ffmpeg");     
    });
    
    it("Response ok - Cannot-find-ffprobe", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "Cannot-find-ffprobe"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("Cannot-find-ffprobe");     
    });
    
    it("Response ok - ffmpeg-failed", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "ffmpeg-failed"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("ffmpeg-failed");     
    });
    
    
    it("Response ok - value returned", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "value returned"

            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("value returned");     
    });

    it("Response not ok", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const uploadFile = await index.uploadFile(inputFileTypeContainer, container, container);   
        expect(uploadFile).toBeDefined();       
        expect(uploadFile).toBe("Failed to upload video file");     
    });
}); 

describe("getVideoPlayerSettings", () =>  {    
    afterEach(() => {    
        global.fetch = jest.fn();
    });
    
    it("response ok", async () =>  { 
        const videoPlayerSettings = {  
            "volume": 1,
            "muted": true,
            "chromecast": false 
        };
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

describe("getVideoLinkFromUrl", () =>  {     
    afterEach(() => {    
        global.fetch = jest.fn();
    });

    it("url_link not string", async () =>  {  
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl();   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl).toBe("url_link not string");    
    });   

    it("searchingForVideoLinkMessageContainer undefined", async () =>  {  
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl("http://localhost:8080/");   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl).toBe("searchingForVideoLinkMessageContainer undefined");    
    });  

    it("Failed to get video link from URL", async () =>  { 
        const videoDataFromUrl = {
            input_url_link: "http://localhost:8080/",
            video_url: "http://localhost:8080/video.mp4",
            video_file_format: "video/mp4"
        };  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => videoDataFromUrl

            })
        ); 
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl("http://localhost:8080/", container);   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl.input_url_link).toBe("http://localhost:8080/");  
        expect(getVideoLinkFromUrl.video_url).toBe("http://localhost:8080/video.mp4");    
        expect(getVideoLinkFromUrl.video_file_format).toBe("video/mp4");  
    });
    
    it("failed-get-video-url-from-provided-url", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "failed-get-video-url-from-provided-url"

            })
        ); 
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl("http://localhost:8080/", container);   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl).toBe("Failed to get video link from URL");    
    });

     
    it("Failed to get video link from URL", async () =>  {  
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl("http://localhost:8080/", container);   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl).toBe("Failed to get video link from URL");    
    });

    it("Failed fetch video link from URL", async () =>  {  
        const getVideoLinkFromUrl = await index.getVideoLinkFromUrl("http://localhost:8080/", container);   
        expect(getVideoLinkFromUrl).toBeDefined();       
        expect(getVideoLinkFromUrl).toBe("Failed fetch video link from URL");    
    });        
}); 

describe("pageLoaded", () =>  {      
    let location; 
    afterEach(() => {
      window.location = location;
    });
    
    it("Show video from URL", () =>  {   
        const url = "http://localhost:8080/?t=video/mp4?v=VideoLink";
        location = window.location;
        const mockLocation = new URL(url);
        mockLocation.replace = jest.fn();
        delete window.location;
        window.location = mockLocation;

        const pageLoaded = index.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("Show video from URL");    
    });   
    
    it("Get Video URL Auto", () =>  {  
        const url = "http://localhost:8080/?auto=VideoLink";
        location = window.location;
        const mockLocation = new URL(url);
        mockLocation.replace = jest.fn();
        delete window.location;
        window.location = mockLocation; 

        const pageLoaded = index.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("Get Video URL Auto");    
    });  

    it("show saved video", () =>  {   
        const url = "http://localhost:8080/saved/videos";
        location = window.location;
        const mockLocation = new URL(url);
        mockLocation.replace = jest.fn();
        delete window.location;
        window.location = mockLocation; 

        const pageLoaded = index.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("show saved video");    
    });  

    it("show homepage", () =>  {  
        const url = "http://localhost:8080/";
        location = window.location;
        const mockLocation = new URL(url);
        mockLocation.replace = jest.fn();
        delete window.location;
        window.location = mockLocation; 
        
        const pageLoaded = index.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("show homepage");    
    });   
}); 