const ffmpegUnfinishedVideos = require("../../../backend/scripts/ffmpeg-unfinished-videos");
const ffmpegPath = require("../../../backend/scripts/ffmpeg-path");
const ffmpeg_installer = require("@ffmpeg-installer/ffmpeg");
const ffprobe_installer = require("@ffprobe-installer/ffprobe");

const deleteData = require("../../../backend/scripts/delete-data");
const dataVideos = require("../../../backend/scripts/data-videos");
const dataVideos_json_path = "__tests__/data/data-videos.test.json";
const currentDownloadVideos = require("../../../backend/scripts/current-download-videos");
const currentDownloadVideos_json_path = "__tests__/data/current-download-videos.test.json";
const { v4: uuidv4 } = require("uuid");
const FileSystem = require("fs");

const ffprobe_path = ffprobe_installer.path;
const ffmpeg_path = ffmpeg_installer.path;
const untrunc_path = "__tests__/backend/scripts/ffmpeg-unfinished-videos.test.js";
const working_video_path = "./media/working-video/video.mp4";

beforeAll(() => {    
    dataVideos.update_data_videos_path(dataVideos_json_path); 
    dataVideos.resetVideoData();
    currentDownloadVideos.update_current_download_videos_path(currentDownloadVideos_json_path); 
    currentDownloadVideos.resetCurrentDownloadVideos();
});

afterEach(() => {    
    dataVideos.resetVideoData();
    currentDownloadVideos.resetCurrentDownloadVideos();
    ffmpegPath.update_ffprobe_path(ffprobe_path);
    ffmpegPath.update_ffmpeg_path(ffmpeg_path);
    ffmpegPath.update_untrunc_path(untrunc_path);
    ffmpegPath.update_working_video_path(working_video_path);
}); 

