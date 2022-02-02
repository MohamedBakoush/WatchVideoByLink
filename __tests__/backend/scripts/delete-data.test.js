const deleteData = require("../../../backend/scripts/delete-data");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const availableVideos = require("../../../backend/scripts/available-videos");
const availableVideos_json_path = "__tests__/data/available-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");
const FileSystem = require("fs");

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
    availableVideos.update_available_videos_path(availableVideos_json_path); 
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    dataVideos.resetVideoData();
    availableVideos.resetAvailableVideos();
    currentDownloadVideos.resetCurrentDownloadVideos();
}); 

describe("deleteSpecifiedVideo", () =>  {    
    it("No Input", () =>  {
        const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo();
        expect(deleteSpecifiedVideo).toBe("fileName not string");
    });        

    it("Invalid fileName", () =>  {
        const fileName = uuidv4();
        const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo(fileName);
        expect(deleteSpecifiedVideo).toBe(`folder-${fileName}-dosent-exit`);
    });     

    it("Valid fileName", () =>  {
        const fileName = uuidv4();
        const filepath = "media/video/";
        FileSystem.mkdirSync(`${filepath}${fileName}/`);
        FileSystem.writeFile(`${filepath}${fileName}/video.mp4`, "data", (err) => {
            if (err) throw err;  
            FileSystem.writeFile(`${filepath}${fileName}/thumbnail_1.jpg`, "data", (err) => {
                if (err) throw err;  
                FileSystem.writeFile(`${filepath}${fileName}/thumbnail_2.jpg`, "data", (err) => {
                    if (err) throw err;  
                    FileSystem.writeFile(`${filepath}${fileName}/thumbnail_3.jpg`, "data", (err) => {
                        if (err) throw err;  
                        FileSystem.writeFile(`${filepath}${fileName}/thumbnail_4.jpg`, "data", (err) => {
                            if (err) throw err;  
                            const deleteSpecifiedVideo = deleteData.deleteSpecifiedVideo(fileName);
                            expect(deleteSpecifiedVideo).toBe(`deleting-video-${fileName}-permanently`);
                        });
                    });
                });
            });
        });
    });     
});

describe("delete_video_with_provided_path", () =>  {    
    it("No Input", () =>  {
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path();
        expect(delete_video_with_provided_path).toBe("videofile no string");
    });  

    it("InValid videofile", () =>  {
        const videofile = uuidv4();
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(videofile);
        expect(delete_video_with_provided_path).toBe("fileName no string");
    });   

    it("Invalid videofile, Valid fileName", () =>  {
        const videofile = uuidv4();
        const fileName = uuidv4();
        const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(videofile, fileName);
        expect(delete_video_with_provided_path).toBe("invalid videofile");
    });      

    it("Valid videofile, Valid fileName", () =>  { 
        const fileName = uuidv4(); 
        const filepath = "media/video/";
        FileSystem.writeFile(`${filepath}/${fileName}.mp4`, "data", (err) => {
            if (err) throw err;  
            const delete_video_with_provided_path = deleteData.delete_video_with_provided_path(`${filepath}/${fileName}.mp4`, fileName);
            expect(delete_video_with_provided_path).toBe("delete video");
        });
    });           
});

describe("check_if_file_exits", () =>  {    
    it("No Input", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits();
        expect(check_if_file_exits).toBe("filePath no string");
    });   

    it("Invalid filePath", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits("test");
        expect(check_if_file_exits).toBe(false);
    });   

    it("Valid filePath", () =>  {
        const check_if_file_exits = deleteData.check_if_file_exits("__tests__/backend/scripts/delete-data.test.js");
        expect(check_if_file_exits).toBe(true);
    });   
});

describe("read_dir", () =>  {    
    it("No Input", () =>  {
        const dir = deleteData.read_dir();
        expect(dir).toBe("filePath no string");
    });  

    it("Invalid filePath", () =>  {
        const dir = deleteData.read_dir("invalid_path");
        expect(dir).toBe("invalid filepath");
    });  

    it("Valid filePath", () =>  {
        const dir = deleteData.read_dir("__tests__/backend/scripts");
        expect(dir).toBe("valid filepath");
    }); 
    
    it("Valid filePath, callback", () =>  {
        let i = 0;
        expect(i).toBe(0);
        const dir = deleteData.read_dir("__tests__/backend/scripts", () => {
            i = i + 1;
            expect(i).toBe(1);
        });
        expect(dir).toBe("valid filepath");
    });   
});