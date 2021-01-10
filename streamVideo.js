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

// returns all availableVideos data
function getAllAvailableVideos(){
  return availableVideos;
}

// returns current video downloads
function currentDownloads(){
  return currentDownloadVideos;
}

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
      FileSystem.rename(fileName_fixed_ending, fileName_original_ending,  (err) => { 
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
    // delete currentDownloadVideos from server if exist
    if(currentDownloadVideos.hasOwnProperty(fileName)){  
      delete currentDownloadVideos[`${fileName}`] 
      const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
      FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);
    }
    // delete videoData from server if exist
    if (videoData.hasOwnProperty(fileName)) {
      delete videoData[`${fileName}`] 
      const deleteVideoData = JSON.stringify(videoData, null, 2);
      FileSystem.writeFileSync("data/data-videos.json", deleteVideoData);
    }  
    // delete created folder if exist
    if(FileSystem.existsSync(`./media/video/${fileName}`)){ 
      FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
        if (err) throw err; 
      });
    }      
  }
}

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
        clearInterval(checkIfMetadataExists) // stop check if video finnished restoring  
        // move video file to deleted-videos folder
        // if video is active it will make the video not viewable if someone wants to view it 
        const renameBadVideoFile = setInterval(function(){ 
          FileSystem.rename(fileName_original_ending, `./media/video/${fileName}/delete_soon.mp4`, (err) => { 
            clearInterval(renameBadVideoFile) // stop interval
            if (FileSystem.existsSync(`./media/video/${fileName}/delete_soon.mp4`) == true) { 
              //file exists   
              const renameFixedVideoTillOrignialName = setInterval(function(){                        
                FileSystem.rename(fileName_fixed_ending, fileName_original_ending,  (err) => { 
                  clearInterval(renameFixedVideoTillOrignialName) // stop interval
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
      const videoProgress = currentDownloadVideos[fileName].video["download-status"];
      const thumbnailProgress = currentDownloadVideos[fileName].thumbnail["download-status"];
      if(videoProgress == "completed"){ // when video has already been finnished downloading 
        if(thumbnailProgress == "completed"){ // delete data (no longer needed)            
          delete currentDownloadVideos[`${fileName}`] 
          const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
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
        } else{ // update thumbanil is unfinnished
          currentDownloadVideos[fileName]["thumbnail"]["download-status"] = "unfinished download";
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);   
        }
      } else if(currentDownloadVideos[fileName]["video"]["download-status"] == "starting stream download" ||
                currentDownloadVideos[fileName]["video"]["download-status"] == "starting video download" ||
                currentDownloadVideos[fileName]["video"]["download-status"] == "starting trim video download" ||
                currentDownloadVideos[fileName]["video"]["download-status"] == "0.00%"
                )
        { // if the video download hasent started
        // delete currentDownloadVideos from server if exist
        if(currentDownloadVideos.hasOwnProperty(fileName)){ 
          delete currentDownloadVideos[`${fileName}`] 
          const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);
        }
        // delete videoData from server if exist
        if (videoData.hasOwnProperty(fileName)) {
          delete videoData[`${fileName}`] 
          const deleteVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", deleteVideoData);
        }   
        
        // check if there is a video file
        if(FileSystem.existsSync(`./media/video/${fileName}/${fileName}.mp4`)){
          //rename video file to another folder
          FileSystem.rename(`./media/video/${fileName}/${fileName}.mp4`, `media/deleted-videos/deleted-${fileName}.mp4`,  (err) => {
            if (err) throw err;  
            console.log(`\n moved ./media/video/${fileName}/${fileName}.mp4 to  media/deleted-videos/deleted-${fileName}.mp4 \n`);
            //  delete the video
            FileSystem.unlink(`media/deleted-videos/deleted-${fileName}.mp4`, (err) => {
              if (err) throw err;
              console.log(`\n unlinked media/deleted-videos/deleted-${fileName}.mp4 video file \n`);
            });
            // delete created folder if exist
            if(FileSystem.existsSync(`./media/video/${fileName}`)){ 
              FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
                if (err) throw err; 
              });
            } 
          }); 
          // check if folder exists
        } else if(FileSystem.existsSync(`./media/video/${fileName}`)){ 
          // delete folder
          FileSystem.rmdir(`./media/video/${fileName}`, (err) => {
            if (err) throw err; 
          }); 
        }

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
    });  
  }
}

// finnish download video/thumbnail (if not completed) when the application get started 
function completeUnfinnishedVideoDownload(req, res){ 
  const fileName = req.body.id; 
  const filepath = "media/video/";
  const fileType = ".mp4";
  const newFilePath = `${filepath}${fileName}/`; 
  const path = newFilePath+fileName+fileType;
  const videoProgress = currentDownloadVideos[fileName].video["download-status"];
  const thumbnailProgress = currentDownloadVideos[fileName].thumbnail["download-status"];
  if(videoProgress == "completed"){ // when video has already been finnished downloading 
    if(thumbnailProgress == "completed"){ // delete data (no longer needed)            
      delete currentDownloadVideos[`${fileName}`] 
      const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
      FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
    } else{ // redownload thumbnails 
      createThumbnail(path, newFilePath, fileName); 
    }
  } else{  
    const fileName_path = `./media/video/${fileName}/${fileName}`,
    fileName_original_ending = `${fileName_path}.mp4`,
    fileName_fixed_ending = `${fileName_path}.mp4_fixed.mp4`
    // untrunc broke video 
    untrunc(fileName,fileType,newFilePath,path, fileName_original_ending, fileName_fixed_ending)  
  }
}

// if video videoId is valid then stream video
async function streamVideo(request, response, videoID){
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else { // if videoID is valid
    try {
      // path of video file
      const path = videoDetails.video.path;
      // getting the video file size
      const stat = FileSystem.statSync(path);
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
        const file = FileSystem.createReadStream(path, {start, end});
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };
        // send newly made stream to the client
        response.writeHead(206, head);
        file.pipe(response);
      } else { // send whole video file
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        response.writeHead(200, head);
        FileSystem.createReadStream(path).pipe(response);
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
const stop = (stream) => {
  return stream.ffmpegProc.stdin.write("q");
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
          
          currentDownloadVideos[`${fileName}`] = {
            video : { 
              "download-status" : "starting stream download"
            },
            thumbnail : { 
              "download-status" : "waiting for video"
            } 
          };
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);    
        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          videoData[`${fileName}`] = {
            video: {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType : req.body.videoType,
              timemark : data.timemark,
              download : "downloading"
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          currentDownloadVideos[`${fileName}`] = {
            video : { 
              "download-status" : data.timemark
            },
            thumbnail : { 
              "download-status" : "waiting for video"
            } 
          };
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);    
          
          console.log("progress", data);
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
          const path = newFilePath+fileName+fileType;
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
  const videofile = req.body.videoSrc;
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

          currentDownloadVideos[`${fileName}`] = {
            video : { 
              "download-status" : "starting video download"
            },
            thumbnail : { 
              "download-status" : "waiting for video"
            } 
          };
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 

        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc : req.body.videoSrc,
              originalVideoType: req.body.videoType,
              download: data.percent
            }
          };
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          if(data.percent < 0){ 
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "0.00%"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else if(data.percent == "undefined"){
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : `${data.percent}%`
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else{
            try {
              currentDownloadVideos[`${fileName}`] = {
                video : { 
                  "download-status" : `${data.percent.toFixed(2)}%`
                },
                thumbnail : { 
                  "download-status" : "waiting for video"
                } 
              };  
            } catch (error) {
              currentDownloadVideos[`${fileName}`] = {
                video : { 
                  "download-status" : `${data.percent}%`
                },
                thumbnail : { 
                  "download-status" : "waiting for video"
                } 
              };    
            }
          } 
          
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 
        })
        .on("end", function() {
          /// encoding is complete, so callback or move on at this point
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
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

                    
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
          const path = newFilePath+fileName+fileType;
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
  const videofile = req.body.videoSrc;
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
              download : "starting trim video download"
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          
          currentDownloadVideos[`${fileName}`] = {
            video : { 
              "download-status" : "starting trim video download"
            },
            thumbnail : { 
              "download-status" : "waiting for video"
            } 
          };
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos); 
        
        })
        .on("progress", function(data) {
          /// do stuff with progress data if you wan
          console.log("progress", data);
          videoData[`${fileName}`] = {
            video : {
              originalVideoSrc: req.body.videoSrc,
              originalVideoType: req.body.videoType,
              newVideoStartTime: req.body.newStartTime,
              newVideoEndTime: req.body.newEndTime,
              download: data.percent
            }
          };

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
          if(data.percent < 0){ 
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : "0.00%"
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          }else if(data.percent == "undefined"){
            currentDownloadVideos[`${fileName}`] = {
              video : { 
                "download-status" : `${data.percent}%`
              },
              thumbnail : { 
                "download-status" : "waiting for video"
              } 
            };
          } else{
            try {
              currentDownloadVideos[`${fileName}`] = {
                video : { 
                  "download-status" : `${data.percent.toFixed(2)}%`
                },
                thumbnail : { 
                  "download-status" : "waiting for video"
                } 
              };  
            } catch (error) {
              currentDownloadVideos[`${fileName}`] = {
                video : { 
                  "download-status" : `${data.percent}%`
                },
                thumbnail : { 
                  "download-status" : "waiting for video"
                } 
              };    
            }
          } 
          const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
          FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);
        })
        .on("end", function() {
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
          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

                    
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
          const path = newFilePath+fileName+fileType;
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
      duration = metadata.format.duration;
      console.log(duration);
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
  
                currentDownloadVideos[`${fileName}`] = {
                  video : { 
                    "download-status" : "completed"
                  },
                  thumbnail : { 
                    "download-status" : "0.00%"
                  } 
                };
              }else{ //update data with with data.percent
                videoData[`${fileName}`]["thumbnail"].download =  data.percent;
  
                currentDownloadVideos[`${fileName}`] = {
                  video : { 
                    "download-status" : "completed"
                  },
                  thumbnail : { 
                    "download-status" : `${data.percent.toFixed(2)}%`
                  } 
                };
              }
  
              // update data to database
              const newVideoData = JSON.stringify(videoData, null, 2);
              FileSystem.writeFileSync("data/data-videos.json", newVideoData); 
  
              const newCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
              FileSystem.writeFileSync("data/current-download-videos.json", newCurrentDownloadVideos);  
  
              console.log("progress", data);
            })
            .on("end", () => {
                /// encoding is complete, so callback or move on at this point
                for (let i = 0; i < numberOfCreatedScreenshots + 1; i++) {
                  if (i == 0){
                    availableVideos[`${fileName}`] = {
                      info:{
                        videoLink: {
                          src : `/video/${fileName}`,
                          type : "video/mp4"
                        },
                        thumbnailLink: {
                        }
                      }
                    };
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
                
                delete currentDownloadVideos[`${fileName}`] 
                const deleteCurrentDownloadVideos = JSON.stringify(currentDownloadVideos, null, 2);
                FileSystem.writeFileSync("data/current-download-videos.json", deleteCurrentDownloadVideos);  
  
            })
            .on("error", (error) => {
                /// error handling
                console.log(`Encoding Error: ${error.message}`);
            })
            .outputOptions([`-vf fps=${numberOfImages}/${duration}`])
            .output(`${newFilePath}${imageFileName}%03d${fileType}`)
            .run();
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

// deletes everything that is available in the system related to video id, video file, all available video data ...
async function deletevideoData(request, response, videoID) {
    const filepath = `media/video/${videoID}`;
  // check if videoid is valid
  const videoDetails = await findVideosByID(videoID);
  // if video dosent exist redirect to home page
  if (videoDetails == undefined) {
    response.status(404).redirect("/");
  } else {
     try {  
      if (FileSystem.existsSync(videoDetails.video.path)) { 
        // move video file to deleted-videos folder
        // if video is active it will make the video not viewable if someone wants to view it
        FileSystem.rename(videoDetails.video.path, `media/deleted-videos/deleted-${videoID}.mp4`,  (err) => {
          if (err) throw err;  
          console.log(`\n moved ${videoDetails.video.path} to  media/deleted-videos/deleted-${videoID}.mp4 \n`);
          //  delete the video
          FileSystem.unlink(`media/deleted-videos/deleted-${videoID}.mp4`, (err) => {
            if (err) throw err;
            console.log(`\n unlinked media/deleted-videos/deleted-${videoID}.mp4 video file \n`);
          });
          //  delete folder Content
          FileSystem.rmdir(filepath, { recursive: true }, (err) => {
            if (err) throw err;
            console.log(`\n removed ${filepath} dir \n`);
          });
          // delete video data from database
          delete videoData[videoID];
          delete availableVideos[videoID];

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);

          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
          console.log(`\n ${filepath} is deleted! \n`);
          response.json(`video-id-${videoID}-data-permanently-deleted`);
        });
      } else{ // if seposed video path dosent exits delete data/video folder 
        if (FileSystem.existsSync(filepath)) { 
          //  delete folder Content
          FileSystem.rmdir(filepath, { recursive: true }, (err) => {
            if (err) throw err;
            console.log(`\n removed ${filepath} dir \n`);
          });
        };
        if(availableVideos.hasOwnProperty(videoID)){
          delete availableVideos[videoID];

          const newVideoData = JSON.stringify(videoData, null, 2);
          FileSystem.writeFileSync("data/data-videos.json", newVideoData);
        }

        if(videoData.hasOwnProperty(videoID)){
          delete availableVideos[videoID];

          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync("data/available-videos.json", newAvailableVideo);
          console.log(`\n ${filepath} is deleted! \n`);
        }

        console.log(`\n ${filepath} is deleted! \n`);
        response.json(`video-id-${videoID}-data-permanently-deleted`);
      }

     } catch (e) {
       console.log(`failed to delete ${videoDetails.video.path}`);
     }
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

module.exports = { // export modules
  streamVideo,
  updateVideoPlayerVolume,
  downloadVideoStream,
  downloadVideo,
  stopDownloadVideoStream,
  trimVideo,
  findVideosByID,
  getAllAvailableVideos,
  streamThumbnail,
  deletevideoData,
  getVideoLinkFromUrl,
  getVideoPlayerSettings,
  currentDownloads,
  cheackForAvailabeUnFinishedVideoDownloads,
  completeUnfinnishedVideoDownload
};
