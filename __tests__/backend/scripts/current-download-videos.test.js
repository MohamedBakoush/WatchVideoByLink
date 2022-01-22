const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");

beforeAll(() => {    
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    currentDownloadVideos.resetCurrentDownloadVideos();
}); 

describe("update_current_download_videos_path", () =>  {  
    afterAll(() => { 
        currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path);
    });

    it("invalid path", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path("__tests__/backend/scripts/current-download-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("currentDownloadVideos updated", () =>  {
        const updated = currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path);
        expect(updated).toBe("currentDownloadVideos updated");  
    }); 
}); 

describe("getCurrentDownloads", () =>  {   
    it("No input - path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads();
        expect(getCurrentDownloads).toMatchObject({}); 
    }); 

    it("Empty path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([]);
        expect(getCurrentDownloads).toBe(undefined); 
    }); 

    it("Invalid path array", () =>  {
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([undefined]);
        expect(getCurrentDownloads).toBe(undefined); 
    }); 

    it("Get Specified Video Data", () =>  { 
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_data = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_data).toMatchObject({
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });   
    });
}); 

describe("resetCurrentDownloadVideos", () =>  {  
    it("resetCurrentDownloadVideos", () =>  {
        const reset = currentDownloadVideos.resetCurrentDownloadVideos();
        expect(reset).toBe("resetCurrentDownloadVideos");  
        const data = currentDownloadVideos.getCurrentDownloads();
        expect(data).toMatchObject({}); 
    });
}); 

describe("findCurrentDownloadByID", () =>  {  
    it("No input", () =>  {
        const findCurrentDownloadByID = currentDownloadVideos.findCurrentDownloadByID();
        expect(findCurrentDownloadByID).toBe(undefined);  
    });

    it("invalid id", () =>  {
        const fileName = uuidv4();
        const findCurrentDownloadByID = currentDownloadVideos.findCurrentDownloadByID(fileName);
        expect(findCurrentDownloadByID).toBe(undefined);  
    });

    it("input empty array", () =>  {
        const findCurrentDownloadByID = currentDownloadVideos.findCurrentDownloadByID([]);
        expect(findCurrentDownloadByID).toBe(undefined);  
    });

    it("input array", () =>  {
        const fileName = uuidv4();
        const findCurrentDownloadByID = currentDownloadVideos.findCurrentDownloadByID([fileName]);
        expect(findCurrentDownloadByID).toBe(undefined);  
    });

    it("Valid id", () =>  {
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const findCurrentDownloadByID = currentDownloadVideos.findCurrentDownloadByID(fileName);
        expect(findCurrentDownloadByID).toMatchObject({
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        }); 
    });
}); 

describe("updateCurrentDownloadVideos", () =>  {  
    it("No Input", () =>  { 
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos();
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    }); 

    it("undefined path_array", () =>  {
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos(undefined);
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    }); 

    it("undefined path_array undefined data", () =>  {
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos(undefined, undefined);
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    }); 

    it("invalid path_array undefined data", () =>  {
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos(fileName, undefined);
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    }); 

    it("invalid path_array valid data", () =>  {
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos(fileName, {});
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    }); 

    it("empty path_array invalid data", () =>  {
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([], undefined);
        expect(updateCurrentDownloadVideos).toBe("invalid path_array");  
    });

    it("valid path_array invalid data", () =>  {
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], undefined);
        expect(updateCurrentDownloadVideos).toBe("invalid data");  
    });

    it("Valid", () =>  { 
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  
        const get_data = currentDownloadVideos.getCurrentDownloads([fileName]);
        expect(get_data).toMatchObject({
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });   
    });
}); 

describe("deleteSpecifiedCurrentDownloadVideosData", () =>  {  
    it("No input", () =>  { 
        const deleteSpecifiedCurrentDownloadVideosData = currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData();
        expect(deleteSpecifiedCurrentDownloadVideosData).toBe("undefined Unavaiable");  
    });

    it("Invalid fileName", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedCurrentDownloadVideosData = currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
        expect(deleteSpecifiedCurrentDownloadVideosData).toBe(`${fileName} Unavaiable`);  
    });

    it("Delete fileName", () =>  { 
        const fileName = uuidv4();
        const updateCurrentDownloadVideos = currentDownloadVideos.updateCurrentDownloadVideos([fileName], {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        }); 
        expect(updateCurrentDownloadVideos).toBe("updateCurrentDownloadVideos");  

        const getCurrentDownloads_1 = currentDownloadVideos.getCurrentDownloads();
        expect(getCurrentDownloads_1[fileName]).toMatchObject({
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });    

        const deleteSpecifiedCurrentDownloadVideosData = currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
        expect(deleteSpecifiedCurrentDownloadVideosData).toBe(`${fileName} deleted`); 

        const getCurrentDownloads_2 = currentDownloadVideos.getCurrentDownloads();
        expect(getCurrentDownloads_2).toMatchObject({}); 
    }); 
}); 