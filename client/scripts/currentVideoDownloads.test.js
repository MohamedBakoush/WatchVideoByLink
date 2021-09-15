/**
 * @jest-environment jsdom
 */
const currentVideoDownloads = require("./currentVideoDownloads");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;  
window.HTMLCanvasElement.prototype.getContext = jest.fn();
const container = document.createElement("section");
const videoID = "videoID";

afterEach(() => {    
    jest.restoreAllMocks(); 
});

describe("loadVideoDetails", () =>  {
    beforeEach(() => {    
        let spy = jest.spyOn(document, "getElementById"); 
        let mockSection = document.createElement("section");
        mockSection.id = "websiteContentContainer";  
        spy.mockReturnValue(mockSection); 
    });

    const data = {
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
 
    it("Display Current Downloads", async () =>  {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () =>  data
            })
        );      
        currentVideoDownloads.update_show_current_downloads(true);
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Display Current Downloads");   
        global.fetch = jest.fn(); 
    }); 
        
    it("Show Current Downlods False", async () =>  {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () =>  data
            })
        ); 
        currentVideoDownloads.update_show_current_downloads(false);
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Show Current Downlods False");   
        global.fetch = jest.fn();
    });
     
    it("Fetch response not ok", async () =>  {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () =>  data
            })
        ); 
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Fetch response not ok");   
        global.fetch = jest.fn();
    }); 
    it("Failed fetch download details", async () =>  { 
        currentVideoDownloads.update_show_current_downloads(false);
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("stoped current downloads no longer visable");     
        currentVideoDownloads.update_show_current_downloads(true);
    }); 
    
    it("Failed fetch download details", async () =>  {       
        currentVideoDownloads.update_show_current_downloads(false);
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("stoped current downloads no longer visable");     
        currentVideoDownloads.update_show_current_downloads(true);
    }); 

    it("Failed fetch download details", async () =>  { 
        const loadVideoDetails = await currentVideoDownloads.loadVideoDetails();   
        expect(loadVideoDetails).toBeDefined();       
        expect(loadVideoDetails).toBe("Failed fetch download details");     
    });    
}); 

describe("eachAvailableVideoDownloadDetails", () =>  {
    const videoDownloadDetails = {
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
      } ; 
       
    it("Show current available dowloads", () =>  {
        const eachAvailableVideoDownloadDetails = currentVideoDownloads.eachAvailableVideoDownloadDetails(videoDownloadDetails);   
        expect(eachAvailableVideoDownloadDetails).toBeDefined();       
        expect(eachAvailableVideoDownloadDetails).toBe("Show current available dowloads");     
    });  

    it("No current available dowloads", () =>  {   

        let spy = jest.spyOn(document, "getElementById"); 
        let mockSection = document.createElement("section");
        mockSection.id = "no-current-dowloads-available";  
        spy.mockReturnValue(mockSection); 
        
        const eachAvailableVideoDownloadDetails = currentVideoDownloads.eachAvailableVideoDownloadDetails({});   
        expect(eachAvailableVideoDownloadDetails).toBeDefined();       
        expect(eachAvailableVideoDownloadDetails).toBe("No current available dowloads");     
    }); 

    it("video download details unavailable", () =>  { 
        const eachAvailableVideoDownloadDetails = currentVideoDownloads.eachAvailableVideoDownloadDetails();   
        expect(eachAvailableVideoDownloadDetails).toBeDefined();       
        expect(eachAvailableVideoDownloadDetails).toBe("video download details unavailable");     
    });    
}); 

describe("forEachVideoDownloadDetails", () =>   {    
    it("show download details if avaiable", () =>  { 
        const videoDownloadDetails = {
            videoID: {
                "video": {
                    "download-status": "completed"
                },
                "compression": {
                    "download-status": "22.64%"
                },
                "thumbnail": {
                    "download-status": "22.64%"
                }
            } 
        }; 
        const forEachVideoDownloadDetails = currentVideoDownloads.forEachVideoDownloadDetails(container, videoDownloadDetails, videoID);   
        expect(forEachVideoDownloadDetails).toBeDefined();       
        expect(forEachVideoDownloadDetails).toBe("show download details if avaiable");     
    });  
    
    it("Display Video Download Details", () =>  {
         
        let spy = jest.spyOn(document, "getElementById"); 
        let mockSection = document.createElement("section");
        mockSection.id = "id-download-status-container";  
        spy.mockReturnValue(mockSection); 

        const videoDownloadDetails = {
            "id": {
                "video": {
                    "download-status": "completed"
                },
                "compression": {
                    "download-status": "22.64%"
                },
                "thumbnail": {
                    "download-status": "22.64%"
                }
            } 
        }; 
        const forEachVideoDownloadDetails = currentVideoDownloads.forEachVideoDownloadDetails(container, videoDownloadDetails, "id");   
        expect(forEachVideoDownloadDetails).toBeDefined();       
        expect(forEachVideoDownloadDetails).toBe("Display Video Download Details");     
    });   
    
    it("video download unfinished", () =>  {
                 
        let spy = jest.spyOn(document, "getElementById"); 
        let mockSection = document.createElement("section");
        mockSection.id = "id-download-status-container";  
        spy.mockReturnValue(mockSection); 

        const videoDownloadDetails = {
            "id": {
                "video": {
                    "download-status": "unfinished download"
                },
                "compression": {
                    "download-status": "unfinished download"
                },
                "thumbnail": {
                    "download-status": "unfinished download"
                }
            } 
        }; 
        const forEachVideoDownloadDetails = currentVideoDownloads.forEachVideoDownloadDetails(container, videoDownloadDetails, "id");   
        expect(forEachVideoDownloadDetails).toBeDefined();       
        expect(forEachVideoDownloadDetails).toBe("video download unfinished");     
    });  
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

describe("update_show_current_downloads", () =>  { 
    it("true input", () =>  { 
        const updateShowCurrentDownloads = currentVideoDownloads.update_show_current_downloads(true);   
        expect(updateShowCurrentDownloads).toBeDefined();       
        expect(updateShowCurrentDownloads).toBe(true);     
    }); 

    it("false input", () =>  { 
        const updateShowCurrentDownloads = currentVideoDownloads.update_show_current_downloads(false);   
        expect(updateShowCurrentDownloads).toBeDefined();       
        expect(updateShowCurrentDownloads).toBe(false);     
    });    
    
    it("number input", () =>  { 
        const updateShowCurrentDownloads = currentVideoDownloads.update_show_current_downloads(123);   
        expect(updateShowCurrentDownloads).toBeDefined();       
        expect(updateShowCurrentDownloads).toBe("input has to be boolean");     
    }); 
    
    it("string input", () =>  { 
        const updateShowCurrentDownloads = currentVideoDownloads.update_show_current_downloads("string");   
        expect(updateShowCurrentDownloads).toBeDefined();       
        expect(updateShowCurrentDownloads).toBe("input has to be boolean");     
    }); 

    it("no input", () =>  { 
        const updateShowCurrentDownloads = currentVideoDownloads.update_show_current_downloads();   
        expect(updateShowCurrentDownloads).toBeDefined();       
        expect(updateShowCurrentDownloads).toBe("input has to be boolean");     
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