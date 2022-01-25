"use strict";
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon"); 
const upload = require("express-fileupload");
const videoData = require("./backend/scripts/data-videos");
const deleteData = require("./backend/scripts/delete-data");
const stream = require("./backend/scripts/stream-video-image");
const userSettings = require("./backend/scripts/user-settings");
const availableVideos = require("./backend/scripts/available-videos");
const ffmpegUploadVideo = require("./backend/scripts/ffmpeg-upload-video");
const ffmpegDownloadVideo = require("./backend/scripts/ffmpeg-download-video");
const ffmpegDownloadStream = require("./backend/scripts/ffmpeg-download-stream");
const currentDownloadVideos = require("./backend/scripts/current-download-videos");
const ffmpegUnfinishedVideo = require("./backend/scripts/ffmpeg-unfinished-videos");
const youtubedlDownloadVideo = require("./backend/scripts/youtubedl-download-video");
const ffmpegDownloadResponse = require("./backend/scripts/ffmpeg-download-response");
const app = express();
app.use(upload({
  limits: { fileSize: 1024 * 1024 * 1024 },
}));
// show website icon on tab
app.use(favicon(path.join(__dirname, "client", "images", "favicon", "favicon.ico")));

// take uploaded video file and downloads it
app.post("/uploadVideoFile", uploadVideoFile);
function uploadVideoFile(req, res){
  ffmpegUploadVideo.uploadVideoFile(req, res);
}

// converts url link to video link
app.post("/getVideoLinkFromUrl", express.json(), videoLinkFromUrl);
function videoLinkFromUrl(req, res){
  youtubedlDownloadVideo.getVideoLinkFromUrl(req, res);
}

// update video player volume settings
app.post("/updateVideoPlayerVolume", express.json(), updateVideoPlayerVolume);
function updateVideoPlayerVolume(req, res) {
  const updatedVolume = userSettings.updateVideoPlayerVolume(req.body.updatedVideoPlayerVolume,  req.body.updatedVideoPlayerMuted);
  res.json(updatedVolume);
}

// get video player settings
app.get("/getVideoPlayerSettings", getVideoPlayerSettings);
function getVideoPlayerSettings(req, res) {
  res.json(userSettings.getUserSettings(["videoPlayer"]));
}

// get download confirmation status
app.get("/getDownloadConfirmation", getDownloadConfirmation);
function getDownloadConfirmation(req, res) {
  const userConfirmationSettings = userSettings.getUserSettings(["download", "confirmation"]);
  if (userConfirmationSettings !== "invalid array path" && userConfirmationSettings !== undefined) { 
    res.json(userConfirmationSettings);
  } else {
    res.json("userConfirmationSettings unavailable");
  }
}

// update download confirmation by specified id & bool
app.post("/updateDownloadConfirmation", express.json(), updateDownloadConfirmation);
function updateDownloadConfirmation(req, res) {
  if (typeof req.body.updateBool == "boolean") {
    const checkIfValidID = userSettings.getUserSettings(["download", "confirmation", req.body.updateID]);
    if (checkIfValidID !== "invalid array path" && checkIfValidID !== undefined) { 
      userSettings.updateUserSettingsData(["download", "confirmation", req.body.updateID], req.body.updateBool);
      res.json("updated bool");
    } else {
      res.json("invalid id");
    }
  } else {
    res.json("invalid bool");
  }
}

// get video thumbnail by video id and thumbnail number header
app.get("/thumbnail/:videoID/:thumbnailID", streamImageById);
function streamImageById(req, res){
  stream.streamThumbnail(req, res, req.params.videoID, req.params.thumbnailID);
}

// delete video permently by video id header
app.post("/delete-video-data-permanently", express.json(), deleteAllVideoData);
async function deleteAllVideoData(req, res){  
  res.json(await deleteData.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(req.body.id, req.body.folderIDPath));
}

// stream original video by video id header
app.get("/video/:id", streamOriginalVideoById);
function streamOriginalVideoById(req, res){
  stream.streamVideo(req, res, req.params.id, false);
}

// stream compressed video by video id header
app.get("/compressed/:id", streamCompressedVideoById);
function streamCompressedVideoById(req, res){
  stream.streamVideo(req, res, req.params.id, true);
}

// create Folder at availableVideos
app.post("/createFolder", express.json(), createFolder);
function createFolder(req, res){ 
  res.json(availableVideos.createFolder(req.body.folderIDPath, req.body.folderTitle));
}

