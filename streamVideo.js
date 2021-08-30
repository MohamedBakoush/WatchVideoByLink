"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const youtubedl = require("youtube-dl");
const user_settings = FileSystem.readFileSync("data/user-settings.json");
let userSettings = JSON.parse(user_settings);
const data_videos  = FileSystem.readFileSync("data/data-videos.json");
let videoData = JSON.parse(data_videos);
const available_videos  = FileSystem.readFileSync("data/available-videos.json");
let availableVideos = JSON.parse(available_videos);
const current_download_videos = FileSystem.readFileSync("data/current-download-videos.json");
let currentDownloadVideos = JSON.parse(current_download_videos);
const ffprobe_path = "./ffprobe.exe";
const ffmpeg_path = "./ffmpeg.exe";
const untrunc_path = "untrunc.exe";

// check if id provided is corresponding to videos
function findVideosByID(id){
  if (videoData[id] === undefined) { // if id is invalid
    return undefined;
  } else { // if valid return videos[id]
    return videoData[id];
  }
}

// updates video data by for provided id
function updateVideoDataByID(videoID, Data){
  videoData[videoID] = Data;
  const newVideoData = JSON.stringify(videoData, null, 2);
  FileSystem.writeFileSync("data/data-videos.json", newVideoData);
  return videoData[videoID];
}

// deletes video data by for provided id
function deleteVideoDataByID(videoID){ 
  if (findVideosByID(videoID) !== undefined) {
    delete videoData[videoID]; 
    const newVideoData = JSON.stringify(videoData, null, 2);
    FileSystem.writeFileSync("data/data-videos.json", newVideoData);
    return `Deleted ${videoID}`; 
  } else {
    return `${videoID} Unavaiable`; 
  }
}

// returns all availableVideos data
function getAllAvailableVideos(){
  return availableVideos;
}

// returns current video downloads
function currentDownloads(){
  return currentDownloadVideos;
}

// check if id provided is corresponding to video download
function findCurrentDownloadByID(id){
  if (currentDownloadVideos[id] === undefined) { // if id is invalid
    return undefined;
  } else { // if valid return videos[id]
    return currentDownloadVideos[id];
  }
}

// deletes current video downloads by for provided id
function updateCurrentDownloadByID(videoID, Data){
  currentDownloadVideos[videoID] = Data;
  const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
  FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
  return currentDownloadVideos[videoID];
}

// deletes video download data by for provided id
function deleteCurrentDownloadByID(videoID){  
  if (findCurrentDownloadByID(videoID) !== undefined) {
    delete currentDownloadVideos[videoID]; 
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
    return `Deleted ${videoID}`;  
  } else {
    return `${videoID} Unavaiable`; 
  }
}

