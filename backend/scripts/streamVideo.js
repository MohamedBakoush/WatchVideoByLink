"use strict";
const FileSystem = require("fs");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const youtubedl = require("youtube-dl");
const userSettings = require("./user-settings");
const currentDownloadVideos = require("./current-download-videos");
const videoData = require("./data-videos");
const availableVideos = require("./available-videos");
const ffmpegPath = require("./ffmpeg-path");
const deleteData = require("./delete-data");

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
            if (FileSystem.existsSync(`./media/video/${fileName}/delete_soon.mp4`) == true) { 
              //file exists   
              const renameFixedVideoTillOrignialName = setInterval(function(){                        
                FileSystem.rename(fileName_fixed_ending, fileName_original_ending,  () => { 
                  clearInterval(renameFixedVideoTillOrignialName); // stop interval
                  if (FileSystem.existsSync(fileName_original_ending)) {
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
                    createThumbnail(path, newFilePath, fileName); 
                  }

                  if(FileSystem.existsSync(`./media/video/${fileName}/delete_soon.mp4`) == true){
                    FileSystem.unlink(`./media/video/${fileName}/delete_soon.mp4`, (err) => {
                      if (err) throw err;
                      console.log(`\n unlinked media/video/${fileName}/delete_soon.mp4 video file \n`);
                    });
                  }

                  if(FileSystem.existsSync(`./media/video/${fileName}/${fileName}.mp4_fixed.mp4`) == true){
                    FileSystem.unlink(`./media/video/${fileName}/${fileName}.mp4_fixed.mp4`, (err) => {
                      if (err) throw err;
                      console.log(`\n unlinked media/video/${fileName}/${fileName}.mp4_fixed.mp4 video file \n`);
                    });
                  }
                });        
              }, 50);  
            } 
          });   
        }, 50);  
      }
    }, 50); 
  });
}

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
        createThumbnail(path, newFilePath, fileName); 
        return "redownload thumbnails";
      } else if(thumbnailProgressCompleted && !compressionProgressCompleted){ // redownload compression
        // thumbnail true, compression false
        compression_VP9(path, newFilePath, fileName); 
        return "redownload compression";
      } else{ 
        if (currentDownloadVideos.getCurrentDownloads([fileName, "compression"]) == undefined) { // redownload thumbnails 
          // thumbnail false, compression undefined  
          createThumbnail(path, newFilePath, fileName); 
          return "redownload thumbnails";      
        } else { // redownload thumbnails & compression
          // thumbnail false, compression false  
          createThumbnail(path, newFilePath, fileName); 
          compression_VP9(path, newFilePath, fileName); 
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

// ends ffmpeg (finishes download video)
const stop = (command) => {
  return command.ffmpegProc.stdin.write("q");
};

// ends ffmpeg forcefully
const SIGKILL = (command) => {
  return command.kill("SIGKILL");
};

// check if original video src path exits
async function checkIfVideoSrcOriginalPathExits(videoSrc) {
  try {
    if (videoSrc.includes("/video/")) { // if videoSrc includes /video/, split src at /video/ and attempt to findVideosByID
      const videoDetails = await videoData.findVideosByID(videoSrc.split("/video/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        return videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          return videoDetails.video.path;  
        } else { // videofile = inputted videos src 
          return videoSrc;
        } 
      }
    } else if (videoSrc.includes("/compressed/")) {
      const videoDetails = await videoData.findVideosByID(videoSrc.split("/compressed/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        return videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          return videoDetails.video.path;
        } else { // videofile = inputted videos src 
          return videoSrc;
        } 
      }
    } else { // videofile = inputted videos src  
      return videoSrc;
    } 
  } catch (error) { // videofile = inputted videos src 
    return videoSrc;
  } 
}

let fileNameID;
let stopVideoFileBool = false;
async function stopDownloadVideoStream(id) {
  const videoDetails = await videoData.findVideosByID(id);
  if (videoDetails !== undefined) {
    stopVideoFileBool = true;
    fileNameID = id; 
    return "stoped video stream download";
  } else {
    return "videoDetails dosnet exists";
  } 
}

// downloads live video stream
async function downloadVideoStream(req, res) {
  const command = new ffmpeg();
  const videofile = req.body.videoSrc;
  const compressVideoStream = userSettings.checkIfVideoCompress("downloadVideoStream");
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData.updateVideoData([`${fileName}`], {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting stream download"
            }
          });
          
          if (compressVideoStream) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting stream download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          } else {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting stream download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          }
        })
        .on("progress", function(data) {
          console.log("progress", data);

          if(videoData.getVideoData([`${fileName}`, "video", "download"]) !== "downloading"){
            videoData.updateVideoData([`${fileName}`, "video", "timemark"], data.timemark);
            videoData.updateVideoData([`${fileName}`, "video", "download"], "downloading");
          } else {
            videoData.updateVideoData([`${fileName}`, "video", "timemark"], data.timemark);
          } 

          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"],  data.timemark);

          if (stopVideoFileBool === true  && fileNameID == fileName) {
            try {
              stop(command);
              stopVideoFileBool = false;
            } catch (e) {
              stopVideoFileBool = false;
            }
          }
        })
        .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          if (compressVideoStream) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
              video : {
                originalVideoSrc : req.body.videoSrc,
                originalVideoType : req.body.videoType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              compression : {
                download: "starting"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          } else {
            videoData.updateVideoData([`${fileName}`], {
              video : {
                originalVideoSrc : req.body.videoSrc,
                originalVideoType : req.body.videoType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          }

          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"],  "completed");
          if (compressVideoStream) { // addition of compress video data 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"],  "starting video compression"); 
          }
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"],  "starting thumbnail download"); 

          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          if (compressVideoStream) { // compress video
            compression_VP9(path, newFilePath, fileName);
          }
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadVideoStream]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        // .addInputOption('-i')
        .outputOptions(["-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        // .outputOptions(['-c copy'])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else { 
    res.json(ffmpegAvaiable);
  } 
}

// download full video
async function downloadVideo(req, res) {
  const command = new ffmpeg();
  const videoSrc = req.body.videoSrc;
  const videofile = await checkIfVideoSrcOriginalPathExits(videoSrc);
  const compressVideo = userSettings.checkIfVideoCompress("downloadVideo");
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData.updateVideoData([`${fileName}`], {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting full video download"
            }
          });

          if (compressVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting full video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            }); 
          } else {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting full video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          }
        })
        .on("progress", function(data) {
          console.log("progress", data);

          videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);

          if(data.percent < 0){ 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
          }else{
            try {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);
            } catch (error) {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
            }
          } 
        })
        .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          if (compressVideo) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : req.body.videoSrc,
                originalVideoType : req.body.videoType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              compression : {
                download: "starting"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          } else {
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : req.body.videoSrc,
                originalVideoType : req.body.videoType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          }

          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "completed");
          if (compressVideo) { // addition of compress video data   
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");             
          } 
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download");

          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          if (compressVideo) { // compress video
            compression_VP9(path, newFilePath, fileName);
          }
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else { 
    res.json(ffmpegAvaiable);
  }
}

