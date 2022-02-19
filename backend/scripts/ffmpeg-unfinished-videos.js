"use strict";
const FileSystem = require("fs");
const { exec } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegImageDownload = require("./ffmpeg-download-image");
const currentDownloadVideos = require("./current-download-videos");
const ffmpegCompressionDownload = require("./ffmpeg-download-compression");
const videoData = require("./data-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");

// check for unfinnished video/thumbnail download when the application get started 
function cheackForAvailabeUnFinishedVideoDownloads(){  
  const ffmpeg_path = ffmpegPath.get_ffmpeg_path();
  const ffprobe_path = ffmpegPath.get_ffprobe_path();
  const untrunc_path = ffmpegPath.get_untrunc_path();
  const working_video_path = ffmpegPath.get_working_video_path();
  if(Object.keys(currentDownloadVideos.getCurrentDownloads()).length !== 0){  // if there is available data in currentDownloads()
    Object.keys(currentDownloadVideos.getCurrentDownloads()).forEach(function(fileName) { // for each currentDownloads get id as fileName 
      // assign download status variable if available with correct progress status
      let videoProgress = currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]);
      if (videoProgress === undefined) {
        videoProgress = false;
      }
      let thumbnailProgress = currentDownloadVideos.getCurrentDownloads([fileName, "thumbnail", "download-status"]);
      if (thumbnailProgress === undefined) {
        thumbnailProgress = false;
      } 
      let compressionProgress = currentDownloadVideos.getCurrentDownloads([fileName, "compression", "download-status"]);
      if (compressionProgress === undefined) {
        compressionProgress = false;
      } 

      // video should always be available else delete all
      // thumbnail only if video completed 
      // compression only if true 

      if (videoProgress) {
        // videoProgress true
        if (videoProgress == "completed") {
          // videoProgress completed         
          if (thumbnailProgress && compressionProgress) {
            // thumbnail && compression true
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              if (thumbnailProgress == "completed" && compressionProgress !== "completed") {   
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg and ffprobe unavailable");
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg and ffprobe unavailable");
              }  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              if (thumbnailProgress == "completed" && compressionProgress !== "completed") {   
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg unavailable");
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg unavailable");
              }          
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              if (thumbnailProgress == "completed" && compressionProgress !== "completed") {   
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffprobe unavailable");
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable");
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable");
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffprobe unavailable");
              }  
            } else if(thumbnailProgress == "completed" && compressionProgress == "completed"){ // delete data (no longer needed)      
              currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);      
            } else if(thumbnailProgress == "completed" && compressionProgress !== "completed"){ 
              // update thumbanil unfinnished & compression completed         
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "completed");     
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "unfinished download");    
            } else if(thumbnailProgress !== "completed" && compressionProgress == "completed"){ 
              // update thumbanil unfinnished & compression completed              
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "unfinished download");  
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "completed");    
            } else { // update thumbanil & compression is unfinnished              
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "unfinished download");  
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "unfinished download");  
            }
          } else if (thumbnailProgress && !compressionProgress) {
            // thumbnail true compression false 
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable"); 
            } else if(thumbnailProgress == "completed"){ // delete data (no longer needed)       
              currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);      
            } else{ // update thumbanil is unfinnished
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "unfinished download"); 
            }
          } else if (!thumbnailProgress && compressionProgress) {
            // thumbnail false compression true 
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg and ffprobe unavailable"}); 
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg and ffprobe unavailable"}); 
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg and ffprobe unavailable");  
              }  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg unavailable"}); 
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg unavailable"}); 
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg unavailable");  
              }  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffprobe unavailable"}); 
              } else{       
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffprobe unavailable"}); 
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffprobe unavailable");  
              }  
            } else if(compressionProgress == "completed"){ // update thumbanil unfinnished 
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "unfinished download"}); 
            } else { // update thumbanil & compression is unfinnished 
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "unfinished download"}); 
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "unfinished download");  
            }
          } else {
            // thumbnail false compression false  
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg and ffprobe unavailable"}); 
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffmpeg unavailable"});  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "ffprobe unavailable"});  
            } else{ // update thumbanil is unfinnished
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail"], {"download-status": "unfinished download"});  
            } 
          }
        }  else if(currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "starting stream download" ||
                  currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "starting full video download" ||
                  currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "starting trim video download" ||
                  currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"])== "starting uploaded video download" ||
                  currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "0.00%"
                  ){ // if the video download hasn't started
                    deleteData.deleteAllVideoData(fileName);          
          } else if(!FileSystem.existsSync(untrunc_path)){//update untrunc is unavailable
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "untrunc unavailable");
          } else if(!FileSystem.existsSync(working_video_path)){//update working_video_path is unavailable
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "working video for untrunc is unavailable");
          } else{ // update video is unfinnished
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "unfinished download");
          }
      } else {
        deleteData.deleteAllVideoData(fileName);    
      }
    });  
  } else {
    return "current-downloads-empty";
  }
}

