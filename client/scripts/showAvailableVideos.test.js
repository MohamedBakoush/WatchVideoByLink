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