// downlaod trimed video
async function trimVideo(req, res) {
  const command = new ffmpeg();
  const videoSrc = req.body.videoSrc;
  const videofile = await checkIfVideoSrcOriginalPathExits(videoSrc);
  const compressTrimedVideo = userSettings.checkIfVideoCompress("trimVideo");
  const start = req.body.newStartTime;
  const end = req.body.newEndTime;
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {  
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData.updateVideoData([`${fileName}`], {
            video:{
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              newVideoStartTime: req.body.newStartTime,
              newVideoEndTime: req.body.newEndTime,
              download : "starting trim video download"
            }
          });
          
          if (compressTrimedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting trim video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          } else {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting trim video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          }
        
        })
        .on("progress", function(data) {
          console.log("progress", data);

          videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);

          if(data.percent < 0){ 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
          }else{
            try {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);  
            } catch (error) {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
            }
          } 

        })
        .on("end", function() {
          if (compressTrimedVideo) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc: req.body.videoSrc,
                originalVideoType: req.body.videoType,
                newVideoStartTime: req.body.newStartTime,
                newVideoEndTime: req.body.newEndTime,
                path: newFilePath+fileName+fileType,
                videoType: "video/mp4",
                download: "completed"
              },
              compression : {
                download: "starting"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          } else {
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc: req.body.videoSrc,
                originalVideoType: req.body.videoType,
                newVideoStartTime: req.body.newStartTime,
                newVideoEndTime: req.body.newEndTime,
                path: newFilePath+fileName+fileType,
                videoType: "video/mp4",
                download: "completed"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          }
     
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "completed");
          if (compressTrimedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");
          }        
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download");

          console.log("Video Transcoding succeeded !");
          const path = newFilePath+fileName+fileType;
          if (compressTrimedVideo) { // compress video
            compression_VP9(path, newFilePath, fileName); 
          }
          createThumbnail(path, newFilePath, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-trimVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        // .addInputOption("-y")
        .outputOptions([`-ss ${start}`, `-t ${(end-start)}`, "-vcodec copy", "-acodec copy"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else {
        // TODO: create new fileName and try again
        console.log("videoDetails already exists");
      }
  } else { 
    res.json(ffmpegAvaiable);
  } 
}

// creates images from provided video
async function createThumbnail(videofile, newFilePath, fileName) {
  const imageFileName = "thumbnail";
  const fileType = ".jpg";
  const numberOfImages = 8;
  let duration = 0;
  let numberOfCreatedScreenshots = 0;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") { 
    if (videoDetails !== undefined) {
      ffmpeg.ffprobe(videofile, (error, metadata) => {
        try { // get video duration 
          duration = metadata.format.duration;
        } catch (error) { // duration = 0
          duration = 0;
        } 
        console.log(`${fileName} duration: ${duration}`);
        // if video duration greater then 0
        if (duration > 0) {
          const command = new ffmpeg();
            command.addInput(videofile)
              .on("start", () => {
                console.log("start createThumbnail");
              })
    
              .on("progress", (data) => {
                console.log("progress", data);
                // update numberOfCreatedScreenshots
                numberOfCreatedScreenshots = data.frames; 
    
                if(data.percent < 0){ // if data.percent is less then 0 then show 0.00%
                  videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], 0.00);
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "0.00%");
                }else{ //update data with with data.percent
                  try {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], data.percent);
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent.toFixed(2)}%`);
                  } catch (error) {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], data.percent);
                    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], `${data.percent}%`);
                  }
                }
    
              })
              .on("end", () => {
                // encoding is complete
                for (let i = 0; i < numberOfCreatedScreenshots + 1; i++) {
                  if (i == 0){
                    try {
                      if (availableVideos.getAvailableVideos([`${fileName}`, "info"])) {
                        availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink"], {});
                      } else {            
                        availableVideos.updateAvailableVideoData([`${fileName}`], {
                          info:{
                            title: fileName,
                            videoLink: {
                              src : `/video/${fileName}`,
                              type : "video/mp4"
                            },
                            thumbnailLink: {
                            }
                          }
                        });
                      }
                    } catch (error) {
                      availableVideos.updateAvailableVideoData([`${fileName}`], {
                        info:{
                          title: fileName,
                          videoLink: {
                            src : `/video/${fileName}`,
                            type : "video/mp4"
                          },
                          thumbnailLink: {
                          }
                        }
                      });
                    }
                  } else if (i < 10) {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}00${i}${fileType}`);
                    availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
                  } else if (i < 100) {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}0${i}${fileType}`);
                    availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
                  } else {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "path", i], `${newFilePath}${fileName}-${imageFileName}${i}${fileType}`);
                    availableVideos.updateAvailableVideoData([`${fileName}`, "info", "thumbnailLink", i], `/thumbnail/${fileName}/${i}`);
                  }
                  if (i == numberOfCreatedScreenshots) {
                    videoData.updateVideoData([`${fileName}`, "thumbnail", "download"], "completed");
                  }
                }
                
                if(currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression"]) === undefined || currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression", "download-status"]) === "completed") { 
                  currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
                } else  {  
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "completed");
                } 
        
              })
              .on("error", (error) => {
                  /// error handling
                  console.log(`Encoding Error: ${error.message}`);
              })
              .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
              .output(`${newFilePath}${fileName}-${imageFileName}%03d${fileType}`)
              .run();
        } else { // duration less or equal to 0
          try { // delete data
            if (videoData.getVideoData([`${fileName}`]) || currentDownloadVideos.getCurrentDownloads()[`${fileName}`]) { // if videodata and currentDownloadVideos is avaiable 
              // delete all data
              deleteData.deleteAllVideoData(fileName);
            } 
          } catch (error) { // an error has occurred
            console.log(error);
          } 
        }
      }); 
    } else { 
      return "videoDetails dosnet exists";
    }
  } else if(ffmpegAvaiable == "Cannot-find-ffmpeg-ffprobe"){
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg and ffprobe unavailable");
  } else if(ffmpegAvaiable == "Cannot-find-ffmpeg"){ 
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffmpeg unavailable");
  } else if(ffmpegAvaiable == "Cannot-find-ffprobe"){ 
    currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "ffprobe unavailable");
  }
}

let fileNameID_Compression;
let stopCompressedVideoFileBool = false; 
// check if video compression is downloading
// if true then update stopCompressedVideoFileBool and fileNameID_Compression variable and return true
// else return false
async function stopCommpressedVideoDownload(fileNameID) { 
  try {
    const videoDetails = await videoData.findVideosByID(fileNameID);
    const currentDownloads = await currentDownloadVideos.findCurrentDownloadByID(fileNameID); 
    let videoDataCompressionProgress, currentDownloadCompressionProgress; 
    try {
      if (videoDetails["compression"]) {
        videoDataCompressionProgress = videoDetails["compression"]["download"];  
      } else {
        videoDataCompressionProgress = false;
      } 
    } catch (error) {
      videoDataCompressionProgress = false;
    }
    try {
      if (currentDownloads["compression"]) {
        currentDownloadCompressionProgress = currentDownloads["compression"]["download-status"];  
      } else {
        currentDownloadCompressionProgress = false;
      } 
    } catch (error) {
      currentDownloadCompressionProgress = false;
    }

    if (videoDataCompressionProgress) {
      if (videoDataCompressionProgress == "completed") {   
          return false; 
      } else if (currentDownloadCompressionProgress) {
        if (currentDownloadCompressionProgress == "completed"
        || currentDownloadCompressionProgress == "ffmpeg and ffprobe unavailable"
        || currentDownloadCompressionProgress == "ffmpeg unavailable"
        || currentDownloadCompressionProgress == "ffprobe unavailable"
        || currentDownloadCompressionProgress == "unfinished download") {
          return false;
        } else {
          stopCompressedVideoFileBool = true;
          fileNameID_Compression = fileNameID; 
          return true;
        }
      } else {
        stopCompressedVideoFileBool = true;
        fileNameID_Compression = fileNameID; 
        return true;
      }
    } else if (currentDownloadCompressionProgress) {
      if (currentDownloadCompressionProgress == "completed"
      || currentDownloadCompressionProgress == "ffmpeg and ffprobe unavailable"
      || currentDownloadCompressionProgress == "ffmpeg unavailable"
      || currentDownloadCompressionProgress == "ffprobe unavailable"
      || currentDownloadCompressionProgress == "unfinished download") {
        return false;
      } else {
        stopCompressedVideoFileBool = true;
        fileNameID_Compression = fileNameID; 
        return true;
      }
    } else {
      return false;
    } 
  } catch (error) {
    return false;
  }
}

// VP9 video compression - make video size smaller
async function compression_VP9(videofile, newFilePath, fileName) {
  const command = new ffmpeg();
  const fileType = ".webm";
  let duration = 0;
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {
    if (videoDetails !== undefined) {
      ffmpeg.ffprobe(videofile, (error, metadata) => {
        try { // get video duration 
          duration = metadata.format.duration;
        } catch (error) { // duration = 0
          duration = 0;
        } 
        console.log(`${fileName} duration: ${duration}`);
        // if video duration greater then 0
        if (duration > 0) {
          command.addInput(videofile)
            .on("start", function() {
              console.log(`${fileName} compression-download-status: starting`);
            })
            .on("progress", function(data) { 
              videoData.updateVideoData([`${fileName}`, "compression", "download"], data.percent);

              if(data.percent < 0){
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "0.00%");
                console.log(`${fileName} compression-download-status: 0.00%`);
              } else if(data.percent == "undefined"){
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);  
                console.log(`${fileName} compression-download-status: ${data.percent}%`);
              } else{
                try { 
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent.toFixed(2)}%`);
                  console.log(`${fileName} compression-download-status: ${data.percent.toFixed(2)}%`);
                } catch (error) {
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], `${data.percent}%`);
                  console.log(`${fileName} compression-download-status: ${data.percent}%`);
                }
              }  

              // stop video compression
              if (stopCompressedVideoFileBool === true  && fileNameID_Compression == fileName) {
                try {
                  SIGKILL(command);
                  stopCompressedVideoFileBool = false; 
                } catch (e) {
                  stopCompressedVideoFileBool = false; 
                }
              }
            })
            .on("end", function() {
              /// encoding is complete
              console.log(`${fileName} compression-download-status: complete`); 
              try {
                if (availableVideos.getAvailableVideos([`${fileName}`,"info"])) {
                  availableVideos.updateAvailableVideoData([`${fileName}`, "info", "videoLink", "compressdSrc"], `/compressed/${fileName}`);
                  availableVideos.updateAvailableVideoData([`${fileName}`, "info", "videoLink", "compressedType"], "video/webm");
                } else{
                  availableVideos.updateAvailableVideoData([`${fileName}`], {
                    info:{
                      title: fileName,
                      videoLink: {
                        src : `/video/${fileName}`,
                        type : "video/mp4",
                        compressdSrc : `/compressed/${fileName}`,
                        compressedType : "video/webm"
                      }
                    }
                  });
                }              
              } catch (error) {
                availableVideos.updateAvailableVideoData([`${fileName}`], {
                  info:{
                    title: fileName,
                    videoLink: {
                      src : `/video/${fileName}`,
                      type : "video/mp4",
                      compressdSrc : `/compressed/${fileName}`,
                      compressedType : "video/webm"
                    }
                  }
                });
              } 
          
              videoData.updateVideoData([`${fileName}`, "compression"], { 
                path: newFilePath+fileName+fileType,
                videoType: "video/webm",
                download: "completed"
              });

              if(currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail"]) === undefined || currentDownloadVideos.getCurrentDownloads([`${fileName}`, "thumbnail", "download-status"]) === "completed") { 
                currentDownloadVideos.deleteSpecifiedCurrentDownloadVideosData(fileName);
              } else  {  
                currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "completed");
              }            
            })
            .on("error", function(error) {
              /// error handling
              if (error.message === "ffmpeg was killed with signal SIGKILL") {
                if (videoData.getVideoData([`${fileName}`,"compression"])) {       
                  videoData.updateVideoData([`${fileName}`, "compression", "download"], "ffmpeg was killed with signal SIGKILL");
                }  
                if (currentDownloadVideos.getCurrentDownloads([`${fileName}`, "compression"])) {      
                  currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "ffmpeg was killed with signal SIGKILL");   
                } 
              }
            })
            // https://developers.google.com/media/vp9/settings/vod/
            .outputOptions(["-c:v libvpx-vp9", "-crf 32", "-b:v 2000k"])
            .output(`${newFilePath}${fileName}${fileType}`)
            .run(); 
        } else { 
          try { // duration less or equal to 0
            if (videoData.getVideoData([`${fileName}`]) || currentDownloadVideos.getCurrentDownloads([`${fileName}`])) { // if videodata and currentDownloadVideos is avaiable 
              // delete all data
              deleteData.deleteAllVideoData(fileName);
            } 
          } catch (error) { // an error has occurred
            console.log(error); 
          } 
        }
      }); 
    } else {  
      return "videoDetails dosnet exists";
    } 
  } else { 
    console.log(ffmpegAvaiable);
  }
}