// Restore a damaged (truncated) mp4 provided a similar not broken video is available
function untrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending){
  if(FileSystem.existsSync(fileName_original_ending) == true){  
    exec(`${untrunc_path} ./media/working-video/video.mp4 ./media/video/${fileName}/${fileName}.mp4`, (error, stdout, stderr) => {
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
        exec(`${untrunc_path} ./media/working-video/video.mp4 ./media/video/${fileName}/${fileName}.mp4`, (error, stdout, stderr) => {
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
    deleteAllData(fileName);       
  }
}

// Download video after Untrunc
function downloadVideoAfterUntrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending){
  ffmpeg.ffprobe(fileName_fixed_ending, (error, metadata) => {   
    // update currentDownloadVideos
    currentDownloadVideos[`${fileName}`] = {
      video : { 
        "download-status" : "Untrunc"
      },
      thumbnail : { 
        "download-status" : "waiting for video"
      } 
    };
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
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
                    videoData[`${fileName}`] = {
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
                    };

                    const newData = JSON.stringify(videoData, null, 2);
                    FileSystem.writeFileSync("data/data-videos.json", newData);
                    
                    currentDownloadVideos[`${fileName}`] = {
                      video : { 
                        "download-status" : "completed"
                      },
                      thumbnail : { 
                        "download-status" : "starting thumbnail download"
                      } 
                    };
                    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
                    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  

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
  if(Object.keys(currentDownloads()).length !== 0){  // if there is available data in currentDownloads()
    Object.keys(currentDownloads()).forEach(function(fileName) { // for each currentDownloads get id as fileName 
      // assign download status variable if available with correct progress status
      let videoProgress, thumbnailProgress, compressionProgress;
      if (currentDownloadVideos[fileName]["video"]) {
        videoProgress = currentDownloadVideos[fileName]["video"]["download-status"];  
      } else {
        videoProgress = false;
      }
      if (currentDownloadVideos[fileName]["thumbnail"]) {
        thumbnailProgress = currentDownloadVideos[fileName]["thumbnail"]["download-status"];  
      } else {
        thumbnailProgress = false;
      } 
      if (currentDownloadVideos[fileName]["compression"]) {
        compressionProgress = currentDownloadVideos[fileName]["compression"]["download-status"];  
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
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg and ffprobe unavailable";   
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg and ffprobe unavailable";  
              } else{       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg and ffprobe unavailable";  
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg and ffprobe unavailable";   
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              if (thumbnailProgress == "completed" && compressionProgress !== "completed") {   
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg unavailable"; 
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg unavailable";
              } else{       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg unavailable"; 
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg unavailable";
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);           
            } else if(thumbnailProgress == "completed" && compressionProgress == "completed"){ // delete data (no longer needed)            
              delete currentDownloadVideos[`${fileName}`]; 
              const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              if (thumbnailProgress == "completed" && compressionProgress !== "completed") {   
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffprobe unavailable";  
              } else if (thumbnailProgress !== "completed" && compressionProgress == "completed") {       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffprobe unavailable";  
              } else{       
                currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffprobe unavailable";  
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffprobe unavailable";  
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(thumbnailProgress == "completed" && compressionProgress !== "completed"){ 
              // update thumbanil unfinnished & compression completed              
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "completed"; 
              currentDownloadVideos[fileName]["compression"]["download-status"] = "unfinished download"; 
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
            } else if(thumbnailProgress !== "completed" && compressionProgress == "completed"){ 
              // update thumbanil unfinnished & compression completed              
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "unfinished download"; 
              currentDownloadVideos[fileName]["compression"]["download-status"] = "completed"; 
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
            } else { // update thumbanil & compression is unfinnished              
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "unfinished download"; 
              currentDownloadVideos[fileName]["compression"]["download-status"] = "unfinished download"; 
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
            }
          } else if (thumbnailProgress && !compressionProgress) {
            // thumbnail true compression false 
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg and ffprobe unavailable";  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg unavailable";  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffprobe unavailable";  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(thumbnailProgress == "completed"){ // delete data (no longer needed)       
              delete currentDownloadVideos[`${fileName}`]; 
              const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
            } else{ // update thumbanil is unfinnished
              currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "unfinished download";
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
            }
          } else if (!thumbnailProgress && compressionProgress) {
            // thumbnail false compression true 
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg and ffprobe unavailable"};
              } else{       
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg and ffprobe unavailable"};
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg and ffprobe unavailable";    
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg unavailable"};
              } else{       
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg unavailable"};
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffmpeg unavailable";     
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              if (compressionProgress == "completed") {    
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffprobe unavailable"};
              } else{       
                currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffprobe unavailable"};
                currentDownloadVideos[fileName]["compression"]["download-status"] = "ffprobe unavailable";      
              }  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(compressionProgress == "completed"){ // delete data (no longer needed)      
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "unfinished download"};
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else { // update thumbanil & compression is unfinnished 
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "unfinished download"};
              currentDownloadVideos[fileName]["compression"]["download-status"] = "unfinished download";    
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            }
          } else {
            // thumbnail false compression false  
            if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg and ffprobe unavailable"};
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffmpeg unavailable"}; 
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "ffprobe unavailable"}; 
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
            } else{ // update thumbanil is unfinnished
              currentDownloadVideos[fileName]["thumbnail"] = {"download-status": "unfinished download"};
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
            } 
          }
        }  else if(currentDownloadVideos[fileName]["video"]["download-status"] == "starting stream download" ||
                  currentDownloadVideos[fileName]["video"]["download-status"] == "starting full video download" ||
                  currentDownloadVideos[fileName]["video"]["download-status"] == "starting trim video download" ||
                  currentDownloadVideos[fileName]["video"]["download-status"] == "starting uploaded video download" ||
                  currentDownloadVideos[fileName]["video"]["download-status"] == "0.00%"
                  ){ // if the video download hasn't started
                deleteAllData(fileName);          
          } else if(!FileSystem.existsSync(untrunc_path)){//update untrunc is unavailable
            currentDownloadVideos[fileName]["video"]["download-status"] = "untrunc unavailable";  
            const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
            FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
          } else if(!FileSystem.existsSync("./media/working-video/video.mp4")){//update working-video/video.mp4 is unavailable
            currentDownloadVideos[fileName]["video"]["download-status"] = "working video for untrunc is unavailable";  
            const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
            FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
          } else{ // update video is unfinnished
            currentDownloadVideos[fileName]["video"]["download-status"] = "unfinished download";
            const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
            FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
          }
      } else {
        deleteAllData(fileName);    
      }
    });  
  }
}

