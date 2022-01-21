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

describe("availableVideosfolderPath_String", () =>  {   
    it("invalid folderIDPath", () =>  { 
        const string = availableVideos.availableVideosfolderPath_String();
        expect(string).toBe("invalid folderIDPath");  
    }); 

    it("folderIDPath array input empty", () =>  { 
        const string = availableVideos.availableVideosfolderPath_String([]);
        expect(string).toBe("folderIDPath array input empty");  
    }); 

    it("folder content string path", () =>  { 
        const string = availableVideos.availableVideosfolderPath_String(["folder_test"]);
        expect(string).toBe("availableVideos[\"folder_test\"].content");  
    }); 

    it("folder in a folder string path", () =>  { 
        const string = availableVideos.availableVideosfolderPath_String(["folder_test_1", "folder_test_2"]);
        expect(string).toBe("availableVideos[\"folder_test_1\"].content[\"folder_test_2\"].content");  
    }); 
}); 

describe("availableVideosfolderPath_Array", () =>  {   
    it("invalid folderIDPath", () =>  { 
        const string = availableVideos.availableVideosfolderPath_Array();
        expect(string).toBe("invalid folderIDPath");  
    }); 

    it("folderIDPath array input empty", () =>  { 
        const string = availableVideos.availableVideosfolderPath_Array([]);
        expect(string).toBe("folderIDPath array input empty");  
    }); 

    it("folder content array path", () =>  { 
        const string = availableVideos.availableVideosfolderPath_Array(["folder_test"]);
        expect(string).toEqual(["folder_test", "content"]);  
    }); 

    it("folder in a folder array path", () =>  { 
        const string = availableVideos.availableVideosfolderPath_Array(["folder_test_1", "folder_test_2"]);
        expect(string).toEqual(["folder_test_1", "content", "folder_test_2", "content"]);  
    }); 
}); 