describe("cheackForAvailabeUnFinishedVideoDownloads", () =>  {    
    it("current downloads empty", () =>  {  
        const check = ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        expect(check).toBe("current-downloads-empty"); 
    }); 
    
    it("valid filename, invalid data", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {});
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([filename]);
        expect(getCurrentDownloads).toBe(undefined); 
    }); 

    it("valid filename, video starting stream download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "starting stream download"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
    }); 

    it("valid filename, video starting full video download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "starting full video download"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
    }); 

    it("valid filename, video starting trim video download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "starting trim video download"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
    }); 

    it("valid filename, video starting uploaded video download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "starting uploaded video download"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
    });

    it("valid filename, video 0.00%", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "0.00%"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
    });

    it("valid filename, video untrunc unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "20.00%"
            }
        });
        ffmpegPath.untrunc_path_invalid_path();
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("untrunc unavailable");  
    });

    it("valid filename, video working video for untrunc is unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "20.00%"
            }
        });
        ffmpegPath.working_video_path_invalid_path();
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("working video for untrunc is unavailable");  
    });

    it("valid filename, video unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "20.00%"
            }
        });
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("unfinished download");  
    });
    
    it("thumbnail false compression false: thumbanil ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable");  
    });
    
    it("thumbnail false compression false: video completed, thumbanil ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable");  
    });
    
    it("thumbnail false compression false: video completed, thumbanil ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable");  
    });
    
    it("thumbnail false compression false: video completed, thumbanil unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download");  
    });
  
    it("thumbnail false compression true: compression unfinnised, thumbanil ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg and ffprobe unavailable");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable");  
    });
  
    it("thumbnail false compression true: compression completed, thumbanil ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable");  
    });

    it("thumbnail false compression true: compression unfinnised, thumbanil ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg unavailable");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable");  
    });

    it("thumbnail false compression true: compression completed, thumbanil ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable");  
    });
    
    it("thumbnail false compression true: compression unfinnised, thumbanil ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffprobe unavailable");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable");  
    });

    it("thumbnail false compression true: compression completed, thumbanil ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable");  
    });

    it("thumbnail false compression true: compression unfinnised, thumbanil unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("unfinished download");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download");  
    });

    it("thumbnail false compression true: compression completed, thumbanil unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download");  
    });

    it("thumbnail true compression false: thumbnail ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable");  
    });

    it("thumbnail true compression false: thumbnail ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"  
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable");  
    });
    
    it("thumbnail true compression false: thumbnail ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable");  
    });


    it("thumbnail true compression false: thumbnail unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"  
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download");  
    });

    it("thumbnail true compression false: thumbnail completed", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "completed"  
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe(undefined);  
    });

    it("thumbnail true compression true: thumbnail compression ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "20%"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg and ffprobe unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable"); 
    });

    it("thumbnail true compression true: thumbnail completed, compression ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "completed"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg and ffprobe unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("completed"); 
    });

    it("thumbnail true compression true: compression completed, thumbnail ffmpeg and ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"  
            },
            "thumbnail": {
                "download-status": "20%"   
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg and ffprobe unavailable"); 
    });

    it("thumbnail true compression true: thumbnail compression ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "20%"  
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable"); 
    });

    it("thumbnail true compression true: thumbnail completed, compression ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "completed"  
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffmpeg unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("completed"); 
    });

    it("thumbnail true compression true: compression completed, thumbnail ffmpeg unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"  
            },
            "thumbnail": {
                "download-status": "20%"   
            }
        });

        ffmpegPath.ffmpeg_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffmpeg unavailable"); 
    });

    it("thumbnail true compression true: thumbnail compression ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "20%"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffprobe unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable"); 
    });

    it("thumbnail true compression true: thumbnail completed, compression ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "completed"  
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("ffprobe unavailable"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("completed"); 
    });

    it("thumbnail true compression true: compression completed, thumbnail ffprobe unavailable", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"  
            },
            "thumbnail": {
                "download-status": "20%"   
            }
        });

        ffmpegPath.ffprobe_path_invalid_path();

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("ffprobe unavailable"); 
    });

    
    it("thumbnail true compression true: thumbnail compression unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "20%"  
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("unfinished download"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download"); 
    });

    it("thumbnail true compression true: thumbnail completed, compression unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20%" 
            },
            "thumbnail": {
                "download-status": "completed"  
            }
        });

        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("unfinished download"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("completed"); 
    });

    it("thumbnail true compression true: compression completed, thumbnail unfinished download", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"  
            },
            "thumbnail": {
                "download-status": "20%"   
            }
        });
        
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("completed");  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe("completed"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("unfinished download"); 
    });

    it("thumbnail true compression true: compression thumbnail completed", () =>  {  
        const filename = uuidv4();
        currentDownloadVideos.updateCurrentDownloadVideos([filename], { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"  
            },
            "thumbnail": {
                "download-status": "completed"   
            }
        });
        
        ffmpegUnfinishedVideos.cheackForAvailabeUnFinishedVideoDownloads();
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe(undefined);  
        const compression = currentDownloadVideos.getCurrentDownloads([filename, "compression", "download-status"]);
        expect(compression).toBe(undefined); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe(undefined); 
    });
}); 

describe("completeUnfinnishedVideoDownload", () =>  {  
    it("No Input", () =>  {
        const updated = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload();
        expect(updated).toBe("fileName not string");  
    });  

    it("Invalid fileName", () =>  {
        const filename = uuidv4();
        const updated = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(updated).toBe("Invalid fileName");  
    });  

    it("video false: untrunc broke video", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("untrunc broke video");    
    }); 


    it("video true, thumbnail false: redownload thumbnails", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails");    
    }); 

    it("video thumbnail true: download status completed", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "completed"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("download status: completed");    
    }); 

    it("video true, compression thumbnail false: redownload thumbnails & compression", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "unfinished download"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails & compression");    
    }); 


    it("video compression true, thumbnail false: redownload thumbnails", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails");    
    }); 


    it("video thumbnail true, compression false: redownload compression", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "unfinished download"
            },
            "thumbnail": { 
                "download-status": "completed"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("redownload compression");    
    }); 
    
    it("video compression thumbnail true: download status completed", () =>  {
        const filename = uuidv4(); 
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "completed"
            }
        });
        const completeUnfinnishedDownload = ffmpegUnfinishedVideos.completeUnfinnishedVideoDownload(filename);
        expect(completeUnfinnishedDownload).toBe("download status: completed");
        const getCurrentDownloads = currentDownloadVideos.getCurrentDownloads([filename]);
        expect(getCurrentDownloads).toBe(undefined); 
    }); 
}); 