// finnish download video/thumbnail (if not completed) when the application get started 
function completeUnfinnishedVideoDownload(req){ 
  const fileName = req.body.id; 
  const filepath = "media/video/";
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`; 
  const path = newFilePath+fileName+fileType;
  let videoProgressCompleted, thumbnailProgressCompleted, compressionProgressCompleted;
  try { // if videoProgress exits and is complete return true else false
    if (currentDownloadVideos[fileName]["video"]["download-status"] == "completed") {
      videoProgressCompleted = true;
    } else {
      videoProgressCompleted = false;
    }
  } catch (error) {
    videoProgressCompleted = false;
  }
  try { // if thumbnailProgress exits and is complete return true else false
    if (currentDownloadVideos[fileName]["thumbnail"]["download-status"] == "completed") {
      thumbnailProgressCompleted = true;
    } else {
      thumbnailProgressCompleted = false;
    }
  } catch (error) {
    thumbnailProgressCompleted = false;
  }
  try { // if compressionProgress exits and is complete return true else false
    if (currentDownloadVideos[fileName]["compression"]["download-status"] == "completed") {
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
      delete currentDownloadVideos[`${fileName}`]; 
      const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
      FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
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
      if (currentDownloadVideos[fileName]["compression"] == undefined) { // redownload thumbnails 
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

// if video videoId is valid then stream video
async function streamVideo(request, response, videoID, displayCompressedVideo){
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else { // if videoID is valid
    try {
      // variables
      let videoPath, videoType;
      if (displayCompressedVideo) { // update videoPath, videoType with compressed video details
        videoPath = videoDetails.compression.path; 
        videoType = videoDetails.compression.videoType; 
      } else { // update videoPath, videoType with original video details
        videoPath = videoDetails.video.path; 
        videoType = videoDetails.video.videoType; 
      }
      // getting the video file size
      const stat = FileSystem.statSync(videoPath);
      const fileSize = stat.size;
      // requests occur when a client asks the server for only a portion of the requested file.
      const range = request.headers.range;
      // send partial content of video file
      if (range) {
        // split up beginning and end of request range
        const parts = range.replace(/bytes=/, "").split("-");
        // beginning of the request range
        const start = parseInt(parts[0], 10);
        // end of the requested range
        const end = parts[1]
          ? parseInt(parts[1], 10) // if
          : fileSize-1; // else
        // when video start file size is greater or equal to video file Size
        // send 416 error
        if(start >= fileSize) {
          response.status(416).send("Requested range not satisfiable\n"+start+" >= "+fileSize);
          return;
        }
        // The size of the chunks
        const chunksize = (end-start)+1;
        // Creating the stream
        const file = FileSystem.createReadStream(videoPath, {start, end});
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type":  videoType,
        };
        // send newly made stream to the client
        response.writeHead(206, head);
        file.pipe(response);
      } else { // send whole video file
        const head = {
          "Content-Length": fileSize,
          "Content-Type":  videoType,
        };
        response.writeHead(200, head);
        FileSystem.createReadStream(videoPath).pipe(response);
      }
    } catch (e) { // if error redirect to home page
      response.status(404).redirect("/");
    }
  }
}

// streams available thumbnail images  provided by videoID and thumbnailID
async function streamThumbnail(request, response, videoID, thumbnailID) {
  const videoDetails = await findVideosByID(videoID);
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  }else {
    try {
      const path = videoDetails["thumbnail"]["path"][`${thumbnailID}`];
      const file = FileSystem.createReadStream(path); // or any other way to get a readable stream
      const ps = new stream.PassThrough(); // <---- this makes a trick with stream error handling
      stream.pipeline(
       file,
       ps, // <---- this makes a trick with stream error handling
       (err) => {
        if (err) {
          console.log(err); // No such file or any other kind of error
          return response.sendStatus(400);
        }
      });
      ps.pipe(response); // <---- this makes a trick with stream error handling
    } catch (e) {
      response.status(404).redirect("/");
    }
  }
}

// update video player volume settings
function updateVideoPlayerVolume(req, res) {
  try { // update video volume settings
    const videoPlayerVolume = req.body.updatedVideoPlayerVolume;
    const videoPlayerMuted = req.body.updatedVideoPlayerMuted;     

    userSettings["videoPlayer"].volume = videoPlayerVolume;
    userSettings["videoPlayer"].muted = videoPlayerMuted;

    const newUserSettings = JSON.stringify(userSettings, null, 2);
    FileSystem.writeFileSync("data/user-settings.json", newUserSettings);  

    res.json("updated-video-player-volume");
  } catch (e) { // failed to update video volume settings
    res.json("failed-to-update-video-player-volume");
  }
}

// get video player settings
function getVideoPlayerSettings() { 
  return userSettings["videoPlayer"];
}

// ends ffmpeg (finishes download video)
const stop = (command) => {
  return command.ffmpegProc.stdin.write("q");
};

// ends ffmpeg forcefully
const SIGKILL = (command) => {
  return command.kill("SIGKILL");
};

let fileNameID;
let stopVideoFileBool = false;
function stopDownloadVideoStream(req, res) {
   stopVideoFileBool = req.body.bool;
   fileNameID = req.body.fileNameID;
   res.json("stopedVideoFileFromDownloading");
}

// downloads live video stream
async function downloadVideoStream(req, res) {
  const command = new ffmpeg();
  const videofile = req.body.videoSrc;

  let compressVideoStream;
  try { // userSettings.download.compression.downloadVideoStream exists 
    if (userSettings.download.compression.downloadVideoStream == true) {
      compressVideoStream = true; 
    } else {
      compressVideoStream = false;
    }
  } catch (error) { // userSettings.download.compression.downloadVideoStream doesn't exists
    compressVideoStream = false; 
  }

  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await findVideosByID(fileName);
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          /// log something maybe
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting stream download"
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          
          if (compressVideoStream) { // addition of compress video data
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting stream download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else {
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting stream download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          }
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);    
        })
        .on("progress", function(data) {
          console.log("progress", data);

          if(videoData[`${fileName}`]["video"]["download"] !== "downloading"){
            videoData[`${fileName}`]["video"]["timemark"] = data.timemark; 
            videoData[`${fileName}`]["video"]["download"] = "downloading"; 
          } else {
            videoData[`${fileName}`]["video"]["timemark"] = data.timemark; 
          } 
          
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          
          currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  data.timemark;  

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);    
          
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
            videoData[`${fileName}`] = {
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
            };
          } else {
            videoData[`${fileName}`] = {
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
            };
          }
          const newData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newData);
          
          currentDownloadVideos[`${fileName}`]["video"]["download-status"] = "completed";
          if (compressVideoStream) { // addition of compress video data
            currentDownloadVideos[`${fileName}`]["compression"]["download-status"] =  "starting video compression";    
          }
          currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] = "starting thumbnail download"; 

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  

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
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
  }
}

// download full video
async function downloadVideo(req, res) {
  const command = new ffmpeg();
  const videoSrc = req.body.videoSrc;
  let videofile;
  try {
    if (videoSrc.includes("/video/")) { // if videoSrc includes /video/, split src at /video/ and attempt to findVideosByID
      const videoDetails = await findVideosByID(videoSrc.split("/video/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        videofile = videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          videofile = videoDetails.video.path;  
        } else { // videofile = inputted videos src 
          videofile = videoSrc;
        } 
      }
    } else if (videoSrc.includes("/compressed/")) {
      const videoDetails = await findVideosByID(videoSrc.split("/compressed/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        videofile = videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          videofile = videoDetails.video.path;
        } else { // videofile = inputted videos src 
          videofile = videoSrc;
        } 
      }
    } else { // videofile = inputted videos src  
      videofile = videoSrc;
    } 
  } catch (error) { // videofile = inputted videos src 
    videofile = videoSrc;
  } 
  
  let compressVideo;
  try { // userSettings.download.compression.downloadVideo exists 
    if (userSettings.download.compression.downloadVideo == true) {
      compressVideo = true; 
    } else {
      compressVideo = false;
    }
  } catch (error) { // userSettings.download.compression.downloadVideo doesn't exists
    compressVideo = false; 
  }

  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await findVideosByID(fileName);
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              download : "starting full video download"
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          if (compressVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting full video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else {
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting full video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          }
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 

        })
        .on("progress", function(data) {
          console.log("progress", data);

          videoData[`${fileName}`]["video"]["download"] = data.percent; 

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          if(data.percent < 0){ 
            currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "0.00%";  
          }else{
            try {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent.toFixed(2)}%`;  
            } catch (error) {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent}%`;  
            }
          } 
          
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 
        })
        .on("end", function() {
          /// encoding is complete, so callback or move on at this point
          if (compressVideo) { // addition of compress video data
            videoData[`${fileName}`] = {
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
            };
          } else {
            videoData[`${fileName}`] = {
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
            }; 
          }
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "completed";
          if (compressVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`]["compression"]["download-status"] =  "starting video compression";                 
          }
          currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  "starting thumbnail download";    

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  

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
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
  }
}

