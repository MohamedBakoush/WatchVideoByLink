const showAvailableVideos = require("./showAvailableVideos");  
const basic = require("./basics");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
window.HTMLCanvasElement.prototype.getContext = jest.fn();
const container = document.createElement("section");
const videoID = "videoID";

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

describe("changeVideoTitle", () =>  {  
    afterAll(() => {    
        global.fetch = jest.fn();
        basic.searchableVideoDataArray = [];
    }); 
   
    beforeEach(() => {    
        basic.searchableVideoDataArray.push({
            "info": {
                "title": "Title 27",
                "videoLink": {
                    "src": "/video/472290fa-dd86-40f8-8aed-c5672fd81e90",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/1",
                    "2": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/2",
                    "3": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/3",
                    "4": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/4",
                    "5": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/5",
                    "6": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/6",
                    "7": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/7",
                    "8": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/8"
                },
                "id": "472290fa-dd86-40f8-8aed-c5672fd81e90"
            }
        });
    });

    it("Video Title Changed - response.ok true", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-title-changed"  
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle("472290fa-dd86-40f8-8aed-c5672fd81e90", "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("Video Title Changed");     
    });   

    it("Video Title Changed - response.ok true - empty searchableVideoDataArray", async () =>  { 
        basic.searchableVideoDataArray = [];
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-title-changed"  
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle("472290fa-dd86-40f8-8aed-c5672fd81e90", "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("searchable video data array id unavailable");     
    });   
    
    it("Video Title Changed - response.ok true - invald id", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-title-changed"  
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle("invalid id", "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("searchable video data array id unavailable");     
    });   

    it("Failed to Change Video Title- response.ok true", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "failed-to-change-video-title"  
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle("472290fa-dd86-40f8-8aed-c5672fd81e90", "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("Failed to Change Video Title");     
    });   

    it("Failed to Change Video Title - response.ok false", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle("472290fa-dd86-40f8-8aed-c5672fd81e90", "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("Failed to Change Video Title");     
    });   
}); 

describe("appendImg", () =>  {   
    const imageSrc = "http://localhost:8080/image.png";

    it("valid tagname", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container);   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
    });

    it("valid tagname src", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc);   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
    });

    it("valid tagname src width", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20);   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
        expect(appendImg.width).toBe(20);       
    });

    it("valid tagname src width height", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20, 40);   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
        expect(appendImg.width).toBe(20);           
        expect(appendImg.height).toBe(40);    
    });

    it("valid tagname src width height id", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20, 40, "idHere");   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
        expect(appendImg.width).toBe(20);           
        expect(appendImg.height).toBe(40);    
        expect(appendImg.id).toBe("idHere");       
    });

    it("valid tagname src width height id class", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20, 40, "idHere", "classHere");   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
        expect(appendImg.width).toBe(20);           
        expect(appendImg.height).toBe(40);    
        expect(appendImg.id).toBe("idHere");       
        expect(appendImg.classList[0]).toBe("classHere");   
    });

    it("valid tagname src width height id class", () =>  { 
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20, 40, "idHere", "classHere", videoID);   
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG");   
        expect(appendImg.src).toBe(imageSrc);  
        expect(appendImg.width).toBe(20);           
        expect(appendImg.height).toBe(40);    
        expect(appendImg.id).toBe("idHere");       
        expect(appendImg.classList[0]).toBe("classHere");   
    });   
}); 

describe("backToViewAvailableVideoButton", () =>  {   
    it("backToViewAvailableVideoButton exits", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(container, container, container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton successful");     
    });   

    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(container, container, undefined);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });   
  
    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(undefined, container, container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });  

                 
    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(container, undefined, container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });  

    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(container, container, undefined);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });  

    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(undefined, undefined, container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });   

    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(undefined, container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });   

    it("backToViewAvailableVideoButton - fist ", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton(container);   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });   

    it("backToViewAvailableVideoButton no inputs", () =>  { 
        const backButton = showAvailableVideos.backToViewAvailableVideoButton();   
        expect(backButton).toBeDefined();       
        expect(backButton).toBe("backToViewAvailableVideoButton didnt work");     
    });   
}); 

describe("deleteVideoDataPermanently", () =>  {   
    afterAll(() => {    
        global.fetch = jest.fn();
    }); 
 
    it("Data permantly deleted", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => `video-id-${videoID}-data-permanently-deleted`  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID, container);   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID}-data-permanently-deleted`); 
    });  
    
    it("Failed to Delete - invalid msg", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => `video-id-${videoID}-data-failed-to-permanently-deleted`  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID, container);   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID}-data-failed-to-permanently-deleted`); 
    });  
    
    it("Failed to Delete - random msg", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "JSON Message"  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID, container);  
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID}-data-failed-to-permanently-deleted`); 
    });  
    
    it("Failed to Complete Request - response.ok false", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID, container);   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe("Failed to Complete Request"); 
    });      

    it("Failed to Complete Request - no response", async () =>  {  
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently();   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe("Failed to Complete Request"); 
    });    
}); 

describe("searchBar", () =>  {   
    it("searchBar exits", () =>  { 
        const searchBar = showAvailableVideos.searchBar();   
        expect(searchBar).toBeDefined();       
        expect(searchBar).toBe("searchBar");     
    });   
}); 

describe("searchBarKeyUp", () =>  {   
    beforeEach(() => {    
        basic.searchableVideoDataArray.push({
            "info": {
                "title": "Title 27",
                "videoLink": {
                    "src": "/video/472290fa-dd86-40f8-8aed-c5672fd81e90",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/1",
                    "2": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/2",
                    "3": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/3",
                    "4": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/4",
                    "5": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/5",
                    "6": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/6",
                    "7": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/7",
                    "8": "/thumbnail/472290fa-dd86-40f8-8aed-c5672fd81e90/8"
                },
                "id": "472290fa-dd86-40f8-8aed-c5672fd81e90"
            }
        });
    });

    afterAll(() => {    
        basic.searchableVideoDataArray = [];
    });

    it("no avaiable video data", () =>  { 
        basic.searchableVideoDataArray = [];
        const searchBarKeyUp = showAvailableVideos.searchBarKeyUp("");   
        expect(searchBarKeyUp).toBeDefined();       
        expect(searchBarKeyUp).toBe("no avaiable video data");     
    });      

    it("key phrase unavailable", () =>  { 
        const searchBarKeyUp = showAvailableVideos.searchBarKeyUp("unavailable");   
        expect(searchBarKeyUp).toBeDefined();       
        expect(searchBarKeyUp).toBe("key phrase unavailable");     
    });
    
    it("Display filterd avaiable video data", () =>  { 
        const searchBarKeyUp = showAvailableVideos.searchBarKeyUp("Ti");   
        expect(searchBarKeyUp).toBeDefined();       
        expect(searchBarKeyUp).toBe("Display filterd avaiable video data");     
    });   
    
    it("searchString not string - no input", () =>  { 
        const searchBarKeyUp = showAvailableVideos.searchBarKeyUp();   
        expect(searchBarKeyUp).toBeDefined();       
        expect(searchBarKeyUp).toBe("searchString not string");     
    });   

    it("searchString not string - number input", () =>  { 
        const searchBarKeyUp = showAvailableVideos.searchBarKeyUp(27);   
        expect(searchBarKeyUp).toBeDefined();       
        expect(searchBarKeyUp).toBe("searchString not string");     
    });   
}); 

describe("pageLoaded", () =>  {   
    it("pageLoaded exits", () =>  { 
        const pageLoaded = showAvailableVideos.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("pageLoaded");     
    });   
}); 