// input selected element id out of folder element at availableVideos
app.post("/inputSelectedIDOutOfFolderID", express.json(), inputSelectedIDOutOfFolderID);
async function inputSelectedIDOutOfFolderID(req, res){ 
  res.json(await availableVideos.inputSelectedIDOutOfFolderID(req.body.selectedID, req.body.folderID, req.body.folderIDPath));
}

// input selected element into folder element at availableVideos
app.post("/inputSelectedIDIntoFolderID", express.json(), inputSelectedIDIntoFolderID);
async function inputSelectedIDIntoFolderID(req, res){ 
  res.json(await availableVideos.inputSelectedIDIntoFolderID(req.body.selectedID, req.body.folderID, req.body.folderIDPath));
}

// move selected id data to before target id data at available video details
app.post("/moveSelectedIdBeforeTargetIdAtAvailableVideoDetails", express.json(), moveSelectedIdBeforeTargetIdAtAvailableVideoDetails);
async function moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(req, res){ 
  res.json(await availableVideos.moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(req.body.selectedID, req.body.targetID, req.body.folderIDPath));
}

// move selected id data to after target id data at available video details
app.post("/moveSelectedIdAfterTargetIdAtAvailableVideoDetails", express.json(), moveSelectedIdAfterTargetIdAtAvailableVideoDetails);
async function moveSelectedIdAfterTargetIdAtAvailableVideoDetails(req, res){ 
  res.json(await availableVideos.moveSelectedIdAfterTargetIdAtAvailableVideoDetails(req.body.selectedID, req.body.targetID, req.body.folderIDPath));
}

// change title of video
app.post("/changeVideoTitle", express.json(), changeVideoTitle);
async function changeVideoTitle(req, res){ 
  res.json(await availableVideos.changeTitle(req.body.videoID, req.body.newVideoTitle, req.body.folderIDPath));
}

// get video data for specified video by id header
app.get("/video-data/:id", findVideosByID);
function findVideosByID(req, res){
  res.json(videoData.findVideosByID(req.params.id));
}

// get all available video data header
app.get("/all-available-video-data", getAllAvailableVideos);
function getAllAvailableVideos(req, res){
  res.json(availableVideos.getAvailableVideos());
}

// download live video stream header
app.post("/downloadVideoStream", express.json(), downloadVideoStream);
function downloadVideoStream(req, res){
  ffmpegDownloadStream.downloadVideoStream(req, res);
}

// download video header
app.post("/downloadVideo", express.json(), downloadVideo);
async function downloadVideo(req, res){
  const downloadVideo = await ffmpegDownloadVideo.downloadVideo(req.body.videoSrc, req.body.videoType);
  if (downloadVideo.message == "initializing") {
    const checkDownloadResponse = setInterval(function(){ 
      const getDownloadResponse = ffmpegDownloadResponse.getDownloadResponse([downloadVideo.fileName]);
      if (getDownloadResponse.message !== "initializing") {
        clearInterval(checkDownloadResponse);
        ffmpegDownloadResponse.deleteSpecifiedDownloadResponse(getDownloadResponse.fileName);
        res.json(getDownloadResponse.message);
      }  
    }, 50); 
  } else {
    res.json(downloadVideo.message);
  }
}

// download video from specified section header
app.post("/trimVideo", express.json(), trimVideo);
function trimVideo(req, res){
  ffmpegDownloadVideo.trimVideo(req, res);
}

// stop downloading live video stream header
app.post("/stopDownloadVideoStream", express.json(), stopDownloadVideoStream);
async function stopDownloadVideoStream(req, res){ 
  res.json(await ffmpegDownloadStream.stopDownloadVideoStream(req.body.id));
}

// load path name /saved/videos with index.html page
app.all("/saved/videos", savedVideos);
function savedVideos(req, res){
  res.sendFile(path.join(__dirname, "client", "index.html"));
}

//show current downloads
app.get("/current-video-downloads", getCurrentDownloads);
function getCurrentDownloads(req, res){
  res.json(currentDownloadVideos.getCurrentDownloads());
}

// complete download unfinnished video by specified video id header
app.post("/complete-unfinnished-video-download",  express.json(), completeUnfinnishedVideoDownload);
function completeUnfinnishedVideoDownload(req, res){
  res.json(ffmpegUnfinishedVideo.completeUnfinnishedVideoDownload(req.body.id));
} 

// adds html as extensions, dont need to write index.html
app.use(express.static("client", { extensions: ["html"] }));

// if page not found redirect to home page
app.get("*", function(req, res){
   res.status(404).redirect("/");
});

// application runs on port 8080
app.set("port", (process.env.PORT || 8080));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port"));
  // cheack for available unfinished video downloads
  ffmpegUnfinishedVideo.cheackForAvailabeUnFinishedVideoDownloads();
});
