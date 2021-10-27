"use strict";
const FileSystem = require("fs");
const ffmpeg = require("fluent-ffmpeg");
let ffprobe_path, ffmpeg_path; 
if (FileSystem.existsSync("./ffprobe.exe")) {
    ffprobe_path = "./ffprobe.exe";
} else {
    ffprobe_path = "ffprobe";
} 
if (FileSystem.existsSync("./ffmpeg.exe")) {
    ffmpeg_path = "./ffmpeg.exe";
} else {
    ffmpeg_path = "ffmpeg";
}    
const command = new ffmpeg();
// Big Buck Bunny
// Blender Foundation | www.blender.org
// official website: https://peach.blender.org/ 
// Licence copied from the official website: The results of the Peach open movie project has been licensed under the Creative Commons Attribution 3.0 license. This includes all the data we’ve published online and on the DVDs, and all of the contents on this website. If any content on this site is not licensed as such, it will be clearly indicated. In short, this means you can freely reuse and distribute this content, also commercially, for as long you provide a proper attribution.
const videofile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const filepath = "media/working-video/";
const fileName = "video";
const fileType = ".mp4";  
if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists 
    // start downloading working video file for untrunc
    command.addInput(videofile)
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
        .output(`${filepath}${fileName}${fileType}`)
        .run(); 
} else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory"); 
} else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory"); 
} else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory"); 
} 