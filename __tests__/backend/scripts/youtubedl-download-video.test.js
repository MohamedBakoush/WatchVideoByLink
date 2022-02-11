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
    it("No Input", () =>  {
        const getInfo = youtubedl.youtubedl_get_Info();
        expect(getInfo).toBe("info not object");  
    });

    it("Info Object", () =>  {
        const info = {};
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("info.formats undefined");  
    });

    it("Info.Formats Array", () =>  {
        const info = {
            formats : true
        };
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("info.formats not array");  
    });

    it("info.formats empty array", () =>  {
        const info = {
            formats : []
        };
        const url = "http://localhost:8080/video";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("info.formats empty");  
    });

    it("URL not string", () =>  {
        const info = {
            formats : [{}]
        };
        const getInfo = youtubedl.youtubedl_get_Info(info);
        expect(getInfo).toBe("url not string");  
    });

    it("Invalid formats: empty objects", () =>  {
        const info = {
            formats : [
                {},
                {}
            ]
        };
        const url = "http://localhost:8080/video";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Invalid formats: strings", () =>  {
        const info = {
            formats : [
                "apple",
                "bannana"
            ]
        };
        const url = "http://localhost:8080/video";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Invalid formats: protocol undefined, valid url", () =>  {
        const info = {
            formats : [
                {
                    url : "http://localhost:8080/video"
                }
            ]
        };
        const url = "http://localhost:8080/video2";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Invalid formats: valid protocol, url undefined", () =>  {
        const info = {
            formats : [
                {
                    protocol : "m3u8" 
                }
            ]
        };
        const url = "http://localhost:8080/video2";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Protocol: Not Supported", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                }
            ]
        };
        const url = "http://localhost:8080/video2";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Protocol: https", () =>  {
        const info = {
            formats : [
                {
                    protocol : "https" ,
                    url : "http://localhost:8080/video1.mp4" 
                }
            ]
        };
        const url = "http://localhost:8080/video2.mp4";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[0].url,
            video_file_format: "video/mp4"
          });  
    });

    it("Protocol: http", () =>  {
        const info = {
            formats : [
                {
                    protocol : "http" ,
                    url : "http://localhost:8080/video1.mp4" 
                }
            ]
        };
        const url = "http://localhost:8080/video2.mp4";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[0].url,
            video_file_format: "video/mp4"
          });  
    });

    it("Protocol: m3u8", () =>  {
        const info = {
            formats : [
                {
                    protocol : "m3u8" ,
                    url : "http://localhost:8080/video1.m3u8" 
                }
            ]
        };
        const url = "http://localhost:8080/video2.m3u8";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[0].url,
            video_file_format: "application/x-mpegURL"
          });  
    });

    it("Protocol: http_dash_segments", () =>  {
        const info = {
            formats : [
                {
                    protocol : "http_dash_segments" ,
                    url : "http://localhost:8080/video1.mpd" 
                }
            ]
        };
        const url = "http://localhost:8080/video2.mpd";
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[0].url,
            video_file_format: "application/dash+xml"
          });  
    });

    it("Muiltable formats options: Protocol Not Supported", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video2" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video3" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video4" 
                }
            ]
        };
        const url = "http://localhost:8080/video" ;
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toBe("failed-get-video-url-from-provided-url");  
    });

    it("Muiltable formats options: Protocol: https", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video2" 
                },
                {
                    protocol : "https" ,
                    url : "http://localhost:8080/video3.mp4" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video4" 
                }
            ]
        };
        const url = "http://localhost:8080/video.mp4" ;
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[2].url,
            video_file_format: "video/mp4"
          });  
    });

    it("Muiltable formats options: Protocol: http", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video2" 
                },
                {
                    protocol : "http" ,
                    url : "http://localhost:8080/video3.mp4" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video4" 
                }
            ]
        };
        const url = "http://localhost:8080/video.mp4" ;
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[2].url,
            video_file_format: "video/mp4"
          });  
    });

    it("Muiltable formats options: Protocol: m3u8", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video2" 
                },
                {
                    protocol : "m3u8" ,
                    url : "http://localhost:8080/video3.m3u8" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video4" 
                }
            ]
        };
        const url = "http://localhost:8080/video.m3u8" ;
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[2].url,
            video_file_format: "application/x-mpegURL"
          });  
    });

    it("Muiltable formats options: Protocol: http_dash_segments", () =>  {
        const info = {
            formats : [
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video1" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video2" 
                },
                {
                    protocol : "http_dash_segments" ,
                    url : "http://localhost:8080/video3.mpd" 
                },
                {
                    protocol : "Invalid" ,
                    url : "http://localhost:8080/video4" 
                }
            ]
        };
        const url = "http://localhost:8080/video.mpd" ;
        const getInfo = youtubedl.youtubedl_get_Info(info, url);
        expect(getInfo).toMatchObject({
            input_url_link: url,
            video_url: info.formats[2].url,
            video_file_format: "application/dash+xml"
          });  
    });
}); 