describe("untrunc", () =>  {  
    it("No Input", () =>  {
        const untrunc = ffmpegUnfinishedVideos.untrunc();
        expect(untrunc).toBe("fileName not string");  
    });     

    it("Invalid fileName", () =>  {
        const filename = `test-${uuidv4()}`;
        const untrunc = ffmpegUnfinishedVideos.untrunc(filename);
        expect(untrunc).toBe("Invalid fileName");  
    }); 

    it("fileName_path not string", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const untrunc = ffmpegUnfinishedVideos.untrunc(filename);
        expect(untrunc).toBe("fileName_path not string");  
    }); 
    
    it("broken_video_path not string", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileName_path = `${filepath}/${filename}`; 
        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path);
        expect(untrunc).toBe("broken_video_path not string");  
    }); 
    
    it("fileName_original_ending not string", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        
        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path, video_path);
        expect(untrunc).toBe("fileName_original_ending not string");  
    }); 

    it("fileName_fixed_ending not string", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 

        const fileName_original_ending = `${filename}.mp4`;

        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path, video_path, fileName_original_ending);
        expect(untrunc).toBe("fileName_fixed_ending not string");  
    }); 

    it("untrunc fileName_original_ending", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        
        const fileName_original_ending = `${filename}.mp4`;
        const fileName_fixed_ending = `${filename}.mp4_fixed.mp4`;

        ffmpegPath.untrunc_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();
        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.working_video_path_invalid_path();
        FileSystem.mkdirSync(fileName_path);
        FileSystem.writeFileSync(`${fileName_path}/${fileName_original_ending}`, "data");

        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending);
        expect(untrunc).toBe("execute untrunc");  
        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(filename);
        expect(deleteSpecifiedVideo).toBe(`deleted-${filename}-permanently`);
    }); 
    
    it("untrunc fileName_fixed_ending", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        
        const fileName_original_ending = `${filename}.mp4`;
        const fileName_fixed_ending = `${filename}.mp4_fixed.mp4`;

        ffmpegPath.untrunc_path_invalid_path();
        ffmpegPath.ffmpeg_path_invalid_path();
        ffmpegPath.ffprobe_path_invalid_path();
        ffmpegPath.working_video_path_invalid_path();
        FileSystem.mkdirSync(fileName_path);
        FileSystem.writeFileSync(`${fileName_path}/${fileName_fixed_ending}`, "data");

        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending);
        expect(untrunc).toBe("rename filename then execute untrunc");  
        const deleteSpecifiedVideo = deleteData.deleteAllVideoData(filename);
        expect(deleteSpecifiedVideo).toBe(`deleted-${filename}-permanently`);
    }); 

    it("delete all filename data", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        
        const fileName_original_ending = `${filename}.mp4`;
        const fileName_fixed_ending = `${filename}.mp4_fixed.mp4`;

        const untrunc = ffmpegUnfinishedVideos.untrunc(filename, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending);
        expect(untrunc).toBe(`${filename} deleted`);  
    }); 
});  

describe("untrunc_exec", () =>  {  
    it("Invalid untrunc_path", () =>  {
        ffmpegPath.untrunc_path_invalid_path();
        const untrunc = ffmpegUnfinishedVideos.untrunc_exec();
        expect(untrunc).toBe("invalid untrunc_path");  
    });     
    
    it("Valid untrunc_path", () =>  {
        ffmpegPath.update_untrunc_path(untrunc_path);
        const untrunc = ffmpegUnfinishedVideos.untrunc_exec();
        expect(untrunc).toBe("working_video_path not string");  
    });   
    
    it("Valid untrunc_path, invalid working_video_path", () =>  {
        ffmpegPath.update_untrunc_path(untrunc_path);
        const working_video_path = "invalid_path";
        const untrunc = ffmpegUnfinishedVideos.untrunc_exec(working_video_path);
        expect(untrunc).toBe("invalid working_video_path");  
    });      
    
    it("Valid untrunc_path, valid working_video_path", () =>  {
        ffmpegPath.update_untrunc_path(untrunc_path);
        const untrunc = ffmpegUnfinishedVideos.untrunc_exec(working_video_path);
        expect(untrunc).toBe("broken_video_path not string");  
    });      

    it("Valid untrunc_path, valid working_video_path, invalid broken_video_path", () =>  {
        ffmpegPath.update_untrunc_path(untrunc_path);
        const broken_video_path = "invalid_path";
        const untrunc = ffmpegUnfinishedVideos.untrunc_exec(working_video_path, broken_video_path);
        expect(untrunc).toBe("invalid broken_video_path");  
    });     
}); 