describe("changeTitle", () =>  {
    it("Change Title: Video", async () =>  { 
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });

        const changeTitle = await availableVideos.changeTitle(id, "Test: new video title");
        expect(changeTitle.message).toBe("video-title-changed",);  
        expect(changeTitle.availableVideos[id]["info"]["title"]).toBe("Test: new video title"); 
    });

    it("Change Title: Video inside Folder", async () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });

        availableVideos.inputSelectedIDIntoFolderID(id, createFolder.folderID,);

        const changeTitle = await availableVideos.changeTitle(id, "Test: new video title", [createFolder.folderID]);
        expect(changeTitle.message).toBe("video-title-changed",);  
        expect(changeTitle.availableVideos[createFolder.folderID]["content"][id]["info"]["title"]).toBe("Test: new video title"); 
    });

    it("Change Title: Folder", async () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");   
        const changeTitle = await availableVideos.changeTitle(createFolder.folderID, "Test: new folder title");
        expect(changeTitle.message).toBe("video-title-changed",);  
        expect(changeTitle.availableVideos[createFolder.folderID]["info"]["title"]).toBe("Test: new folder title"); 
    });

    it("Change Title: Folder inside Folder", async () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test_1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test_1");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test_2");
        expect(createFolder2.message).toBe("folder-created");
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test_2");   
        const changeTitle = await availableVideos.changeTitle(createFolder2.folderID, "Test: new folder title", [createFolder1.folderID]);
        expect(changeTitle.message).toBe("video-title-changed",);  
        expect(changeTitle.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("Test: new folder title"); 
    });

    it("Change Title: Invalid ID", async () =>  {  
        const changeTitle = await availableVideos.changeTitle("invalid folderID", "Test: new title");
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: Invalid folder path", async () =>  {  
        const changeTitle = await availableVideos.changeTitle("invalid folderID", "Test: new title", ["invalid folderID2"]);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: Invalid ID inside valid folder path", async () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");   
        const changeTitle = await availableVideos.changeTitle("invalid folderID", "Test: new title", [createFolder.folderID]);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });
   
    it("Change Title: ID undefined, newVideoTitle undefined", async () =>  {  
        const changeTitle = await availableVideos.changeTitle(undefined, undefined);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: ID defined, newVideoTitle undefined", async () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");   
        const changeTitle = await availableVideos.changeTitle(createFolder.folderID, undefined);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: ID undefined, newVideoTitle defined", async () =>  {  
        const changeTitle = await availableVideos.changeTitle(undefined, "title_folder_test");
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: Inside folder - ID undefined, newVideoTitle undefined", async () =>  {  
        const changeTitle = await availableVideos.changeTitle(undefined, "title_folder_test", ["undefined"]);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: Inside folder - ID defined, newVideoTitle undefined", async () =>  {      
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["title"]).toBe("title_folder_test");   
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["title"]).toBe("title_folder_test");        
        const changeTitle = await availableVideos.changeTitle(createFolder2.folderID, undefined, [createFolder1.folderID]);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
    });

    it("Change Title: Inside folder - ID undefined, newVideoTitle defined", async () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");   
        const changeTitle = await availableVideos.changeTitle(undefined, "title_folder_test", [createFolder.folderID]);
        expect(changeTitle.message).toBe("failed-to-change-video-title");   
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

describe("inputSelectedIDOutOfFolderID", () =>  { 
    it("undefined undefined undefined", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, undefined, undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("invalid selectedID undefined undefined", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", undefined, undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("valid selectedID undefined undefined", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy(); 

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder.folderID, undefined, undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined invalid folderID undefined", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, "folderID", undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined valid selectedID undefined", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy(); 

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, createFolder.folderID, undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined undefined empty folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, undefined, []);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined undefined invalid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, undefined, [undefined]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined undefined valid folderIDPath", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy(); 

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, undefined, [createFolder.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("invalid selectedID undefined folderID empty folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", undefined, []);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("invalid selectedID undefined folderID invalid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", undefined, [undefined]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("valid selectedID undefined valid folderIDPath", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy(); 
        const createFolder2 = availableVideos.createFolder(undefined, "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder2.folderID]).toBeTruthy(); 

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder2.folderID, undefined, [createFolder1.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });


    it("undefined selectedID invalid folderID empty folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, "folderID", []);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined selectedID invalid folderID invalid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(undefined, "folderID", [undefined]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("undefined valid folderID valid folderIDPath", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy(); 
        const createFolder2 = availableVideos.createFolder(undefined, "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder2.folderID]).toBeTruthy(); 

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder2.folderID, undefined, [createFolder1.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("invalid selectedID invalid folderID undefined folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", "folderID", undefined);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("invalid selectedID invalid folderID empty folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", "folderID", []);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });
    
    it("invalid selectedID invalid folderID invalid folderIDPath", () =>  { 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID("selectedID", "folderID", [undefined]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("failed-to-inputed-selected-out-of-folder"); 
    });

    it("place video out of first folder to main folder", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy(); 
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });

        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder.folderID);
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder.folderID]["content"][id]).toBeTruthy(); 
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(id, "folder-main", [createFolder.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");      
        expect(inputSelectedIDOutOfFolderID.availableVideos[id]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder.folderID]["content"][id]).toBeFalsy();   
    });

    it("place folder out of first folder to main folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        expect(createFolder1.availableVideos[createFolder1.folderID]["info"]["inside-folder"]).toBe("folder-main");

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["inside-folder"]).toBe(createFolder1.folderID);

        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder2.folderID, "folder-main", [createFolder1.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");    
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder2.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeFalsy();
    });

    it("place video out of second folder to first folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
                
        availableVideos.inputSelectedIDIntoFolderID(id, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]).toBeTruthy();  
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
         
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(id, createFolder1.folderID, [createFolder1.folderID, createFolder2.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");    
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][id]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]).toBeFalsy();
    });

    it("place folder out of second folder to first folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder_test3");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();
        
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder3.folderID, createFolder1.folderID, [createFolder1.folderID, createFolder2.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");  
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder3.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeFalsy();
    }); 

    it("place video out of second folder to main Folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
                
        availableVideos.inputSelectedIDIntoFolderID(id, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]).toBeTruthy();  
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
         
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(id, "folder-main", [createFolder1.folderID, createFolder2.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");    
        expect(inputSelectedIDOutOfFolderID.availableVideos[id]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]).toBeFalsy();
    });

    it("place folder out of second folder to main Folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder_test3");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();
        
        const inputSelectedIDOutOfFolderID = availableVideos.inputSelectedIDOutOfFolderID(createFolder3.folderID, "folder-main", [createFolder1.folderID, createFolder2.folderID]);
        expect(inputSelectedIDOutOfFolderID.message).toBe("successfully-inputed-selected-out-of-folder");  
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder3.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(inputSelectedIDOutOfFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeFalsy();
    }); 

}); 

