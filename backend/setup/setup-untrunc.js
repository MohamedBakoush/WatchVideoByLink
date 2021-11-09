"use strict";
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("../scripts/ffmpeg-path");

// download working video for untrunc
function download_working_videos_for_untrunc() {
    const command = new ffmpeg();
    // Big Buck Bunny
    // Blender Foundation | www.blender.org
    // official website: https://peach.blender.org/ 
    // Licence copied from the official website: The results of the Peach open movie project has been licensed under the Creative Commons Attribution 3.0 license. This includes all the data we’ve published online and on the DVDs, and all of the contents on this website. If any content on this site is not licensed as such, it will be clearly indicated. In short, this means you can freely reuse and distribute this content, also commercially, for as long you provide a proper attribution.
    const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
    if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") { //files exists 
        // start downloading working video file for untrunc
        command.addInput("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
            .on("start", function() { // starting video dowload
                console.log("Starting working video download for untrunc");
            })
            .on("progress", function(data) { // video is in the process of being dowloaded
                console.log("progress", data);
            })
            .on("end", function() { /// finnished encoding
                console.log("Working video file for Untrunc finnished encoding");
            })
            .on("error", function(error) { /// error handling 
                console.log(`Encoding Error: ${error.message}`);
            })
            .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
            .output("media/working-video/video.mp4")
            .run(); 
    } else { 
        console.log("Working video for untrunc failed to download");
    }
}

module.exports = { // export modules 
    download_working_videos_for_untrunc
};