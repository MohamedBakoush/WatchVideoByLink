const ffmpegPath = require("../../../backend/scripts/ffmpeg-path");
const ffmpeg_installer = require("@ffmpeg-installer/ffmpeg");
const ffprobe_installer = require("@ffprobe-installer/ffprobe");

afterEach(() => {    
    ffmpegPath.update_ffprobe_path(ffprobe_installer.path);
    ffmpegPath.update_ffmpeg_path(ffmpeg_installer.path);
}); 

describe("get_ffprobe_path", () =>  {  
    it("ffmpeg_installer.path", () =>  {
        const updated = ffmpegPath.update_ffprobe_path(ffmpeg_installer.path);
        expect(updated).toBe(ffmpeg_installer.path);  
        const getFFprobePath = ffmpegPath.get_ffprobe_path();
        expect(getFFprobePath).toBe(ffmpeg_installer.path); 
    }); 

    it("ffprobe_installer.path", () =>  {
        const getFFprobePath = ffmpegPath.get_ffprobe_path();
        expect(getFFprobePath).toBe(ffprobe_installer.path);  
    }); 
}); 

describe("update_ffprobe_path", () =>  {  
    it("Invalid: undefind", () =>  {
        const updated = ffmpegPath.update_ffprobe_path(undefined);
        expect(updated).toBe(undefined);  
    }); 

    it("Invalid: Empty Array", () =>  {
        const updated_empty_array = ffmpegPath.update_ffprobe_path([]);
        expect(updated_empty_array).toBe(undefined);
    }); 
    
    it("Invalid: Array", () =>  {
        const updated_array = ffmpegPath.update_ffprobe_path([undefined]);
        expect(updated_array).toBe(undefined);  
    }); 

    it("Invalid: Numbers", () =>  {
        const updated_number = ffmpegPath.update_ffprobe_path(123);
        expect(updated_number).toBe(undefined);  
    }); 

    it("Invalid: Object", () =>  {
        const updated_object = ffmpegPath.update_ffprobe_path({});
        expect(updated_object).toBe(undefined);  
    }); 

    it("Invalid: Path", () =>  {
        const updated = ffmpegPath.update_ffprobe_path("test_path");
        expect(updated).toBe(undefined);  
    }); 

    it("Valid: Path", () =>  {
        const updated = ffmpegPath.update_ffprobe_path(ffprobe_installer.path);
        expect(updated).toBe(ffprobe_installer.path);  
    }); 
}); 

describe("get_ffmpeg_path", () =>  {  
    it("ffprobe_installer.path", () =>  {
        const updated = ffmpegPath.update_ffmpeg_path(ffprobe_installer.path);
        expect(updated).toBe(ffprobe_installer.path);  
        const getFFmpegPath = ffmpegPath.get_ffmpeg_path();
        expect(getFFmpegPath).toBe(ffprobe_installer.path); 
    }); 

    it("ffmpeg_installer.path", () =>  {
        const getFFmpegPath = ffmpegPath.get_ffmpeg_path();
        expect(getFFmpegPath).toBe(ffmpeg_installer.path);  
    }); 
}); 

describe("update_ffmpeg_path", () =>  {  
    it("Invalid: undefind", () =>  {
        const updated = ffmpegPath.update_ffmpeg_path(undefined);
        expect(updated).toBe(undefined);  
    }); 

    it("Invalid: Empty Array", () =>  {
        const updated_empty_array = ffmpegPath.update_ffmpeg_path([]);
        expect(updated_empty_array).toBe(undefined);
    }); 
    
    it("Invalid: Array", () =>  {
        const updated_array = ffmpegPath.update_ffmpeg_path([undefined]);
        expect(updated_array).toBe(undefined);  
    }); 

    it("Invalid: Numbers", () =>  {
        const updated_number = ffmpegPath.update_ffmpeg_path(123);
        expect(updated_number).toBe(undefined);  
    }); 

    it("Invalid: Object", () =>  {
        const updated_object = ffmpegPath.update_ffmpeg_path({});
        expect(updated_object).toBe(undefined);  
    }); 

    it("Invalid: Path", () =>  {
        const updated = ffmpegPath.update_ffmpeg_path("test_path");
        expect(updated).toBe(undefined);  
    }); 

    it("Valid: Path", () =>  {
        const updated = ffmpegPath.update_ffmpeg_path(ffmpeg_installer.path);
        expect(updated).toBe(ffmpeg_installer.path);  
    }); 
}); 