describe("inputSelectedIDIntoFolderID", () =>  {   
    it("place undefined id inside undefined folder", () =>  { 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(undefined, undefined);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place undefined id inside invalid folder", () =>  { 
        const folderID = uuidv4(); 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(undefined, folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place invalid id inside undefined folder", () =>  { 
        const selectedID = uuidv4(); 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(selectedID, undefined);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });
    
    it("place invalid id inside invalid folder", () =>  { 
        const folderID = uuidv4(); 
        const selectedID = uuidv4(); 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(selectedID, folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place invalid id inside invalid folder", () =>  { 
        const folderID = uuidv4(); 
        const selectedID = uuidv4(); 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(selectedID, folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place invalid id inside folder", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
        const id = uuidv4(); 
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder.folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });


    it("place id inside invalid folder", () =>  { 
        const folderID = uuidv4(); 
        const id = uuidv4(); 
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
        
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place id inside folder inside invalid folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const createFolder2_ID = uuidv4(); 
        const id = uuidv4(); 
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });

        availableVideos.inputSelectedIDIntoFolderID(id, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder2_ID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.message).toBe("failed-to-inputed-selected-into-folder"); 
    });

    it("place video inside folder", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]["info"]["title"]).toBe("title_folder_test");  
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });

        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder.folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder.folderID]["content"][id]).toBeTruthy();
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder.folderID]["content"][id]["info"]["title"]).toBe(id);    
    });

    it("place folder inside folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder(undefined, "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder2.folderID]).toBeTruthy();
        
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(createFolder2.folderID, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["info"]["inside-folder"]).toBe("folder-main"); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy(); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["info"]["inside-folder"]).toBe(createFolder1.folderID);    
    });

    it("place video inside folder inside Folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        
        const id = uuidv4();
        availableVideos.updateAvailableVideoData([id], {
            "info": {
                "title": id,
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
        
        availableVideos.inputSelectedIDIntoFolderID(id, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(id, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]).toBeTruthy();
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][id]["info"]["title"]).toBe(id);    
    });

    it("place folder inside Folder inside Folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        const createFolder3 = availableVideos.createFolder(undefined, "title_folder_test3");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder3.folderID]).toBeTruthy();
        
        availableVideos.inputSelectedIDIntoFolderID(createFolder3.folderID, createFolder1.folderID);
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(createFolder3.folderID, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID.message).toBe("successfully-inputed-selected-into-folder"); 
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();
        expect(inputSelectedIDIntoFolderID.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]["info"]["title"]).toBe("title_folder_test3");    
    });
}); 

