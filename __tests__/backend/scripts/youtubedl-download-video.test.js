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
        expect(getVideoLinkFromUrl).toBe("url not string");  
    });

    it("URL: Number", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl(123);
        expect(getVideoLinkFromUrl).toBe("url not string"); 
    });

    it("URL: Array", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl([]);
        expect(getVideoLinkFromUrl).toBe("url not string"); 
    });

    it("URL: Object", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl({});
        expect(getVideoLinkFromUrl).toBe("url not string"); 
    });

    it("URL: Bool", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl(true);
        expect(getVideoLinkFromUrl).toBe("url not string"); 
    });

    it("URL: Invalid URL", async () =>  {
        const getVideoLinkFromUrl = await youtubedl.getVideoLinkFromUrl("URL");
        expect(getVideoLinkFromUrl.message).toBe("initializing");  
        const getDownloadResponse = ffmpegDownloadResponse.getDownloadResponse([getVideoLinkFromUrl.fileName]);
        expect(getDownloadResponse.message).toBe("initializing"); 
    });
}); 

describe("youtubedl_get_Info", () =>  {  
    it("No Input", async () =>  {
        const getInfo = youtubedl.youtubedl_get_Info();
        expect(getInfo).toBe("info not object");  
    });

    it("Info Object", async () =>  {
        const info = {};
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("info.protocol not string");  
    });

    it("Info.Protocol String", async () =>  {
        const info = {
            protocol : "https" 
        };
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("info.url not string");  
    });

    it("Info.url String", async () =>  {
        const info = {
            protocol : "https" ,
            url : "http://localhost:8080/video.mp4" 
        };
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("url not string");  
    });
    
    it("Protocol: Not Supported", async () =>  {
        const info = {
            protocol : "Invalid" ,
            url : "http://localhost:8080/video1" 
        };
        const url = "http://localhost:8080/video2";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Protocol: https", async () =>  {
        const info = {
            protocol : "https" ,
            url : "http://localhost:8080/video1.mp4" 
        };
        const url = "http://localhost:8080/video2.mp4";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.url,
            video_file_format: "video/mp4"
          });  
    });

    it("Protocol: http", async () =>  {
        const info = {
            protocol : "http" ,
            url : "http://localhost:8080/video1.mp4" 
        };
        const url = "http://localhost:8080/video2.mp4";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.url,
            video_file_format: "video/mp4"
          });  
    });

    it("Protocol: m3u8", async () =>  {
        const info = {
            protocol : "m3u8" ,
            url : "http://localhost:8080/video1.m3u8" 
        };
        const url = "http://localhost:8080/video2.m3u8";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.url,
            video_file_format: "application/x-mpegURL"
          });  
    });

    it("Protocol: http_dash_segments", async () =>  {
        const info = {
            protocol : "http_dash_segments" ,
            url : "http://localhost:8080/video1.mpd" 
        };
        const url = "http://localhost:8080/video2.mpd";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.url,
            video_file_format: "application/dash+xml"
          });  
    });
}); 