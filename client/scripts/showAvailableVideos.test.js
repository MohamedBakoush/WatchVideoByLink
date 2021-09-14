const showAvailableVideos = require("./showAvailableVideos");  
const basic = require("./basics");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
document.execCommand = jest.fn();
window.HTMLCanvasElement.prototype.getContext = jest.fn();
const container = document.createElement("section");
const videoID1 = "ccf40c5d-640b-44e8-ae3b-7e4563a44d29";
const videoID2 = "472290fa-dd86-40f8-8aed-c5672fd81e90";
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

const currentVideoDownloadData = {
    "ccf40c5d-640b-44e8-ae3b-7e4563a44d29": {
        "video": {
        "download-status": "completed"
        },
        "compression": {
        "download-status": "22.64%"
        },
        "thumbnail": {
        "download-status": "22.64%"
        }
    },
    "3d69eafa-d955-4ad0-8a4f-3ea16afc6b34": {
        "video": {
        "download-status": "completed"
        },
        "compression": {
        "download-status": "unfinished download"
        },
        "thumbnail": {
        "download-status": "completed"
        }
    },
    "a8f36a2f-42f7-441b-8c9a-57bf1c900348": {
        "video": {
        "download-status": "completed"
        },
        "compression": {
        "download-status": "22.64%"
        },
        "thumbnail": {
        "download-status": "completed"
        }
    }
};

const videoDetails = {
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
};

describe("loadVideoDetails", () =>  {   
    afterAll(() => {    
        global.fetch = jest.fn();
    }); 

    it("Video details loaded", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => currentVideoDownloadData  
            })
        );  
        const loadVideoDetails = await showAvailableVideos.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Video details loaded");     
    });  

    it("Failed to load video details", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => currentVideoDownloadData  
            })
        );  
        const loadVideoDetails = await showAvailableVideos.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Failed to load video details");     
    });  

    it("Fetch Request Failed", async () =>  { 
        global.fetch = jest.fn();
        const loadVideoDetails = await showAvailableVideos.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Fetch Request Failed");     
    });  
}); 

describe("eachAvailableVideoDetails", () =>  {   
    it("available videos", () =>  { 
        const eachAvailableVideoDetails = showAvailableVideos.eachAvailableVideoDetails(currentVideoDownloadData);   
        expect(eachAvailableVideoDetails).toBeDefined();       
        expect(eachAvailableVideoDetails).toBe("available videos");     
    }); 

    it("no available videos - empty object", () =>  { 
        const eachAvailableVideoDetails = showAvailableVideos.eachAvailableVideoDetails({});   
        expect(eachAvailableVideoDetails).toBeDefined();       
        expect(eachAvailableVideoDetails).toBe("no available videos");     
    });   

    it("no input", () =>  { 
        const eachAvailableVideoDetails = showAvailableVideos.eachAvailableVideoDetails();   
        expect(eachAvailableVideoDetails).toBeDefined();       
        expect(eachAvailableVideoDetails).toBe("input not an object");     
    });    
}); 

describe("showDetails", () =>  {  
    it("display showDetails", () =>  { 
        const showDetails = showAvailableVideos.showDetails(container, videoID2, videoDetails);   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("showDetails");     
    });   
     
    it("videoDetails undefined", () =>  { 
        const showDetails = showAvailableVideos.showDetails(container, videoID2);   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("invalid videoDetails");     
    });   
     
    it("video id undefined", () =>  { 
        const showDetails = showAvailableVideos.showDetails(container);   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("video id undefined");     
    }); 
     
    it("no input", () =>  { 
        const showDetails = showAvailableVideos.showDetails();   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("savedVideosThumbnailContainer undefined");  
    });
     
    it("invalid videoDetails", () =>  { 
        const showDetails = showAvailableVideos.showDetails(container, videoID2, {});   
        expect(showDetails).toBeDefined();       
        expect(showDetails).toBe("showDetails didnt work");  
    });
});

describe("optionMenuCopyOnClick", () =>  {  
    it("videoSrc not string", () =>  { 
        const optionMenuCopyOnClick = showAvailableVideos.optionMenuCopyOnClick();   
        expect(optionMenuCopyOnClick).toBeDefined();       
        expect(optionMenuCopyOnClick).toBe("videoSrc not string");     
    });   

    it("videoType not string", () =>  { 
        const optionMenuCopyOnClick = showAvailableVideos.optionMenuCopyOnClick("http://localhost:8080/video.mp4");   
        expect(optionMenuCopyOnClick).toBeDefined();       
        expect(optionMenuCopyOnClick).toBe("videoType not string");     
    });  

    it("optionMenuCopyOnClick didnt work", () =>  { 
        const optionMenuCopyOnClick = showAvailableVideos.optionMenuCopyOnClick("http://localhost:8080/video.mp4", "video/mp4");   
        expect(optionMenuCopyOnClick).toBeDefined();       
        expect(optionMenuCopyOnClick).toBe("optionMenuCopyOnClick didnt work");     
    });  

    it("display optionMenuCopyOnClick", () =>  { 
        const optionMenuCopyOnClick = showAvailableVideos.optionMenuCopyOnClick("", "", container);   
        expect(optionMenuCopyOnClick).toBeDefined();       
        expect(optionMenuCopyOnClick).toBe("optionMenuCopyOnClick");     
    });  
});
 