describe("downloadVideoAfterUntrunc", () =>  {  
    it("No Input", () =>  {
        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc();
        expect(afterUntrunc).toBe("fileName not string");  
    });      

    it("Invalid fileName", () =>  {
        const filename = `test-${uuidv4()}`;
              
        ffmpegPath.ffprobe_path_invalid_path();
        
        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename);
        expect(afterUntrunc).toBe("Invalid fileName");  
    }); 

    it("valid fileName", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
              
        ffmpegPath.ffprobe_path_invalid_path();

        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename);
        expect(afterUntrunc).toBe("fileName_path not string");  
    }); 
    
    it("valid fileName, vaild fileName_path", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileName_path = `${filepath}/${filename}`; 
              
        ffmpegPath.ffprobe_path_invalid_path();
        
        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename, fileName_path);
        expect(afterUntrunc).toBe("video_path not string");  
    }); 
    
    it("valid fileName, vaild fileName_path, valid video_path", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
              
        ffmpegPath.ffprobe_path_invalid_path();
        
        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename, fileName_path, video_path);
        expect(afterUntrunc).toBe("fileName_original_ending not string");  
    }); 

    it("valid fileName, vaild fileName_path, valid video_path, valid fileName_original_ending", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        const fileName_original_ending = `${filename}.mp4`;
              
        ffmpegPath.ffprobe_path_invalid_path();

        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename, fileName_path, video_path, fileName_original_ending);
        expect(afterUntrunc).toBe("fileName_fixed_ending not string");  
    }); 

    it("valid fileName, vaild fileName_path, valid video_path, valid fileName_original_ending, valid fileName_fixed_ending", () =>  {
        const filename = `test-${uuidv4()}`;
        currentDownloadVideos.updateCurrentDownloadVideos([filename], {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const filepath = "./media/video"; 
        const fileType = ".mp4";
        const fileName_path = `${filepath}/${filename}`; 
        const video_path = `${fileName_path}/${filename}${fileType}`; 
        const fileName_original_ending = `${filename}.mp4`;
        const fileName_fixed_ending = `${filename}.mp4_fixed.mp4`;
              
        ffmpegPath.ffprobe_path_invalid_path();

        const afterUntrunc = ffmpegUnfinishedVideos.downloadVideoAfterUntrunc(filename, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending);
        expect(afterUntrunc).toBe("start download after untrunc");  
        const video = currentDownloadVideos.getCurrentDownloads([filename, "video", "download-status"]);
        expect(video).toBe("Untrunc"); 
        const thumbnail = currentDownloadVideos.getCurrentDownloads([filename, "thumbnail", "download-status"]);
        expect(thumbnail).toBe("waiting for video"); 
    }); 
}); 

describe("untrunc_ffprobe", () =>  {  
    it("No Input", () =>  {
        const afterUntrunc = ffmpegUnfinishedVideos.untrunc_ffprobe();
        expect(afterUntrunc).toBe("video_path not string");  
    });      

    it("Invalid video_path", () =>  {
        const afterUntrunc = ffmpegUnfinishedVideos.untrunc_ffprobe("invalid_path");
        expect(afterUntrunc).toBe("invalid video_path");  
    }); 

    it("Valid video_path, invalid ffprobe", () =>  {
        ffmpegPath.ffprobe_path_invalid_path();
        const afterUntrunc = ffmpegUnfinishedVideos.untrunc_ffprobe(working_video_path);
        expect(afterUntrunc).toBe("invalid ffprobe");  
    }); 

    it("Valid video_path, Valid ffprobe without callback", () =>  {
        const afterUntrunc = ffmpegUnfinishedVideos.untrunc_ffprobe(working_video_path);
        expect(afterUntrunc).toBe("start ffprobe");  
    }); 

    it("Valid video_path, Valid ffprobe with callback", () =>  {
        let numb = 1;
        const afterUntrunc = ffmpegUnfinishedVideos.untrunc_ffprobe(working_video_path,  () => { 
            numb = numb + 1;
            expect(numb).toBe(2);  
        });
        expect(afterUntrunc).toBe("start ffprobe");  
    }); 
}); 