describe("moveSelectedIdBeforeTargetIdAtAvailableVideoDetails", () =>  {   
    it("undefined undefined undefined", () =>  {  
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(undefined, undefined, undefined);
        expect(moveSelectedIdBeforeTargetId.message).toBe("undefined && undefined unavailable at availableVideos"); 
    }); 

    it("valid selectedID undefined undefined", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, undefined);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("valid selectedID undefined empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, []);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("valid selectedID undefined empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, [undefined]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("failed-to-moved-selected-before-target"); 
    }); 
    
    it("valid selectedID undefined valid folderIDPath", () =>  {  
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder2.folderID, undefined, [createFolder1.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder2.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID undefined", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, undefined);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, []);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID invalid folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, [undefined]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("failed-to-moved-selected-before-target"); 
    }); 

    it("undefined valid targetID valid folderIDPath", () =>  {  
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(undefined, createFolder2.folderID, [createFolder1.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe(`${createFolder2.folderID} unavailable at availableVideos`); 
    }); 

    it("place folder1 infront folder2", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder1.availableVideos)).indexOf(createFolder1.folderID)).toBe(0); 
        const createFolder2 = availableVideos.createFolder(undefined, "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder2.availableVideos)).indexOf(createFolder2.folderID)).toBe(1);
        
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder1.folderID, createFolder2.folderID);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createFolder1.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(createFolder1.folderID)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(createFolder2.folderID)).toBe(0);  
    }); 

    it("place video infront folder", () =>  { 
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
         
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos)).indexOf(fileName)).toBe(0); 

        const createFolder = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos)).indexOf(createFolder.folderID)).toBe(1); 
        
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(fileName, createFolder.folderID);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(createFolder.folderID)).toBe(0); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(fileName)).toBe(1);  
    }); 

    it("place folder infront video", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos)).indexOf(createFolder.folderID)).toBe(0); 
        
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos)).indexOf(fileName)).toBe(1); 

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder.folderID, fileName);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(createFolder.folderID)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(fileName)).toBe(0);  
    }); 

    it("place video infront video", () =>  { 
        const video_filename_1 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_1], {
            "info": {
                "title": video_filename_1,
                "videoLink": {
                    "src": `/video/${video_filename_1}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_1}/1`,
                    "2": `/thumbnail/${video_filename_1}/2`,
                    "3": `/thumbnail/${video_filename_1}/3`,
                    "4": `/thumbnail/${video_filename_1}/4`,
                    "5": `/thumbnail/${video_filename_1}/5`,
                    "6": `/thumbnail/${video_filename_1}/6`,
                    "7": `/thumbnail/${video_filename_1}/7`,
                    "8": `/thumbnail/${video_filename_1}/8`
                }
            }
        });

        const getAvailableVideos1 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos1[video_filename_1]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos1)).indexOf(video_filename_1)).toBe(0); 
   
        const video_filename_2 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_2], {
            "info": {
                "title": video_filename_2,
                "videoLink": {
                    "src": `/video/${video_filename_2}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_2}/1`,
                    "2": `/thumbnail/${video_filename_2}/2`,
                    "3": `/thumbnail/${video_filename_2}/3`,
                    "4": `/thumbnail/${video_filename_2}/4`,
                    "5": `/thumbnail/${video_filename_2}/5`,
                    "6": `/thumbnail/${video_filename_2}/6`,
                    "7": `/thumbnail/${video_filename_2}/7`,
                    "8": `/thumbnail/${video_filename_2}/8`
                }
            }
        });

        const getAvailableVideos2 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos2[video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos2)).indexOf(video_filename_2)).toBe(1); 

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(video_filename_1, video_filename_2);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[video_filename_1]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(video_filename_1)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos)).indexOf(video_filename_2)).toBe(0);  
    }); 

    it("INSIDE FOLDER: place folder1 infront folder2", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const createFolder1 = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createMainFolder.folderID]["content"][createFolder1.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder1.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder1.folderID)).toBe(0); 
        const createFolder2 = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createMainFolder.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder2.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder2.folderID)).toBe(1);
        
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder1.folderID, createFolder2.folderID, [createMainFolder.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder1.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder1.folderID)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder2.folderID)).toBe(0);  
    }); 

    it("INSIDE FOLDER: place video infront folder", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
         
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(0); 
        
        const createFolder = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(1); 
        
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(fileName, createFolder.folderID, [createMainFolder.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(0); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(1);  
    }); 

    it("INSIDE FOLDER: place folder infront video", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const createFolder = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(createFolder.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(0); 
        
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(1); 
        expect(Object.keys(eval(createFolder.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(0); 
 
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(createFolder.folderID, fileName, [createMainFolder.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(0);  
    }); 

    it("INSIDE FOLDER: place video infront video", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const video_filename_1 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_1], {
            "info": {
                "title": video_filename_1,
                "videoLink": {
                    "src": `/video/${video_filename_1}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_1}/1`,
                    "2": `/thumbnail/${video_filename_1}/2`,
                    "3": `/thumbnail/${video_filename_1}/3`,
                    "4": `/thumbnail/${video_filename_1}/4`,
                    "5": `/thumbnail/${video_filename_1}/5`,
                    "6": `/thumbnail/${video_filename_1}/6`,
                    "7": `/thumbnail/${video_filename_1}/7`,
                    "8": `/thumbnail/${video_filename_1}/8`
                }
            }
        });

        const getAvailableVideos1 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos1[video_filename_1]).toBeTruthy();
        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(video_filename_1, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createMainFolder.folderID]["content"][video_filename_1]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID1.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_1)).toBe(0); 

        const video_filename_2 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_2], {
            "info": {
                "title": video_filename_2,
                "videoLink": {
                    "src": `/video/${video_filename_2}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_2}/1`,
                    "2": `/thumbnail/${video_filename_2}/2`,
                    "3": `/thumbnail/${video_filename_2}/3`,
                    "4": `/thumbnail/${video_filename_2}/4`,
                    "5": `/thumbnail/${video_filename_2}/5`,
                    "6": `/thumbnail/${video_filename_2}/6`,
                    "7": `/thumbnail/${video_filename_2}/7`,
                    "8": `/thumbnail/${video_filename_2}/8`
                }
            }
        });
 
        const getAvailableVideos2 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos2[video_filename_2]).toBeTruthy();
        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(video_filename_2, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createMainFolder.folderID]["content"][video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID2.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_2)).toBe(1); 

        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(video_filename_1, video_filename_2, [createMainFolder.folderID]);
        expect(moveSelectedIdBeforeTargetId.message).toBe("successfully-moved-selected-before-target");
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][video_filename_1]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_1)).toBe(1); 
        expect(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"][video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdBeforeTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_2)).toBe(0);  
    }); 
}); 

