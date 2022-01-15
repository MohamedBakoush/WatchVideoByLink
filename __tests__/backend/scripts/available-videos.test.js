const availableVideos = require("../../../backend/scripts/available-videos");
const availableVideos_json_path = "__tests__/data/available-videos.test.json";
const { v4: uuidv4 } = require("uuid");

beforeAll(() => {    
    availableVideos.update_available_videos_path(availableVideos_json_path); 
    availableVideos.resetAvailableVideos();
});

afterEach(() => {    
    availableVideos.resetAvailableVideos();
}); 

describe("update_json_path_validity", () =>  {  
    it("invalid path", () =>  {
        const updated = availableVideos.update_json_path_validity();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = availableVideos.update_json_path_validity("__tests__/backend/scripts/available-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("valid path", () =>  {
        const updated = availableVideos.update_json_path_validity(availableVideos_json_path);
        expect(updated).toBe("valid path");  
    }); 
}); 

describe("update_available_videos_path", () =>  {  
    afterAll(() => { 
        availableVideos.update_available_videos_path(availableVideos_json_path);
    });

    it("invalid path", () =>  {
        const updated = availableVideos.update_available_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = availableVideos.update_available_videos_path("__tests__/backend/scripts/available-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("availableVideos updated", () =>  {
        const updated = availableVideos.update_available_videos_path(availableVideos_json_path);
        expect(updated).toBe("availableVideos updated");  
    }); 
}); 

describe("getAvailableVideos", () =>  {   
    it("No input - path array", () =>  {
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Invalid path array", () =>  {
        const getAvailableVideos = availableVideos.getAvailableVideos([]);
        expect(getAvailableVideos).toBe("invalid array path"); 
    }); 

    it("Get Specified Video Data", () =>  { 
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  
        const get_data = availableVideos.getAvailableVideos([fileName]);
        expect(get_data).toMatchObject({
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });   
    });
}); 

describe("resetAvailableVideos", () =>  {  
    it("resetAvailableVideos", () =>  {
        const reset = availableVideos.resetAvailableVideos();
        expect(reset).toBe("resetAvailableVideos");  
        const data = availableVideos.getAvailableVideos();
        expect(data).toMatchObject({}); 
    });
}); 

describe("updateAvailableVideoData", () =>  {  
    it("invalid path_array", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData(fileName, {});
        expect(updateAvailableVideos).toBe("invalid path_array");  
    }); 

    it("invalid data", () =>  {
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], undefined);
        expect(updateAvailableVideos).toBe("invalid data");  
    }); 

    it("updateAvailableVideoData", () =>  { 
        const fileName = uuidv4();
        const updateAvailableVideos = availableVideos.updateAvailableVideoData([fileName], {
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });
        expect(updateAvailableVideos).toBe("updateAvailableVideoData");  
        const get_data = availableVideos.getAvailableVideos([fileName]);
        expect(get_data).toMatchObject({
            "info": {
                "title": fileName,
                "videoLink": {
                    "src": `/video/${fileName}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${fileName}/1`,
                    "2": `/thumbnail/${fileName}/2`,
                    "3": `/thumbnail/${fileName}/3`,
                    "4": `/thumbnail/${fileName}/4`,
                    "5": `/thumbnail/${fileName}/5`,
                    "6": `/thumbnail/${fileName}/6`,
                    "7": `/thumbnail/${fileName}/7`,
                    "8": `/thumbnail/${fileName}/8`
                }
            }
        });   
    });
}); 

describe("createFolder", () =>  {  
    it("create Folder", () =>  { 
        const create = availableVideos.createFolder(undefined, "folder_test");
        expect(create.message).toBe("folder-created"); 
        const get = availableVideos.getAvailableVideos([create.folderID]);
        expect(get).toMatchObject({
            "content": {}, 
            "info": {
                "inside-folder": "folder-main", 
                "title": "folder_test"
            }
        });     
    });

    it("Create Folder Inside Folder", () =>  { 
        const create_1 = availableVideos.createFolder(undefined, "folder_test_1");
        expect(create_1.message).toBe("folder-created"); 
        const get_1 = availableVideos.getAvailableVideos([create_1.folderID]);
        expect(get_1).toMatchObject({
            "content": {}, 
            "info": {
                "inside-folder": "folder-main", 
                "title": "folder_test_1"
            }
        });   
        const create_2 = availableVideos.createFolder([create_1.folderID], "folder_test_2");
        expect(create_2.message).toBe("folder-created");
        const get_2 = availableVideos.getAvailableVideos([create_1.folderID, "content", create_2.folderID]);
        expect(get_2).toMatchObject({
            "content": {}, 
            "info": {
                "inside-folder": `${create_1.folderID}`, 
                "title": "folder_test_2"
            }
        });   
    });
}); 