// downlaod trimed video
async function trimVideo(req, res) {
  const command = new ffmpeg();
  const videoSrc = req.body.videoSrc;
  let videofile;
  try {
    if (videoSrc.includes("/video/")) { // if videoSrc includes /video/, split src at /video/ and attempt to findVideosByID
      const videoDetails = await findVideosByID(videoSrc.split("/video/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        videofile = videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          videofile = videoDetails.video.path;  
        } else { // videofile = inputted videos src 
          videofile = videoSrc;
        } 
      }
    } else if (videoSrc.includes("/compressed/")) {
      const videoDetails = await findVideosByID(videoSrc.split("/compressed/")[1]);
      if (videoDetails === undefined) { // videofile = inputted videos src
        videofile = videoSrc;
      } else {
        if (videoDetails.video.path) { // original video path 
          videofile = videoDetails.video.path;  
        } else { // videofile = inputted videos src 
          videofile = videoSrc;
        } 
      }
    } else { // videofile = inputted videos src  
      videofile = videoSrc;
    } 
  } catch (error) { // videofile = inputted videos src 
    videofile = videoSrc;
  } 

  let compressTrimedVideo;
  try { // userSettings.download.compression.trimVideo exists 
    if (userSettings.download.compression.trimVideo == true) {
      compressTrimedVideo = true; 
    } else {
      compressTrimedVideo = false;
    }
  } catch (error) { // userSettings.download.compression.trimVideo doesn't exists
    compressTrimedVideo = false; 
  }
  
  const start = req.body.newStartTime;
  const end = req.body.newEndTime;
  const filepath = "media/video/";
  const fileName = uuidv4();
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const videoDetails = await findVideosByID(fileName);
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {
          res.json(fileName);
          videoData[`${fileName}`] = {
            video:{
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              newVideoStartTime: req.body.newStartTime,
              newVideoEndTime: req.body.newEndTime,
              download : "starting trim video download"
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          
          if (compressTrimedVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting trim video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else {
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting trim video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          }
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 
        
        })
        .on("progress", function(data) {
          console.log("progress", data);

          videoData[`${fileName}`]["video"]["download"] = data.percent; 
          
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          if(data.percent < 0){ 
            currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "0.00%";  
          }else{
            try {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent.toFixed(2)}%`;   
            } catch (error) {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent}%`;    
            }
          } 

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
        })
        .on("end", function() {
          if (compressTrimedVideo) { // addition of compress video data
            videoData[`${fileName}`] = {
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
            };
          } else {
            videoData[`${fileName}`] = {
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
            };
          }
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
     
          currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "completed";
          if (compressTrimedVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`]["compression"]["download-status"] =  "starting video compression";  
          }        
          currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  "starting thumbnail download";

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  

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
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
    res.json("Cannot-find-ffprobe");
  }
}

// creates images from provided video
async function createThumbnail(videofile, newFilePath, fileName) {
  const imageFileName = "thumbnail";
  const fileType = ".jpg";
  const numberOfImages = 8;
  let duration = 0;
  let numberOfCreatedScreenshots = 0;
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
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
              // update numberOfCreatedScreenshots
              numberOfCreatedScreenshots = data.frames; 
  
              if(data.percent < 0){ // if data.percent is less then 0 then show 0.00%
                videoData[`${fileName}`]["thumbnail"].download =  0.00;
                currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  "0.00%"; 
              }else{ //update data with with data.percent
                try {
                  videoData[`${fileName}`]["thumbnail"].download =  data.percent;
                  currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  `${data.percent.toFixed(2)}%`;  
                } catch (error) {
                  videoData[`${fileName}`]["thumbnail"].download =  data.percent;
                  currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  `${data.percent}%`;    
                }
              }
              // update data to database
              const newVideoData = JSON.stringify(videoData, null, 2);
              FileSystem.writeFileSync("data/data-videos.json", newVideoData); 
  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
  
              console.log("progress", data);
            })
            .on("end", () => {
              // encoding is complete
              for (let i = 0; i < numberOfCreatedScreenshots + 1; i++) {
                if (i == 0){
                  try {
                    if (availableVideos[`${fileName}`]["info"]) {
                      availableVideos[`${fileName}`]["info"].thumbnailLink = {  
                      };
                    } else {
                      availableVideos[`${fileName}`] = {
                        info:{
                          title: fileName,
                          videoLink: {
                            src : `/video/${fileName}`,
                            type : "video/mp4"
                          },
                          thumbnailLink: {
                          }
                        }
                      }; 
                    }
                  } catch (error) {
                    availableVideos[`${fileName}`] = {
                      info:{
                        title: fileName,
                        videoLink: {
                          src : `/video/${fileName}`,
                          type : "video/mp4"
                        },
                        thumbnailLink: {
                        }
                      }
                    }; 
                  }
                } else if (i < 10) {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}00${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                } else if (i < 100) {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}0${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                } else {
                  videoData[`${fileName}`]["thumbnail"].path[i] = `${newFilePath}${imageFileName}${i}${fileType}`;
                  availableVideos[`${fileName}`].info.thumbnailLink[i] = `/thumbnail/${fileName}/${i}`;
                }
                if (i == numberOfCreatedScreenshots) {
                  videoData[`${fileName}`]["thumbnail"].download = "completed";
                }
              }

              const newVideoData = JSON.stringify(videoData, null, 2);
              FileSystem.writeFileSync("data/data-videos.json", newVideoData);

              const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
              FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
              console.log("Image Thumbnails succeeded !");
              
              if(currentDownloadVideos[`${fileName}`]["compression"] === undefined || currentDownloadVideos[`${fileName}`]["compression"]["download-status"] === "completed") { 
                delete currentDownloadVideos[`${fileName}`]; 
              } else  {  
                currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] = "completed"; 
              } 
      
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
  
            })
            .on("error", (error) => {
                /// error handling
                console.log(`Encoding Error: ${error.message}`);
            })
            .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
            .output(`${newFilePath}${imageFileName}%03d${fileType}`)
            .run();
      } else { // duration less or equal to 0
        try { // delete data
          if (videoData[`${fileName}`] || currentDownloadVideos[`${fileName}`]) { // if videodata and currentDownloadVideos is avaiable 
            // delete all data
            deleteAllData(fileName);
          } 
        } catch (error) { // an error has occurred
          console.log(error);
        } 
      }
    }); 
  } else if(!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg and ffprobe is  unavailable
    currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg and ffprobe unavailable";  
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
  } else if(!FileSystem.existsSync(ffmpeg_path)){ //update ffmpeg is  unavailable
    currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffmpeg unavailable";  
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
  } else if(!FileSystem.existsSync(ffprobe_path)){ //update ffprobe is  unavailable
    currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "ffprobe unavailable";  
    const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
  }
}

let fileNameID_Compression;
let stopCompressedVideoFileBool = false; 
// check if video compression is downloading
// if true then update stopCompressedVideoFileBool and fileNameID_Compression variable and return true
// else return false
function stopCommpressedVideoDownload(bool, fileNameID) { 
  try {
    if (videoData[fileNameID]["compression"]) {
      if (videoData[fileNameID]["compression"]["download"] == "completed") {   
        return false;
      } else if(currentDownloadVideos[fileNameID]){
        if(currentDownloadVideos[fileNameID]["compression"]){
          if (currentDownloadVideos[fileNameID]["compression"]["download-status"] == "completed"
            || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffmpeg and ffprobe unavailable"
            || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffmpeg unavailable"
            || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffprobe unavailable"
            || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "unfinished download") {
            return false;
          } else {
            stopCompressedVideoFileBool = bool;
            fileNameID_Compression = fileNameID; 
            return true;
          }
        }else {
          return false;
        }  
      } else {
        stopCompressedVideoFileBool = bool;
        fileNameID_Compression = fileNameID; 
        return true;
      }   
    } else if(currentDownloadVideos[fileNameID]){
      if(currentDownloadVideos[fileNameID]["compression"]){
        if (currentDownloadVideos[fileNameID]["compression"]["download-status"] == "completed"
          || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffmpeg and ffprobe unavailable"
          || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffmpeg unavailable"
          || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffprobe unavailable"
          || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "unfinished download") {
          return false;
        } else {
          stopCompressedVideoFileBool = bool;
          fileNameID_Compression = fileNameID; 
          return true;
        }
      }else {
        return false;
      }  
    } else {
      return false;
    } 
  } catch (e) {
    return false;
  }
}

// VP9 video compression - make video size smaller
async function compression_VP9(videofile, newFilePath, fileName) {
  const command = new ffmpeg();
  const fileType = ".webm";
  let duration = 0;
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists 
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
            videoData[`${fileName}`]["compression"]["download"] = data.percent;       
            const newVideoData = JSON.stringify(videoData, null, 2);
            FileSystem.writeFileSync("data/data-videos.json", newVideoData);

            if(data.percent < 0){
              currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = "0.00%";    
              console.log(`${fileName} compression-download-status: 0.00%`);
            } else if(data.percent == "undefined"){
              currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = `${data.percent}%`;    
              console.log(`${fileName} compression-download-status: ${data.percent}%`);
            } else{
              try { 
                currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = `${data.percent.toFixed(2)}%`; 
                console.log(`${fileName} compression-download-status: ${data.percent.toFixed(2)}%`);
              } catch (error) {
                currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = `${data.percent}%`; 
                console.log(`${fileName} compression-download-status: ${data.percent}%`);
              }
            }  

            const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
            FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);

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
              if (availableVideos[`${fileName}`]["info"]) {
                availableVideos[`${fileName}`]["info"]["videoLink"].compressdSrc = `/compressed/${fileName}`;  
                availableVideos[`${fileName}`]["info"]["videoLink"].compressedType = "video/webm";
              } else{
                availableVideos[`${fileName}`] = {
                  info:{
                    title: fileName,
                    videoLink: {
                      src : `/video/${fileName}`,
                      type : "video/mp4",
                      compressdSrc : `/compressed/${fileName}`,
                      compressedType : "video/webm"
                    }
                  }
                };
              }              
            } catch (error) {
              availableVideos[`${fileName}`] = {
                info:{
                  title: fileName,
                  videoLink: {
                    src : `/video/${fileName}`,
                    type : "video/mp4",
                    compressdSrc : `/compressed/${fileName}`,
                    compressedType : "video/webm"
                  }
                }
              };
            } 
            const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
            FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
        
            videoData[`${fileName}`]["compression"] = { 
              path: newFilePath+fileName+fileType,
              videoType: "video/webm",
              download: "completed"
            };           
            const newVideoData = JSON.stringify(videoData, null, 2);
            FileSystem.writeFileSync("data/data-videos.json", newVideoData);

            if(currentDownloadVideos[`${fileName}`]["thumbnail"] === undefined || currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] === "completed") { 
              delete currentDownloadVideos[`${fileName}`]; 
            } else  {  
              currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = "completed"; 
            }            
            const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
            FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
          })
          .on("error", function(error) {
            /// error handling
            if (error.message === "ffmpeg was killed with signal SIGKILL") {
              if (videoData[`${fileName}`]["compression"]) {              
                videoData[`${fileName}`]["compression"]["download"] = "ffmpeg was killed with signal SIGKILL";   
                const newVideoData = JSON.stringify(videoData, null, 2);
                FileSystem.writeFileSync("data/data-videos.json", newVideoData);
              }  
              if (currentDownloadVideos[`${fileName}`]["compression"]) {         
                currentDownloadVideos[`${fileName}`]["compression"]["download-status"] = "ffmpeg was killed with signal SIGKILL"; 
                const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
                FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
              } 
            }
          })
          // https://developers.google.com/media/vp9/settings/vod/
          .outputOptions(["-c:v libvpx-vp9", "-crf 32", "-b:v 2000k"])
          .output(`${newFilePath}${fileName}${fileType}`)
          .run(); 
      } else { 
        try { // duration less or equal to 0
          if (videoData[`${fileName}`] || currentDownloadVideos[`${fileName}`]) { // if videodata and currentDownloadVideos is avaiable 
            // delete all data
            deleteAllData(fileName);
          } 
        } catch (error) { // an error has occurred
          console.log(error); 
        } 
      }
    }); 
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory"); 
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory"); 
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory"); 
  }
}

// check if video compression is downloading before data deletion 
function checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(request, response, videoID) {
      // stop video compression
      const stopCommpressedVideoDownloadBool = stopCommpressedVideoDownload(true, videoID); 
      if (stopCommpressedVideoDownloadBool) {
        const checkDownloadStatus = setInterval( function(){ 
          // try untill compressed video gets killed with signal SIGKILL or finnishes download 
          try { 
            if (videoData[videoID]["compression"]) {
              if (videoData[videoID]["compression"]["download"] == "completed" 
              || videoData[videoID]["compression"]["download"] == "ffmpeg was killed with signal SIGKILL") {  
                // stop interval and start data deletion when videoData is completed or ffmpeg was killed with signal SIGKILL
                clearInterval(checkDownloadStatus); 
                deletevideoData(request, response, videoID);
              } else if(currentDownloadVideos[videoID]["compression"]){
                if (currentDownloadVideos[videoID]["compression"]["download-status"] == "completed"
                || currentDownloadVideos[fileNameID]["compression"]["download-status"] == "ffmpeg was killed with signal SIGKILL") {  
                  // stop interval and start data deletion when currentDownloadVideos is completed or ffmpeg was killed with signal SIGKILL
                  clearInterval(checkDownloadStatus); 
                  deletevideoData(request, response, videoID);
                } 
              } 
            } else { // stop interval and start data deletion
              clearInterval(checkDownloadStatus);            
              deletevideoData(request, response, videoID);
            }
          } catch (e) { // error occurs 
            console.log(e);  
          }
        }, 500); 
      } else { // compressed video isn't downloading
        deletevideoData(request, response, videoID);
      }
}

// deletes everything that is available in the system related to video id, video file, all available video data ...
async function deletevideoData(request, response, videoID) {
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else {
    try {  
      // delete video data from database
      // delete videoData from database 
      // eslint-disable-next-line no-prototype-builtins
      if(videoData.hasOwnProperty(videoID)){  
        delete videoData[videoID];
        const newVideoData = JSON.stringify(videoData, null, 2);
        FileSystem.writeFileSync("data/data-videos.json", newVideoData);
      }
      // delete availableVideos from database 
      // eslint-disable-next-line no-prototype-builtins
      if(availableVideos.hasOwnProperty(videoID)){ 
        delete availableVideos[videoID];
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
      }
      // delete currentDownloadVideos from database
      // eslint-disable-next-line no-prototype-builtins
      if(currentDownloadVideos.hasOwnProperty(videoID)){ 
        delete currentDownloadVideos[videoID];
        const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
        FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
      }
      // check if folder exists
      if(FileSystem.existsSync(`./media/video/${videoID}`)){ 
        FileSystem.readdir(`./media/video/${videoID}`, function(err, files) {
          if (err) throw err;  
          if (!files.length) {
            // directory empty, delete folder           
            FileSystem.rmdir(`./media/video/${videoID}`, (err) => {
              if (err) throw err; 
              console.log(`${videoID} folder deleted`);      
              response.json(`video-id-${videoID}-data-permanently-deleted`);
            }); 
          } else{ 
            // folder not empty
            FileSystem.readdir(`./media/video/${videoID}`, (err, files) => {
              if (err) throw err;
              let completedCount = 0;
              for (const file of files) {   
                FileSystem.rename(`./media/video/${videoID}/${file}`, `media/deleted-videos/deleted-${file}`,  (err) => {
                  if (err) throw err;  
                  console.log(`moved ./media/video/${videoID}/${file} to media/deleted-videos/deleted-${file}`);
                  // delete the video
                  FileSystem.unlink(`media/deleted-videos/deleted-${file}`, (err) => {
                    if (err) throw err;
                    console.log(`unlinked media/deleted-videos/deleted-${file} file`); 
                    completedCount += 1; 
                    if(files.length === completedCount){// if file length is same as completedCount then delete folder
                      // reset completedCount 
                      completedCount = 0; 
                      // delete folder
                      FileSystem.rmdir(`./media/video/${videoID}`, (err) => {
                        if (err) throw err; 
                        console.log(`${videoID} folder deleted`);
                        response.json(`video-id-${videoID}-data-permanently-deleted`);
                      }); 
                    }
                  }); 
                });
              }
            });
          }          
        });
      } else{ 
        // folder dosent exit 
        console.log(`${videoID} folder dosent exit`);
        response.json(`video-id-${videoID}-data-permanently-deleted`);
      } 
    } catch (e) {
      response.json(`video-id-${videoID}-data-failed-to-permanently-deleted`); 
      console.log(`${videoID} failed to delete`);
    }
  }
}

// deletes all video id data
function deleteAllData(fileName) {
  // delete currentDownloadVideos from server if exist
  // eslint-disable-next-line no-prototype-builtins
  if(currentDownloadVideos.hasOwnProperty(fileName)){  
    delete currentDownloadVideos[`${fileName}`]; 
    const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
    FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);
  }
  // delete videoData from server if exist
  // eslint-disable-next-line no-prototype-builtins
  if (videoData.hasOwnProperty(fileName)) {
    delete videoData[`${fileName}`]; 
    const deleteVideoData = JSON.stringify(videoData, null, 2);
    FileSystem.writeFileSync("data/data-videos.json", deleteVideoData);
  }  
  // delete availableVideos from server if exist
  // eslint-disable-next-line no-prototype-builtins
  if(availableVideos.hasOwnProperty(fileName)){ 
    delete availableVideos[fileName];
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
  }
  try {
    // check if folder exists
    if(FileSystem.existsSync(`./media/video/${fileName}`)){ 
      FileSystem.readdir(`./media/video/${fileName}`, function(err, files) {
        if (err) throw err;  
        if (!files.length) {
          // directory empty, delete folder
          FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
            if (err) throw err; 
            console.log(`${fileName} folder deleted`); 
            return `video-id-${fileName}-data-permanently-deleted`;
          }); 
        } else{ 
          // folder not empty
          FileSystem.readdir(`./media/video/${fileName}`, (err, files) => {
            if (err) throw err;
            let completedCount = 0;
            for (const file of files) {
              completedCount += 1;
              FileSystem.rename(`./media/video/${fileName}/${file}`, `media/deleted-videos/deleted-${file}`,  (err) => {
                if (err) throw err;  
                console.log(`\n moved ./media/video/${fileName}/${file} to media/deleted-videos/deleted-${file}`);
                // delete the video
                FileSystem.unlink(`media/deleted-videos/deleted-${file}`, (err) => {
                  if (err) throw err;
                  console.log(`\n unlinked media/deleted-videos/deleted-${file} file`);  
                  if(files.length == completedCount){// if file length is same as completedCount then delete folder
                    // reset completedCount
                    completedCount = 0;
                    // delete folder
                    FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
                      if (err) throw err; 
                      console.log(`\n ${fileName} folder deleted`);
                      return `video-id-${fileName}-data-permanently-deleted`;
                    }); 
                  }
                }); 
              });
            }
          });
        }          
      });
    }  else{ 
      // folder dosent exit 
      console.log(`${fileName} folder dosent exit`);
      return `video-id-${fileName}-data-permanently-deleted`;
    }
  } catch (error) { 
    console.log(`${fileName} failed to delete`);
    return `video-id-${fileName}-data-failed-to-permanently-deleted`;
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

// change title of video
async function changeVideoTitle(req, res) { 
  const videoID = req.body.videoID;
  const newVideoTitle = req.body.newVideoTitle;

  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    res.status(404).redirect("/");
  } else { 
    try {
      availableVideos[videoID]["info"]["title"] = newVideoTitle;  
      const newAvailableVideos = JSON.stringify(availableVideos, null, 2);
      FileSystem.writeFileSync("data/available-videos.json", newAvailableVideos);   
      res.json("video-title-changed");
    } catch (e) {
      res.json("failed-to-change-video-title");
    }
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

  let compressUploadedVideo;
  try { // userSettings.download.compression.downloadUploadedVideo exists 
    if (userSettings.download.compression.downloadUploadedVideo == true) {
      compressUploadedVideo = true; 
    } else {
      compressUploadedVideo = false;
    }
  } catch (error) { // userSettings.download.compression.downloadUploadedVideo doesn't exists
    compressUploadedVideo = false; 
  }

  const filepath = "media/video/"; 
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`;
  const path = newFilePath+fileName+fileType; 
  const videoDetails = await findVideosByID(fileName);
  if (FileSystem.existsSync(ffprobe_path) && FileSystem.existsSync(ffmpeg_path)) { //files exists
    if (videoDetails == undefined) {
      if (!FileSystem.existsSync(`${filepath}${fileName}/`)){
          FileSystem.mkdirSync(`${filepath}${fileName}/`);
      }
      command.addInput(videofile)
        .on("start", function() {  
          res.json("downloading-uploaded-video");
          videoData[`${fileName}`] = {
            video:{
              originalVideoSrc : "unknown",
              originalVideoType : fileMimeType,
              download : "starting uploaded video download"
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              compression : { 
                "download-status" : "waiting for video"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else {
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "starting uploaded video download"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          }
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 

        })
        .on("progress", function(data) { 
          console.log("progress", data);

          videoData[`${fileName}`]["video"]["download"] = data.percent; 

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          if(data.percent < 0){ 
            currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "0.00%";  
          }else{
            try {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent.toFixed(2)}%`;  
            } catch (error) {
              currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  `${data.percent}%`;  
            }
          }           
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 
        })
        .on("end", function() { 
          /// encoding is complete, so callback or move on at this point
          if (compressUploadedVideo) { // addition of compress video data
            videoData[`${fileName}`] = {
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
            };
          } else {
            videoData[`${fileName}`] = {
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
            }; 
          }
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          currentDownloadVideos[`${fileName}`]["video"]["download-status"] =  "completed";
          if (compressUploadedVideo) { // addition of compress video data
            currentDownloadVideos[`${fileName}`]["compression"]["download-status"] =  "starting video compression";                 
          }
          currentDownloadVideos[`${fileName}`]["thumbnail"]["download-status"] =  "starting thumbnail download";   

          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  

          console.log("Video Transcoding succeeded !");
          if (compressUploadedVideo) { // compress video
            compression_VP9(path, newFilePath, fileName);
          }
          createThumbnail(path, newFilePath, fileName); 

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
        })
        .on("error", function(error) {
          /// error handling
          console.log("[streamVideo.js-downloadUploadedVideo]", `Encoding Error: ${error.message}`);
          if (error.message === "Cannot find ffmpeg") {
            // delete original video if exists
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
            // delete created folder
            FileSystem.rmdir(`${newFilePath}`, { recursive: true }, (err) => {
              if (err) throw err;
              console.log(`\n removed ${newFilePath} dir \n`);
            });
            res.json("Cannot-find-ffmpeg");
          } else {
            // delete original video if exists
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
            // there could be diffrent types of errors that exists and some may contain content in the newly created path
            // due to the uncertainty of what errors may happen i have decided to not delete the newly created path untill further notice
            res.json("ffmpeg-failed");
          }
        })
        .outputOptions(["-s hd720", "-bsf:a aac_adtstoasc",  "-vsync 1", "-vcodec copy", "-c copy", "-crf 50"])
        .output(`${newFilePath}${fileName}${fileType}`)
        .run();
      } else { 
        console.log("videoDetails already exists");
      }   
  } else if (!FileSystem.existsSync(ffprobe_path) && !FileSystem.existsSync(ffmpeg_path)) { //files dont exists
    console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
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
    res.json("Cannot-find-ffmpeg-ffprobe");
  } else if (!FileSystem.existsSync(ffmpeg_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
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
    res.json("Cannot-find-ffmpeg");
  } else if (!FileSystem.existsSync(ffprobe_path)) { //file dosent exists
    console.log("Encoding Error: Cannot find ffprobe in WatchVideoByLink directory");
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
    res.json("Cannot-find-ffprobe");
  }
}

module.exports = { // export modules
  streamVideo,
  updateVideoPlayerVolume,
  downloadVideoStream,
  downloadVideo,
  stopDownloadVideoStream,
  trimVideo,
  updateVideoDataByID,
  deleteVideoDataByID,
  findVideosByID,
  getAllAvailableVideos,
  streamThumbnail,
  deletevideoData,
  checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion,
  getVideoLinkFromUrl,
  getVideoPlayerSettings,
  currentDownloads,
  findCurrentDownloadByID,
  updateCurrentDownloadByID,
  deleteCurrentDownloadByID,
  cheackForAvailabeUnFinishedVideoDownloads,
  completeUnfinnishedVideoDownload,
  changeVideoTitle,
  uploadVideoFile
};