describe("moveSelectedIdAfterTargetIdAtAvailableVideoDetails", () =>  {   
    it("undefined undefined undefined", () =>  {  
        const moveSelectedIdBeforeTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(undefined, undefined, undefined);
        expect(moveSelectedIdBeforeTargetId.message).toBe("undefined && undefined unavailable at availableVideos"); 
    }); 

    it("valid selectedID undefined undefined", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, undefined);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("valid selectedID undefined empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, []);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("valid selectedID undefined empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder.folderID, undefined, [undefined]);
        expect(moveSelectedIdAfterTargetId.message).toBe("failed-to-moved-selected-after-target"); 
    }); 

    it("valid selectedID undefined valid folderIDPath", () =>  {  
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder2.folderID, undefined, [createFolder1.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder2.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID undefined", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, undefined);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID empty folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, []);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder.folderID} unavailable at availableVideos`); 
    }); 

    it("undefined valid targetID invalid folderIDPath", () =>  {  
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(undefined, createFolder.folderID, [undefined]);
        expect(moveSelectedIdAfterTargetId.message).toBe("failed-to-moved-selected-after-target"); 
    }); 

    it("undefined valid targetID valid folderIDPath", () =>  {  
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(undefined, createFolder2.folderID, [createFolder1.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe(`${createFolder2.folderID} unavailable at availableVideos`); 
    }); 

    it("place folder1 after folder2", () =>  { 
        const createFolder2 = availableVideos.createFolder(undefined, "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder2.availableVideos)).indexOf(createFolder2.folderID)).toBe(0);
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder1.availableVideos)).indexOf(createFolder1.folderID)).toBe(1); 
        
        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder1.folderID, createFolder2.folderID);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createFolder1.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(createFolder1.folderID)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(createFolder2.folderID)).toBe(1);  
    }); 

    it("place video after folder", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos)).indexOf(createFolder.folderID)).toBe(0); 

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
         
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos)).indexOf(fileName)).toBe(1); 
        
        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(fileName, createFolder.folderID);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(createFolder.folderID)).toBe(1); 
        expect(moveSelectedIdAfterTargetId.availableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(fileName)).toBe(0);  
    }); 

    it("place folder after video", () =>  { 
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos)).indexOf(fileName)).toBe(0); 

        const createFolder = availableVideos.createFolder(undefined, "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos)).indexOf(createFolder.folderID)).toBe(1); 


        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder.folderID, fileName);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(createFolder.folderID)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(fileName)).toBe(1);  
    }); 

    it("place video after video", () =>  { 
        const video_filename_2 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_2], {
            "info": {
                "title": video_filename_2,
                "videoLink": {
                    "src": `/video/${video_filename_2}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_2}/1`,
                    "2": `/thumbnail/${video_filename_2}/2`,
                    "3": `/thumbnail/${video_filename_2}/3`,
                    "4": `/thumbnail/${video_filename_2}/4`,
                    "5": `/thumbnail/${video_filename_2}/5`,
                    "6": `/thumbnail/${video_filename_2}/6`,
                    "7": `/thumbnail/${video_filename_2}/7`,
                    "8": `/thumbnail/${video_filename_2}/8`
                }
            }
        });

        const getAvailableVideos2 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos2[video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos2)).indexOf(video_filename_2)).toBe(0); 

        const video_filename_1 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_1], {
            "info": {
                "title": video_filename_1,
                "videoLink": {
                    "src": `/video/${video_filename_1}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_1}/1`,
                    "2": `/thumbnail/${video_filename_1}/2`,
                    "3": `/thumbnail/${video_filename_1}/3`,
                    "4": `/thumbnail/${video_filename_1}/4`,
                    "5": `/thumbnail/${video_filename_1}/5`,
                    "6": `/thumbnail/${video_filename_1}/6`,
                    "7": `/thumbnail/${video_filename_1}/7`,
                    "8": `/thumbnail/${video_filename_1}/8`
                }
            }
        });

        const getAvailableVideos1 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos1[video_filename_1]).toBeTruthy();
        expect(Object.keys(eval(getAvailableVideos1)).indexOf(video_filename_1)).toBe(1); 

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(video_filename_1, video_filename_2);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[video_filename_1]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(video_filename_1)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos)).indexOf(video_filename_2)).toBe(1);  
    }); 
 
    it("INSIDE FOLDER: place folder1 after folder2", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createMainFolder.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder2.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder2.folderID)).toBe(0);
        const createFolder1 = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createMainFolder.folderID]["content"][createFolder1.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder1.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder1.folderID)).toBe(1); 

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder1.folderID, createFolder2.folderID, [createMainFolder.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder1.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder1.folderID)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder2.folderID)).toBe(1);  
    }); 

    it("INSIDE FOLDER: place video infront folder", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();
            
        const createFolder = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy();
        expect(Object.keys(eval(createFolder.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(0); 

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
         
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(1); 
        
        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(fileName, createFolder.folderID, [createMainFolder.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(1); 
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(0);  
    }); 

    it("INSIDE FOLDER: place folder infront video", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeTruthy();
        const inputSelectedIDIntoFolderID = availableVideos.inputSelectedIDIntoFolderID(fileName, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(0); 
 
        const createFolder = availableVideos.createFolder([createMainFolder.folderID], "title_folder_test1");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(createFolder.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(1); 
        
        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(createFolder.folderID, fileName, [createMainFolder.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][createFolder.folderID]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(createFolder.folderID)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][fileName]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(fileName)).toBe(1);  
    }); 

    it("INSIDE FOLDER: place video infront video", () =>  { 
        const createMainFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createMainFolder.message).toBe("folder-created"); 
        expect(createMainFolder.availableVideos[createMainFolder.folderID]).toBeTruthy();

        const video_filename_2 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_2], {
            "info": {
                "title": video_filename_2,
                "videoLink": {
                    "src": `/video/${video_filename_2}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_2}/1`,
                    "2": `/thumbnail/${video_filename_2}/2`,
                    "3": `/thumbnail/${video_filename_2}/3`,
                    "4": `/thumbnail/${video_filename_2}/4`,
                    "5": `/thumbnail/${video_filename_2}/5`,
                    "6": `/thumbnail/${video_filename_2}/6`,
                    "7": `/thumbnail/${video_filename_2}/7`,
                    "8": `/thumbnail/${video_filename_2}/8`
                }
            }
        });
 
        const getAvailableVideos2 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos2[video_filename_2]).toBeTruthy();
        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(video_filename_2, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createMainFolder.folderID]["content"][video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID2.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_2)).toBe(0); 

        const video_filename_1 = uuidv4();
        availableVideos.updateAvailableVideoData([video_filename_1], {
            "info": {
                "title": video_filename_1,
                "videoLink": {
                    "src": `/video/${video_filename_1}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${video_filename_1}/1`,
                    "2": `/thumbnail/${video_filename_1}/2`,
                    "3": `/thumbnail/${video_filename_1}/3`,
                    "4": `/thumbnail/${video_filename_1}/4`,
                    "5": `/thumbnail/${video_filename_1}/5`,
                    "6": `/thumbnail/${video_filename_1}/6`,
                    "7": `/thumbnail/${video_filename_1}/7`,
                    "8": `/thumbnail/${video_filename_1}/8`
                }
            }
        });

        const getAvailableVideos1 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos1[video_filename_1]).toBeTruthy();
        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(video_filename_1, createMainFolder.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createMainFolder.folderID]["content"][video_filename_1]).toBeTruthy();
        expect(Object.keys(eval(inputSelectedIDIntoFolderID1.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_1)).toBe(1); 

        const moveSelectedIdAfterTargetId = availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(video_filename_1, video_filename_2, [createMainFolder.folderID]);
        expect(moveSelectedIdAfterTargetId.message).toBe("successfully-moved-selected-after-target");
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][video_filename_1]).toBeTruthy(); 
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_1)).toBe(0); 
        expect(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"][video_filename_2]).toBeTruthy();
        expect(Object.keys(eval(moveSelectedIdAfterTargetId.availableVideos[createMainFolder.folderID]["content"])).indexOf(video_filename_2)).toBe(1);  
    }); 
}); 