// finnish download video/thumbnail (if not completed) when the application get started 
function completeUnfinnishedVideoDownload(fileName){ 
  if (typeof fileName !== "string") { 
    return "fileName not string";
  } else if (currentDownloadVideos.getCurrentDownloads([fileName]) == undefined) { 
    return "Invalid fileName";
  } else {
    const filepath = "./media/video";
    const fileType = ".mp4";
    const fileName_path = `${filepath}/${fileName}`; 
    const video_path = `${fileName_path}/${fileName}${fileType}`; 
    
    let videoProgressCompleted;
    if (currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "completed") {
      videoProgressCompleted = true;
    } else {
      videoProgressCompleted = false;
    }

    let thumbnailProgressCompleted;
    if (currentDownloadVideos.getCurrentDownloads([fileName, "thumbnail", "download-status"]) == "completed") {
      thumbnailProgressCompleted = true;
    } else {
      thumbnailProgressCompleted = false;
    }

    let compressionProgressCompleted;
    if (currentDownloadVideos.getCurrentDownloads([fileName, "compression", "download-status"]) == "completed") {
      compressionProgressCompleted = true;
    } else {
      compressionProgressCompleted = false;
    }

    if(videoProgressCompleted){ // when video has already been finnished downloading 
      if((thumbnailProgressCompleted && compressionProgressCompleted) 
        || (thumbnailProgressCompleted && currentDownloadVideos.getCurrentDownloads([fileName, "compression"]) == undefined)){ // delete data (no longer needed)    
        // thumbnail true, compression true or thumbnail true, compression undefined 
        currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);      
        return "download status: completed";
      } else if((!thumbnailProgressCompleted && compressionProgressCompleted) 
              || (!thumbnailProgressCompleted && currentDownloadVideos.getCurrentDownloads([fileName, "compression"]) == undefined)){ // redownload thumbnails
        // thumbnail false, compression true or thumbnail false, compression undefined 
        ffmpegImageDownload.createThumbnail(video_path, `${fileName_path}/`, fileName); 
        return "redownload thumbnails";
      } else if(thumbnailProgressCompleted && !compressionProgressCompleted){ // redownload compression
        // thumbnail true, compression false
        ffmpegCompressionDownload.compression_VP9(video_path, `${fileName_path}/`, fileName); 
        return "redownload compression";
      } else { // redownload thumbnails & compression
        // thumbnail false, compression false  
        ffmpegImageDownload.createThumbnail(video_path, `${fileName_path}/`, fileName); 
        ffmpegCompressionDownload.compression_VP9(video_path, `${fileName_path}/`, fileName); 
        return "redownload thumbnails & compression";  
      } 
    } else{ // untrunc broke video 
      const fileName_original_ending = `${fileName}.mp4`,
      fileName_fixed_ending = `${fileName}.mp4_fixed.mp4`;
      untrunc(fileName, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending);  
      return "untrunc broke video";
    }
  }
}

// Restore a damaged (truncated) mp4 provided a similar not broken video is available
function untrunc(fileName, fileName_path, broken_video_path, fileName_original_ending, fileName_fixed_ending){
  const working_video_path = ffmpegPath.get_working_video_path();
  if (typeof fileName !== "string") { 
    return "fileName not string";
  } else if (currentDownloadVideos.getCurrentDownloads([fileName]) == undefined) { 
    return "Invalid fileName";
  } else if (typeof fileName_path !== "string") { 
    return "fileName_path not string";
  } else if (typeof broken_video_path !== "string") { 
    return "broken_video_path not string";
  } else if (typeof fileName_original_ending !== "string") { 
    return "fileName_original_ending not string";
  } else if (typeof fileName_fixed_ending !== "string") { 
    return "fileName_fixed_ending not string";
  } else if(deleteData.check_if_file_exits(`${fileName_path}/${fileName_original_ending}`) == true){  
    untrunc_exec(working_video_path, broken_video_path, () => {
      downloadVideoAfterUntrunc(fileName, fileName_path, broken_video_path, fileName_original_ending, fileName_fixed_ending);
    });
    return "execute untrunc";
  } else if(deleteData.check_if_file_exits(`${fileName_path}/${fileName_fixed_ending}`) == true){ 
    deleteData.rename_file(`${fileName_path}/${fileName_fixed_ending}`, fileName_path, fileName_original_ending,  () => { 
      untrunc_exec(working_video_path, broken_video_path, () => {
        downloadVideoAfterUntrunc(fileName, fileName_path, broken_video_path, fileName_original_ending, fileName_fixed_ending);
      });
    });
    return "rename filename then execute untrunc";
  } else{ 
    deleteData.deleteAllVideoData(fileName);
    return `${fileName} deleted`; 
  }
}