describe("optionMenuOnClick", () =>  {  
    it("savedVideosThumbnailContainer undefined", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick();   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("savedVideosThumbnailContainer undefined");     
    }); 

    it("videoSrc not string", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("videoSrc not string");     
    });   

    it("videoType not string", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4");   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("videoType not string");     
    });  

    it("videoInfo_ID not string", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4");   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("videoInfo_ID not string");     
    });  

    it("video_name not string", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("video_name not string");     
    });  

    it("option_menu undefined", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name");   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("option_menu undefined");     
    });  
    
    it("linkContainer undefined", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("linkContainer undefined");     
    });  
    
    it("thumbnailContainer undefined", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("thumbnailContainer undefined");     
    });  

    it("thumbnailTitleContainer undefined", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container, container);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("thumbnailTitleContainer undefined");     
    });  

    it("display optionMenuOnClick", () =>  { 
        const optionMenuOnClick = showAvailableVideos.optionMenuOnClick(container, "http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container, container, container);   
        expect(optionMenuOnClick).toBeDefined();       
        expect(optionMenuOnClick).toBe("optionMenuOnClick");     
    });   
});

describe("optionMenuEditOnClick", () =>  {  
    it("savedVideosThumbnailContainer undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick();   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("savedVideosThumbnailContainer undefined");     
    });   

    it("videoSrc not string", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("videoSrc not string");     
    }); 

    it("videoType not string", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4");   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("videoType not string");     
    });     

    it("videoInfo_ID not string", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4");   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("videoInfo_ID not string");     
    });       

    it("video_name not string", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("video_name not string");     
    });  

    it("option_menu undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name");   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("option_menu undefined");     
    });  

    it("option_menu_container undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("option_menu_container undefined");     
    });  

    it("close_option_menu undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("close_option_menu undefined");     
    });

    it("linkContainer undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container, container);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("linkContainer undefined");     
    });  

    it("inputNewTitle undefined", () =>  { 
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container, container, container);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("inputNewTitle undefined");     
    });  

    it("display optionMenuEditOnClick", () =>  { 
        const inputContainer = document.createElement("input");
        inputContainer.type = "text";
        inputContainer.value = "newInputTitle";
        const optionMenuEditOnClick = showAvailableVideos.optionMenuEditOnClick(container ,"http://localhost:8080/video.mp4", "video/mp4", videoID1, "video name", container, container, container, container, inputContainer);   
        expect(optionMenuEditOnClick).toBeDefined();       
        expect(optionMenuEditOnClick).toBe("optionMenuEditOnClick");     
    }); 
});

describe("changeVideoTitle", () =>  {  
    afterAll(() => {    
        global.fetch = jest.fn();
        basic.searchableVideoDataArray = [];
    }); 
   
    beforeEach(() => {    
        basic.searchableVideoDataArray.push(videoDetails);
    });

    it("Video Title Changed - response.ok true", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "video-title-changed"  
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle(videoID2, "new title");   
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
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle(videoID2, "new title");   
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
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle(videoID2, "new title");   
        expect(changeVideoTitle).toBeDefined();       
        expect(changeVideoTitle).toBe("Failed to Change Video Title");     
    });   

    it("Failed to Change Video Title - response.ok false", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false 
            })
        ); 
        const changeVideoTitle = await showAvailableVideos.changeVideoTitle(videoID2, "new title");   
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
        const appendImg = showAvailableVideos.appendImg(container, imageSrc, 20, 40, "idHere", "classHere", videoID1);   
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
                json: () => `video-id-${videoID1}-data-permanently-deleted`  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID1, container);   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID1}-data-permanently-deleted`); 
    });  
    
    it("Failed to Delete - invalid msg", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => `video-id-${videoID1}-data-failed-to-permanently-deleted`  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID1, container);   
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID1}-data-failed-to-permanently-deleted`); 
    });  
    
    it("Failed to Delete - random msg", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "JSON Message"  
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID1, container);  
        expect(deleteVideoData).toBeDefined();        
        expect(deleteVideoData).toBe(`video-id-${videoID1}-data-failed-to-permanently-deleted`); 
    });  
    
    it("Failed to Complete Request - response.ok false", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        ); 
        const deleteVideoData = await showAvailableVideos.deleteVideoDataPermanently(videoID1, container);   
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
        basic.searchableVideoDataArray.push(videoDetails);
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