describe("deleteSpecifiedAvailableVideosData", () =>  {    
    it("undefined fileName undefined path_array", () =>  { 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(undefined, undefined);
        expect(deleteSpecifiedIDWithPath).toBe("invalid fileName"); 
    });  

    it("undefined fileName empty path_array", () =>  { 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(undefined, []);
        expect(deleteSpecifiedIDWithPath).toBe("invalid fileName"); 
    }); 

    it("undefined fileName invalid path_array", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(undefined, [fileName]);
        expect(deleteSpecifiedIDWithPath).toBe("invalid fileName"); 
    }); 

    it("Invalid fileName undefined path_array", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName, undefined);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    });  

    it("Invalid fileName empty path_array", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName, []);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("Invalid fileName invalid path_array", () =>  { 
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName, [fileName]);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("Delete folder (main folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder1.folderID);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder1.folderID} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]).toBeFalsy();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete Video (main folder)", () =>  { 
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName);
        expect(deleteSpecifiedIDWithPath).toBe(`${fileName} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[fileName]).toBeFalsy();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete folder (inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder2.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder2.folderID} deleted`);

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({}); 
    }); 

    it("Delete Video (inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${fileName} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][fileName]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({}); 
    }); 

    it("Delete folder (inside folder inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder4");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content", createFolder2.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder3.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder3.folderID} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"]).toMatchObject({}); 
    }); 

    it("Delete video (inside folder inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();
        
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content", createFolder2.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(fileName, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${fileName} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"]).toMatchObject({}); 
    }); 

    it("Delete folder containing folder data (main folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder4");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();
 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder1.folderID);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder1.folderID} deleted`);
        
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]).toBeFalsy();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete folder containing video data (main folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeTruthy();

        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder1.folderID);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder1.folderID} deleted`); 
                
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]).toBeFalsy();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete folder containing folder data (inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder4");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder2.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder2.folderID} deleted`); 
          
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({}); 
    }); 

    it("Delete folder containing video data (inside folder)", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosData(createFolder2.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder2.folderID} deleted`); 
                        
        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeFalsy();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({}); 
    }); 

}); 

describe("deleteSpecifiedAvailableVideosDataWithProvidedPath", () =>  {   
    it("No Input", () =>  {  
       const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath();
       expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("invalid fileName, undefined path_array", () =>  {  
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, undefined);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("invalid fileName, empty path_array", () =>  {  
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, []);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("invalid fileName, Invalid path_array", () =>  {  
        const fileName = uuidv4();
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, [undefined]);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("valid fileName, Invalid path_array", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(createFolder1.folderID, [undefined]);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    }); 

    it("invalid fileName, valid path_array", () =>  {  
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const fileName = uuidv4();
        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 

        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe("invalid array path"); 
    });

    it("Delete folder Data", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(createFolder2.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder2.folderID} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"]).toMatchObject({});
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeFalsy();
    }); 

    it("Delete Video Data", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${fileName} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][fileName]).toBeFalsy();
        expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete folder Data inside folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();

        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const createFolder3 = availableVideos.createFolder([createFolder1.folderID, createFolder2.folderID], "title_folder4");
        expect(createFolder3.message).toBe("folder-created"); 
        expect(createFolder3.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content", createFolder2.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(createFolder3.folderID, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${createFolder3.folderID} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"]).toMatchObject({});
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][createFolder3.folderID]).toBeFalsy();
    }); 

    it("Delete Video Data inside folder", () =>  { 
        const createFolder1 = availableVideos.createFolder(undefined, "title_folder1");
        expect(createFolder1.message).toBe("folder-created"); 
        expect(createFolder1.availableVideos[createFolder1.folderID]).toBeTruthy();
        
        const createFolder2 = availableVideos.createFolder([createFolder1.folderID], "title_folder2");
        expect(createFolder2.message).toBe("folder-created"); 
        expect(createFolder2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]).toBeTruthy();

        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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

        const inputSelectedIDIntoFolderID1 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder1.folderID);
        expect(inputSelectedIDIntoFolderID1.availableVideos[createFolder1.folderID]["content"][fileName]).toBeTruthy();

        const inputSelectedIDIntoFolderID2 = availableVideos.inputSelectedIDIntoFolderID(fileName, createFolder2.folderID, [createFolder1.folderID]);
        expect(inputSelectedIDIntoFolderID2.availableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeTruthy();

        const fileName_path_array = availableVideos.availableVideosfolderPath_Array([createFolder1.folderID, createFolder2.folderID]);
        expect(fileName_path_array).toEqual([createFolder1.folderID, "content", createFolder2.folderID, "content"]); 
        const deleteSpecifiedIDWithPath = availableVideos.deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, fileName_path_array);
        expect(deleteSpecifiedIDWithPath).toBe(`${fileName} deleted`); 

        const getAvailableVideos = availableVideos.getAvailableVideos();
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"]).toMatchObject({}); 
        expect(getAvailableVideos[createFolder1.folderID]["content"][createFolder2.folderID]["content"][fileName]).toBeFalsy();
    }); 
}); 

describe("deleteSpecifiedAvailableVideosDataWithoutProvidedPath", () =>  {   
    it("No Input", () =>  {  
       const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath();
       expect(deleteSpecifiedID).toBe("invalid array path"); 
    }); 

    it("undefined", () =>  {  
        const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath(undefined);
        expect(deleteSpecifiedID).toBe("invalid array path"); 
    }); 

    it("Invalid ID", () =>  {  
        const fileName = uuidv4();
        const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
        expect(deleteSpecifiedID).toBe("invalid array path"); 
    });

    it("Empty Array", () =>  {  
        const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath([]);
        expect(deleteSpecifiedID).toBe("invalid array path"); 
    });

    it("Invalid Array", () =>  {  
        const fileName = uuidv4();
        const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath([fileName]);
        expect(deleteSpecifiedID).toBe("invalid array path"); 
    });

    it("Delete folder Data", () =>  { 
        const createFolder = availableVideos.createFolder(undefined, "title_folder");
        expect(createFolder.message).toBe("folder-created"); 
        expect(createFolder.availableVideos[createFolder.folderID]).toBeTruthy();

       const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath(createFolder.folderID);
       expect(deleteSpecifiedID).toBe(`${createFolder.folderID} deleted`); 

       const getAvailableVideos = availableVideos.getAvailableVideos();
       expect(getAvailableVideos[createFolder.folderID]).toBeFalsy();
       expect(getAvailableVideos).toMatchObject({}); 
    }); 

    it("Delete Video Data", () =>  { 
        const fileName = uuidv4();
        availableVideos.updateAvailableVideoData([fileName], {
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
         
        const getAvailableVideos_1 = availableVideos.getAvailableVideos();
        expect(getAvailableVideos_1[fileName]).toBeTruthy(); 

       const deleteSpecifiedID = availableVideos.deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
       expect(deleteSpecifiedID).toBe(`${fileName} deleted`); 

       const getAvailableVideos_2 = availableVideos.getAvailableVideos();
       expect(getAvailableVideos_2[fileName]).toBeFalsy();
       expect(getAvailableVideos_2).toMatchObject({}); 
    }); 
}); 
