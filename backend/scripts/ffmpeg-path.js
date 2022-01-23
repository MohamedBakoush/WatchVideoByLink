"use strict";
const FileSystem = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_installer = require("@ffmpeg-installer/ffmpeg");
const ffprobe_installer = require("@ffprobe-installer/ffprobe");
let ffprobe_path, ffmpeg_path, untrunc_path, working_video_path;

// get ffprobe path
function get_ffprobe_path(){ 
    if (ffprobe_path !== undefined) {
        return ffprobe_path;
    } else if (FileSystem.existsSync(ffprobe_installer.path)) {
        return update_ffprobe_path(ffprobe_installer.path);
    } else {
        return undefined;
    }  
}

// updated ffprobe path
function update_ffprobe_path(newPath){ 
    if (FileSystem.existsSync(newPath)) {
        ffprobe_path = newPath;
        ffmpeg.setFfprobePath(newPath);
        return ffprobe_path;
    } else { 
        return undefined;
    } 
}

// get ffmpeg path
function get_ffmpeg_path(){ 
    if (ffmpeg_path !== undefined) {
        return ffmpeg_path;
    } else if (FileSystem.existsSync(ffmpeg_installer.path)) {
        return update_ffmpeg_path(ffmpeg_installer.path);
    } else {
        return undefined;
    }  
}

// updated ffmpeg path
function update_ffmpeg_path(newPath){ 
    if (FileSystem.existsSync(newPath)) {
        ffmpeg_path = newPath;
        ffmpeg.setFfmpegPath(newPath);
        return ffmpeg_path;
    } else { 
        return undefined;
    } 
}

// get untrun path
function get_untrunc_path(){ 
    if (untrunc_path !== undefined) {
        return untrunc_path;
    } else if (FileSystem.existsSync("untrunc.exe")) { // user input
        return update_untrunc_path("untrunc.exe");
    } else if (FileSystem.existsSync("./untrunc-master/untrunc")) { //docker
        return update_untrunc_path("./untrunc-master/untrunc");
    } else { //docker
        return undefined;
    }   
}

// updated untrun path
function update_untrunc_path(newPath){ 
    if (FileSystem.existsSync(newPath)) {
        untrunc_path = newPath;
        return untrunc_path;
    } else { 
        return undefined;
    } 
}

// get working video path
function get_working_video_path(){ 
    if (working_video_path !== undefined) {
        return working_video_path;
    } if (FileSystem.existsSync("./media/working-video/video.mp4")) {
        return update_working_video_path("./media/working-video/video.mp4");
    } else  {
        return undefined;
    }  
}

// updated working video path
function update_working_video_path(newPath){ 
    if (FileSystem.existsSync(newPath)) {
        working_video_path = newPath;
        return working_video_path;
    } else { 
        return undefined;
    } 
}

// check if ffmpeg ffprobe exits
function checkIfFFmpegFFprobeExits() {
    if (!FileSystem.existsSync(get_ffprobe_path()) && !FileSystem.existsSync(get_ffmpeg_path())) { //files dont exists
        console.log("Cannot find ffmpeg and ffprobe in WatchVideoByLink directory"); 
        return "Cannot-find-ffmpeg-ffprobe";
    } else if (!FileSystem.existsSync(get_ffmpeg_path())) { //file dosent exists
        console.log("Cannot find ffmpeg in WatchVideoByLink directory"); 
        return "Cannot-find-ffmpeg";
    } else if (!FileSystem.existsSync(get_ffprobe_path())) { //file dosent exists
        console.log("Cannot find ffprobe in WatchVideoByLink directory"); 
        return "Cannot-find-ffprobe";
    } else { //files exists 
        return "ffmpeg-ffprobe-exits";
    }
}

// ends ffmpeg peacefully
function STOP(command) {
    return command.ffmpegProc.stdin.write("q");
}

// ends ffmpeg forcefully
function SIGKILL(command) {
    return command.kill("SIGKILL");
}

module.exports = { // export modules
  get_ffprobe_path,
  update_ffprobe_path,
  get_ffmpeg_path, 
  update_ffmpeg_path, 
  get_untrunc_path,
  update_untrunc_path,
  get_working_video_path,
  update_working_video_path,
  checkIfFFmpegFFprobeExits,
  STOP,
  SIGKILL
};
