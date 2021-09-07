const currentVideoDownloads = require("./currentVideoDownloads");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;  
window.HTMLCanvasElement.prototype.getContext = jest.fn();
const container = document.createElement("section");

const videoID = "videoID";
let spy, mockHTML, mockArticle; 
beforeAll(() => {
    spy = jest.spyOn(document, "getElementById");
    mockHTML = document.createElement("html");  
    mockArticle = document.createElement("article");
    mockArticle.id = `${videoID}-download-status-container`; 
    mockHTML.appendChild(mockArticle);
    spy.mockReturnValue(mockHTML); 
});

describe("showDetailsIfDownloadDetailsAvailable", () =>  {      
    it("video unfinished, thumbnail and compression unfinished", () =>  { 
        const videoDownloadDetails = { 
            "video": {
                "download-status":"unfinished download"
            },
            "compression": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "unfinished download"
        }
        } ;  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("video unfinished");
     });  

    it("working video for untrunc is unavailable", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "working video for untrunc is unavailable"
            },
            "compression": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "unfinished download"
            }
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("working video for untrunc is unavailable");
     });  

    it("thumbnail and compression unfinished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "unfinished download"
            }
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("thumbnail and compression unfinished");
     });    
        
    it("thumbnail unfinished, compression finished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "unfinished download"
            }
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("thumbnail unfinished");
     }); 

    it("thumbnail finished, compression unfinished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "completed"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("compression unfinished");
    }); 

    it("Display Video Download Details - video, compression, thumbnail downloading", () =>  { 
        const videoDownloadDetails = {
            "video": {
            "download-status": "20.00%"
            },
            "compression": {
            "download-status": "20.00%"
            },
            "thumbnail": {
            "download-status": "20.00%"
            }
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Display Video Download Details");
    });

    it("Display Video Download Details - video downloading", () =>  { 
        const videoDownloadDetails = {
            "video": {
            "download-status": "20.00%"
            },
            "compression": {
            "download-status": "waiting for video"
            },
            "thumbnail": {
            "download-status": "waiting for video"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Display Video Download Details");
    });

    it("Display Video Download Details - compression, thumbnail downloading", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status":  "20.00%"
            },
            "thumbnail": {
                "download-status": "20.00%"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Display Video Download Details");
    });

    it("Display Video Download Details - compression downloading", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status":  "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Display Video Download Details");
    });

    it("Display Video Download Details - compression downloading", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status":  "20.00%"
            },
            "thumbnail": {
                "download-status": "completed"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Display Video Download Details");
    });

    it("video completed, thumbnail unfinished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            }, 
            "thumbnail": {
                "download-status": "unfinished download"
            } 
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, videoDownloadDetails.thumbnail);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("thumbnail unfinished");
    });

    it("video completed, compression unfinished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "completed"
            }, 
            "compression": {
                "download-status": "unfinished download"
            }
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video, undefined, videoDownloadDetails.compression);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("compression unfinished");
    });

    it("video unfinished", () =>  { 
        const videoDownloadDetails = {
            "video": {
                "download-status": "unfinished download"
            }  
        };  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id", videoDownloadDetails.video);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("video unfinished");
    });

    it("Video Download Details unavaiable", () =>  {  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container, "id");
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Video Download Details unavaiable");
    });

    it("Video ID undefined", () =>  {  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable(container);
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("Video ID unavaiable");
    });

    it("container undefined", () =>  {  
        const showDownloadDetails = currentVideoDownloads.showDetailsIfDownloadDetailsAvailable();
        expect(showDownloadDetails).toBeDefined(); 
        expect(showDownloadDetails).toBe("container unavaiable");
    });
}); 

describe("completeDownloadRequest", () =>  { 
    it("redownload thumbnails & compression", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "redownload thumbnails & compression"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("valid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Redownload Thumbnails & Compression: valid filname");     
    });    

    it("redownload thumbnails", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "redownload thumbnails"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("valid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Redownload Thumbnails: valid filname");     
    });  

    it("redownload compression", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "redownload compression"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("valid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Redownload Compression: valid filname");     
    });  

    it("untrunc broke video", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "untrunc broke video"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("valid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Untrunc Broke Video: valid filname");     
    });  

    it("download status: completed", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "download status: completed"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("valid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Download Completed: valid filname");     
    });  

    it("invalid current downlods id", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => "Invalid Current Downlods ID"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest("invalid filname");   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Invalid Current Downlods ID");     
    });  

    it("Failed to Complete Request", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => "redownload thumbnails & compression"  
            })
        );
        const completeDownloadRequest = await currentVideoDownloads.completeDownloadRequest();   
        expect(completeDownloadRequest).toBeDefined();       
        expect(completeDownloadRequest).toBe("Failed to Complete Request");     
    });   
}); 

describe("loadAvailableVideoDownloadDetails", () =>  { 
    it("start fetch", () =>  { 
        const loadAvailableVideoDownloadDetails = currentVideoDownloads.loadAvailableVideoDownloadDetails();   
        expect(loadAvailableVideoDownloadDetails).toBeDefined();       
        expect(loadAvailableVideoDownloadDetails).toBe("start fetch available download video details");     
    });    
}); 

describe("stopAvailableVideoDownloadDetails", () =>  { 
    it("stop fetch", () =>  { 
        const stopAvailableVideoDownloadDetails = currentVideoDownloads.stopAvailableVideoDownloadDetails();   
        expect(stopAvailableVideoDownloadDetails).toBeDefined();       
        expect(stopAvailableVideoDownloadDetails).toBe("stop fetch available download video details");     
    });    
}); 

describe("deleteVideoDataPermanently", () =>  {     
    beforeAll(() => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => `video-id-${videoID}-data-permanently-deleted`  
            })
        );
    });

    it("valid id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently(videoID);   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("video data permanently deleted");     
    });    

    it("invalid id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently("invalid-id");   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("failed to delete video data permanently");     
    }); 

    it("no id", async () =>  { 
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently();   
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("failed to delete video data permanently");     
    }); 

    it("Request Error", async () =>  { 
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => `video-id-${videoID}-data-permanently-deleted`  
            })
        );
        const deleteDataPermanently = await currentVideoDownloads.deleteVideoDataPermanently(videoID); 
        expect(deleteDataPermanently).toBeDefined();       
        expect(deleteDataPermanently).toBe("Request Error");     
    }); 
}); 