// using youtube-dl it converts url link to video type and video src
async function getVideoLinkFromUrl(req, res) {
  try {
    const url = req.body.url;
    // Optional arguments passed to youtube-dl.
    const options = ["--skip-download"];
    youtubedl.getInfo(url, options, function(err, info) {
     // info.protocol
     // protocol: https or http == video/mp4
     // protocol: http_dash_segments == application/dash+xml
     // protocol: m3u8 == application/x-mpegURL
     let videoFileFormat, videoUrlLink;
     if (info !== undefined) {
       if (info.protocol == "https" || info.protocol == "http") {
         videoUrlLink = info.url;
         videoFileFormat = "video/mp4";
       } else if (info.protocol == "m3u8") {
         videoUrlLink = info.url;
         videoFileFormat = "application/x-mpegURL";
       } else if (info.protocol == "http_dash_segments") {
         videoUrlLink = info.url;
         videoFileFormat = "application/dash+xml";
       } else {
         videoUrlLink = "not-supported";
         videoFileFormat = "not-supported";
       }
     } else {
       videoUrlLink = "not-supported";
       videoFileFormat = "not-supported";
     }
     const videoDataFromUrl = {
       input_url_link: url,
       video_url: videoUrlLink,
       video_file_format: videoFileFormat
     };
     if (videoUrlLink !== "not-supported" || videoFileFormat !== "not-supported") {
       res.json(videoDataFromUrl);
     } else {
       res.json("failed-get-video-url-from-provided-url");
     }
    });
  } catch (e) {
    res.json("failed-get-video-url-from-provided-url");
  }
}


