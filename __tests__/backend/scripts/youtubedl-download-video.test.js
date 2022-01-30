const youtubedl = require("../../../backend/scripts/youtubedl-download-video");
const ffmpegDownloadResponse = require("../../../backend/scripts/ffmpeg-download-response");

beforeAll(() => {    
    ffmpegDownloadResponse.resetDownloadResponse();
});

afterEach(() => {    
    ffmpegDownloadResponse.resetDownloadResponse();
}); 

describe("getVideoLinkFromUrl", () =>  {  
    it("No Input", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl();
        expect(getVideoLinkFromUrl).toBe("failed-get-video-url-from-provided-url");  
    });

    it("URL: Number", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl(123);
        expect(getVideoLinkFromUrl).toBe("failed-get-video-url-from-provided-url"); 
    });

    it("URL: Array", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl([]);
        expect(getVideoLinkFromUrl).toBe("failed-get-video-url-from-provided-url"); 
    });

    it("URL: Object", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl({});
        expect(getVideoLinkFromUrl).toBe("failed-get-video-url-from-provided-url"); 
    });

    it("URL: Bool", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl(true);
        expect(getVideoLinkFromUrl).toBe("failed-get-video-url-from-provided-url"); 
    });

    it("URL: Invalid URL", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl("URL");
        expect(getVideoLinkFromUrl.message).toBe("initializing");  
        const getDownloadResponse = ffmpegDownloadResponse.getDownloadResponse([getVideoLinkFromUrl.fileName]);
        expect(getDownloadResponse.message).toBe("initializing"); 
    });
}); 