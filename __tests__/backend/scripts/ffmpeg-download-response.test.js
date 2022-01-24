const ffmpegDownloadResponse = require("../../../backend/scripts/ffmpeg-download-response");
const { v4: uuidv4 } = require("uuid");

beforeAll(() => {    
    ffmpegDownloadResponse.resetDownloadResponse();
});

afterEach(() => {    
    ffmpegDownloadResponse.resetDownloadResponse();
}); 

describe("getDownloadResponse", () =>  {   
    it("No input - path array", () =>  {
        const getVideoData = ffmpegDownloadResponse.getDownloadResponse();
        expect(getVideoData).toMatchObject({}); 
    }); 

    it("Empty path array", () =>  {
        const getVideoData = ffmpegDownloadResponse.getDownloadResponse([]);
        expect(getVideoData).toBe(undefined); 
    }); 

    it("Invalid path array", () =>  {
        const getVideoData = ffmpegDownloadResponse.getDownloadResponse([undefined]);
        expect(getVideoData).toBe(undefined); 
    }); 

    it("Get Specified Video Data", () =>  { 
        const fileName = uuidv4();
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse([fileName], {
            "fileName": fileName,
            "message": "waiting"
        });
        expect(updateDownloadResponse).toBe("updateDownloadResponse");  
        const get_data = ffmpegDownloadResponse.getDownloadResponse([fileName]);
        expect(get_data).toMatchObject({
            "fileName": fileName,
            "message": "waiting"
        });   
    });
}); 

describe("updateVideoData", () =>  {  
    it("No Input", () =>  { 
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse();
        expect(updateDownloadResponse).toBe("invalid path_array");  
    }); 

    it("undefined path_array", () =>  {
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse(undefined);
        expect(updateDownloadResponse).toBe("invalid path_array");  
    }); 

    it("undefined path_array undefined data", () =>  {
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse(undefined, undefined);
        expect(updateDownloadResponse).toBe("invalid path_array");  
    }); 

    it("invalid path_array undefined data", () =>  {
        const fileName = uuidv4();
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse(fileName, undefined);
        expect(updateDownloadResponse).toBe("invalid path_array");  
    }); 

    it("invalid path_array valid data", () =>  {
        const fileName = uuidv4();
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse(fileName, {});
        expect(updateDownloadResponse).toBe("invalid path_array");  
    }); 

    it("empty path_array invalid data", () =>  {
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse([], undefined);
        expect(updateDownloadResponse).toBe("invalid path_array");  
    });

    it("valid path_array invalid data", () =>  {
        const fileName = uuidv4();
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse([fileName], undefined);
        expect(updateDownloadResponse).toBe("invalid data");  
    });

    it("Valid", () =>  { 
        const fileName = uuidv4();
        const updateDownloadResponse = ffmpegDownloadResponse.updateDownloadResponse([fileName], {
            "fileName": fileName,
            "message": "waiting"
        });
        expect(updateDownloadResponse).toBe("updateDownloadResponse");  
        const getDownloadResponse = ffmpegDownloadResponse.getDownloadResponse([fileName]);
        expect(getDownloadResponse).toMatchObject({
            "fileName": fileName,
            "message": "waiting"
        });   
    });
}); 