// upload video file to ./media/video then downoald file
function uploadVideoFile(req, res) {
  if(req.files) {
    const file = req.files.file;
    const filename = uuidv4();
    const fileMimeType = req.files.file.mimetype; 
    if(req.files.file.truncated){  // file size greater then limit
      res.json("video-size-over-size-limit"); 
    } else { // file size smaller then limit
      file.mv(`./media/video/${filename}.mp4`, function(err){
        if (err) { 
          res.send("error-has-accured");
        } else { 
          downloadUploadedVideo(`./media/video/${filename}.mp4`, filename, fileMimeType, res);
        }
      });
    }
  }
}

// download full video
async function downloadUploadedVideo(videofile, fileName, fileMimeType, res) {
  const command = new ffmpeg(); 
  const compressUploadedVideo = userSettings.checkIfVideoCompress("downloadUploadedVideo");
  const filepath = "media/video/"; 
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const path = newFilePath+fileName+fileType; 
  const videoDetails = await videoData.findVideosByID(fileName);
  const ffmpegAvaiable = ffmpegPath.checkIfFFmpegFFprobeExits();
  if (ffmpegAvaiable == "ffmpeg-ffprobe-exits") {  
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {  
          res.json("downloading-uploaded-video");
          videoData.updateVideoData([`${fileName}`], {
            video:{
              originalVideoSrc : "unknown",
              originalVideoType : fileMimeType,
              download : "starting uploaded video download"
            }
          });
          
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          } else {
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`], {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            });
          }

        })
        .on("progress", function(data) { 
          console.log("progress", data);

          videoData.updateVideoData([`${fileName}`, "video", "download"], data.percent);

          if(data.percent < 0){ 
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "0.00%");
          }else{
            try {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent.toFixed(2)}%`);
            } catch (error) {
              currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], `${data.percent}%`);
            }
          }           
        })
        .on("end", function() { 
          /// encoding is complete, so callback or move on at this point
          if (compressUploadedVideo) { // addition of compress video data
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : videofile,
                originalVideoType: fileMimeType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              compression : {
                download: "starting"
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          } else {
            videoData.updateVideoData([`${fileName}`], {
              video: {
                originalVideoSrc : videofile,
                originalVideoType: fileMimeType,
                path: newFilePath+fileName+fileType,
                videoType : "video/mp4",
                download : "completed",
              },
              thumbnail: {
                path: {},
                download: "starting"
              }
            });
          }

          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "video", "download-status"], "completed");
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "compression", "download-status"], "starting video compression");              
          }
          currentDownloadVideos.updateCurrentDownloadVideos([`${fileName}`, "thumbnail", "download-status"], "starting thumbnail download"); 

          console.log("Video Transcoding succeeded !");
          if (compressUploadedVideo) { // compress video
            compression_VP9(path, newFilePath, fileName);
          }
          createThumbnail(path, newFilePath, fileName); 

          deleteOrignialUploadedVideoFile(videofile, fileName);
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadUploadedVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            deleteOrignialUploadedVideoFile(videofile, fileName);
            // delete created folder
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            deleteOrignialUploadedVideoFile(videofile, fileName);
            res.json("ffmpeg-failed");
          }
        })
        .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else { 
        console.log("videoDetails already exists");
      }   
  } else {
    deleteOrignialUploadedVideoFile(videofile, fileName);
    res.json(ffmpegAvaiable);
  }
}

function deleteOrignialUploadedVideoFile(videofile, fileName) { 
    if (FileSystem.existsSync(videofile)) { 
        // move video file to deleted-videos folder
        // if video is active it will make the video not viewable if someone wants to view it
        FileSystem.rename(videofile, `media/deleted-videos/deleted-${fileName}.mp4`,  (err) => {
            if (err) throw err;  
            console.log("moved video thats going to be deleted");
            //  delete the video
            FileSystem.unlink(`media/deleted-videos/deleted-${fileName}.mp4`, (err) => {
                if (err) throw err;
                console.log("deleted video");
            });  
        });
    } 
}

module.exports = { // export modules
  checkIfVideoSrcOriginalPathExits,
  stopCommpressedVideoDownload,
  stopDownloadVideoStream,
  downloadVideoStream,
  downloadVideo,
  trimVideo,
  getVideoLinkFromUrl,
  cheackForAvailabeUnFinishedVideoDownloads,
  completeUnfinnishedVideoDownload,
  uploadVideoFile
};
