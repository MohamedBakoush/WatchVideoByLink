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
      let videoProgress, thumbnailProgress, compressionProgress;
      if (currentDownloadVideos.getCurrentDownloads([fileName, "video"])) {
        videoProgress = currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]);  
      } else {
        videoProgress = false;
      }
      if (currentDownloadVideos.getCurrentDownloads([fileName, "thumbnail"])) {
        thumbnailProgress = currentDownloadVideos.getCurrentDownloads([fileName, "thumbnail", "download-status"]);  
      } else {
        thumbnailProgress = false;
      } 
      if (currentDownloadVideos.getCurrentDownloads([fileName, "compression"])) {
        compressionProgress = currentDownloadVideos.getCurrentDownloads([fileName, "compression", "download-status"]);  
      } else {
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
  }
}

// finnish download video/thumbnail (if not completed) when the application get started 
function completeUnfinnishedVideoDownload(fileName){ 
  const videoDetails = currentDownloadVideos.findCurrentDownloadByID(fileName);
  if (videoDetails == undefined) { 
    return "invalid current downloads id";
  } else {
    const filepath = "media/video/";
    const fileType = ".mp4";
    const newFilePath = `${filepath}${fileName}/`; 
    const path = newFilePath+fileName+fileType;
    let videoProgressCompleted, thumbnailProgressCompleted, compressionProgressCompleted;
    try { // if videoProgress exits and is complete return true else false
      if (currentDownloadVideos.getCurrentDownloads([fileName, "video", "download-status"]) == "completed") {
        videoProgressCompleted = true;
      } else {
        videoProgressCompleted = false;
      }
    } catch (error) {
      videoProgressCompleted = false;
    }
    try { // if thumbnailProgress exits and is complete return true else false
      if (currentDownloadVideos.getCurrentDownloads([fileName, "thumbnail", "download-status"]) == "completed") {
        thumbnailProgressCompleted = true;
      } else {
        thumbnailProgressCompleted = false;
      }
    } catch (error) {
      thumbnailProgressCompleted = false;
    }
    try { // if compressionProgress exits and is complete return true else false
      if (currentDownloadVideos.getCurrentDownloads([fileName, "compression", "download-status"]) == "completed") {
        compressionProgressCompleted = true;
      } else {
        compressionProgressCompleted = false;
      }
    } catch (error) {
      compressionProgressCompleted = false;
    }
    if(videoProgressCompleted){ // when video has already been finnished downloading 
      if(thumbnailProgressCompleted && compressionProgressCompleted){ // delete data (no longer needed)    
        // thumbnail true, compression true   
        currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);      
        return "download status: completed";
      } else if(!thumbnailProgressCompleted && compressionProgressCompleted){ // redownload thumbnails
        // thumbnail false, compression true
        ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 
        return "redownload thumbnails";
      } else if(thumbnailProgressCompleted && !compressionProgressCompleted){ // redownload compression
        // thumbnail true, compression false
        ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName); 
        return "redownload compression";
      } else{ 
        if (currentDownloadVideos.getCurrentDownloads([fileName, "compression"]) == undefined) { // redownload thumbnails 
          // thumbnail false, compression undefined  
          ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 
          return "redownload thumbnails";      
        } else { // redownload thumbnails & compression
          // thumbnail false, compression false  
          ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 
          ffmpegCompressionDownload.compression_VP9(path, newFilePath, fileName); 
          return "redownload thumbnails & compression";  
        } 
      }
    } else{  
      const fileName_path = `./media/video/${fileName}/${fileName}`,
      fileName_original_ending = `${fileName_path}.mp4`,
      fileName_fixed_ending = `${fileName_path}.mp4_fixed.mp4`;
      // untrunc broke video 
      untrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending);  
      return "untrunc broke video";
    }
  }
}

// Restore a damaged (truncated) mp4 provided a similar not broken video is available
function untrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending){
  const untrunc_path = ffmpegPath.get_untrunc_path();
  const working_video_path = ffmpegPath.get_working_video_path();
  if(FileSystem.existsSync(fileName_original_ending) == true){  
    exec(`${untrunc_path} ${working_video_path} ./media/video/${fileName}/${fileName}.mp4`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          downloadVideoAfterUntrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending);
          return;
      }
      console.log(`stdout: ${stdout}`);
    }); 
  } else if(FileSystem.existsSync(fileName_fixed_ending) == true){ 
    const renameFilePath = setInterval(function(){ 
      FileSystem.rename(fileName_fixed_ending, fileName_original_ending,  () => { 
        clearInterval(renameFilePath);
        // if (err) throw err; 
        exec(`${untrunc_path} ${working_video_path} ./media/video/${fileName}/${fileName}.mp4`, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              downloadVideoAfterUntrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending);
              return;
          }
          console.log(`stdout: ${stdout}`);
        }); 
      });
    }, 50);
  } else{ 
    deleteData.deleteAllVideoData(fileName);       
  }
}

// Download video after Untrunc
function downloadVideoAfterUntrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending){
  ffmpeg.ffprobe(fileName_fixed_ending, (error, metadata) => {   
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
      video : { 
        "download-status" : "Untrunc"
      },
      thumbnail : { 
        "download-status" : "waiting for video"
      } 
    });   
    // check if fileName_fixed_ending video has finnished downloading by checking if metadata exits
    const checkIfMetadataExists = setInterval(function(){ 
      //code goes here that will be run every intrerval.    
      if(metadata !== "undefined"){ // video finnished restoring
        clearInterval(checkIfMetadataExists); // stop check if video finnished restoring  
        // move video file to deleted-videos folder
        // if video is active it will make the video not viewable if someone wants to view it 
        const renameBadVideoFile = setInterval(function(){ 
          FileSystem.rename(fileName_original_ending, `./media/video/${fileName}/delete_soon.mp4`, () => { 
            clearInterval(renameBadVideoFile); // stop interval
            if (deleteData.check_if_file_exits(`./media/video/${fileName}/delete_soon.mp4`) == true) { 
              //file exists   
              const renameFixedVideoTillOrignialName = setInterval(function(){                        
                FileSystem.rename(fileName_fixed_ending, fileName_original_ending,  () => { 
                  clearInterval(renameFixedVideoTillOrignialName); // stop interval
                  if (deleteData.check_if_file_exits(fileName_original_ending)) {
                    console.log(`\n rename ${fileName_fixed_ending} to ${fileName_original_ending} \n`);
                    /// encoding is complete, so callback or move on at this point
                    videoData.updateVideoData([`${fileName}`], {
                      video : {
                        originalVideoSrc : "unknown",
                        originalVideoType : "unknown",
                        path: newFilePath+fileName+fileType,
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

                    console.log("Video Transcoding succeeded !"); 
                    ffmpegImageDownload.createThumbnail(path, newFilePath, fileName); 
                  }

                  deleteData.unlink_file(`./media/video/${fileName}/delete_soon.mp4`);
                  deleteData.unlink_file(`./media/video/${fileName}/${fileName}.mp4_fixed.mp4`);
                });        
              }, 50);  
            } 
          });   
        }, 50);  
      }
    }, 50); 
  });
}

module.exports = { // export modules 
  cheackForAvailabeUnFinishedVideoDownloads,
  completeUnfinnishedVideoDownload,
  untrunc,
  downloadVideoAfterUntrunc
};