function untrunc_exec(working_video_path, broken_video_path, callback) {
  const untrunc_path = ffmpegPath.get_untrunc_path();
  if (deleteData.check_if_file_exits(untrunc_path) !== true) {
    return "invalid untrunc_path";
  } else if (typeof working_video_path !== "string") {
    return "working_video_path not string";
  }  else if (deleteData.check_if_file_exits(working_video_path) !== true) {
    return "invalid working_video_path";
  } else if (typeof broken_video_path !== "string") {
    return "broken_video_path not string";
  } else if (deleteData.check_if_file_exits(broken_video_path) !== true) {
    return "invalid broken_video_path";
  } else {
    exec(`${untrunc_path} ${working_video_path} ${broken_video_path}`, (err) => {
      if (err) throw err;
      if (typeof callback === "function") {
        callback();
      }
    }); 
    return "executing untrunc";
  }
}

// Download video after Untrunc
function downloadVideoAfterUntrunc(fileName, fileName_path, video_path, fileName_original_ending, fileName_fixed_ending){
  const fileName_delete_soon_ending = "delete_soon.mp4";
  if (typeof fileName !== "string") { 
    return "fileName not string";
  } else if (currentDownloadVideos.getCurrentDownloads([fileName]) == undefined) { 
    return "Invalid fileName";
  } else if (typeof fileName_path !== "string") { 
    return "fileName_path not string";
  } else if (typeof video_path !== "string") { 
    return "video_path not string";
  } else if (typeof fileName_original_ending !== "string") { 
    return "fileName_original_ending not string";
  } else if (typeof fileName_fixed_ending !== "string") { 
    return "fileName_fixed_ending not string";
  } else if (typeof fileName_delete_soon_ending !== "string") { 
    return "fileName_delete_soon_ending not string";
  } else {
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
      video : { 
        "download-status" : "Untrunc"
      },
      thumbnail : { 
        "download-status" : "waiting for video"
      } 
    });   
    untrunc_ffprobe(`${fileName_path}/${fileName_fixed_ending}`, (metadata) => {
      if (metadata === undefined) {
        deleteData.deleteAllVideoData(fileName);
      } else {
        // move video file to deleted-videos folder
        // if video is active it will make the video not viewable if someone wants to view it 
        deleteData.rename_file(`${fileName_path}/${fileName_original_ending}`, fileName_path, fileName_delete_soon_ending,  () => { 
          if (deleteData.check_if_file_exits(`${fileName_path}/${fileName_delete_soon_ending}`) == true) { 
            deleteData.rename_file(`${fileName_path}/${fileName_fixed_ending}`, fileName_path, fileName_original_ending,  () => { 
              if (deleteData.check_if_file_exits(`${fileName_path}/${fileName_original_ending}`)) {
                videoData.updateVideoData([`${fileName}`], {
                  video : {
                    originalVideoSrc : "unknown",
                    originalVideoType : "unknown",
                    path: video_path,
                    videoType : "video/mp4",
                    download : "completed",
                  },
                  thumbnail: {
                    path: {},
                    download: "starting"
                  }
                });
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
                  video : { 
                    "download-status" : "completed"
                  },
                  thumbnail : { 
                    "download-status" : "starting thumbnail download"
                  } 
                });
                ffmpegImageDownload.createThumbnail(video_path, `${fileName_path}/`, fileName); 
              }
              deleteData.unlink_file(`${fileName_path}/${fileName_delete_soon_ending}`);
              deleteData.unlink_file(`${fileName_path}/${fileName_fixed_ending}`);
            }); 
          } 
        });
      }
    });
    return "start download after untrunc";
  }
}

function untrunc_ffprobe(video_path, callback) {
  if (typeof video_path !== "string") {
    return "video_path not string";
  } else if (deleteData.check_if_file_exits(video_path) !== true) { 
    return "invalid video_path";
  } else if (deleteData.check_if_file_exits(ffmpegPath.get_ffprobe_path()) !== true) { 
    return "invalid ffprobe";
  } else {
    ffmpeg.ffprobe(video_path, (err, metadata) => {   
      if(typeof callback === "function") callback(metadata);
    });
    return "start ffprobe";
  }
}

module.exports = { // export modules 
  cheackForAvailabeUnFinishedVideoDownloads,
  completeUnfinnishedVideoDownload,
  untrunc,
  untrunc_exec,
  untrunc_ffprobe,
  downloadVideoAfterUntrunc
};