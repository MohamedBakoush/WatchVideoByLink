"use strict";
const path = require("path");
const express = require("express");
const upload = require("express-fileupload");
const favicon = require("serve-favicon");
const streamVideoFile = require("./streamVideo");
const app = express();
app.use(upload({
  limits: { fileSize: 1024 * 1024 * 1024 },
}));
// show website icon on tab
app.use(favicon(path.join(__dirname, "client", "images", "favicon", "favicon.ico")));

// take uploaded video file and downloads it
app.post("/uploadVideoFile", uploadVideoFile);
function uploadVideoFile(req, res){
  streamVideoFile.uploadVideoFile(req, res);
}

// converts url link to video link
app.post("/getVideoLinkFromUrl", express.json(), videoLinkFromUrl);
function videoLinkFromUrl(req, res){
  streamVideoFile.getVideoLinkFromUrl(req, res);
}

// update video player volume settings
app.post("/updateVideoPlayerVolume", express.json(), updateVideoPlayerVolume);
function updateVideoPlayerVolume(req, res) {
  const updatedVolume = streamVideoFile.updateVideoPlayerVolume(req.body.updatedVideoPlayerVolume,  req.body.updatedVideoPlayerMuted);
  res.json(updatedVolume);
}

// get video player settings
app.get("/getVideoPlayerSettings", getVideoPlayerSettings);
function getVideoPlayerSettings(req, res) {
  res.json(streamVideoFile.getVideoPlayerSettings());
}

// get video thumbnail by video id and thumbnail number header
app.get("/thumbnail/:videoID/:thumbnailID", streamImageById);
function streamImageById(req, res){
  streamVideoFile.streamThumbnail(req, res, req.params.videoID, req.params.thumbnailID);
}

// delete video permently by video id header
app.post("/delete-video-data-permanently", express.json(), deleteAllVideoData);
function deleteAllVideoData(req, res){  
  streamVideoFile.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(req.body.id, req.body.folderIDPath, res);
}

// stream original video by video id header
app.get("/video/:id", streamOriginalVideoById);
function streamOriginalVideoById(req, res){
  streamVideoFile.streamVideo(req, res, req.params.id, false);
}

// stream compressed video by video id header
app.get("/compressed/:id", streamCompressedVideoById);
function streamCompressedVideoById(req, res){
  streamVideoFile.streamVideo(req, res, req.params.id, true);
}

// create Folder at availableVideos
app.post("/createFolder", express.json(), createFolder);
function createFolder(req, res){ 
  res.json(streamVideoFile.createFolder(req.body.folderIDPath, req.body.folderTitle));
}

// input selected element id out of folder element at availableVideos
app.post("/inputSelectedIDOutOfFolderID", express.json(), inputSelectedIDOutOfFolderID);
async function inputSelectedIDOutOfFolderID(req, res){ 
  res.json(await streamVideoFile.inputSelectedIDOutOfFolderID(req.body.selectedID, req.body.folderID, req.body.folderIDPath));
}

// input selected element into folder element at availableVideos
app.post("/inputSelectedIDIntoFolderID", express.json(), inputSelectedIDIntoFolderID);
async function inputSelectedIDIntoFolderID(req, res){ 
  res.json(await streamVideoFile.inputSelectedIDIntoFolderID(req.body.selectedID, req.body.folderID, req.body.folderIDPath));
}

// update selected available video details orientation
app.post("/updateRearangedAvailableVideoDetails", express.json(), updateRearangedAvailableVideoDetails);
async function updateRearangedAvailableVideoDetails(req, res){ 
  res.json(await streamVideoFile.updateRearangedAvailableVideoDetails(req.body.selectedID, req.body.targetID, req.body.folderIDPath));
}

// change title of video
app.post("/changeVideoTitle", express.json(), changeVideoTitle);
async function changeVideoTitle(req, res){ 
  res.json(await streamVideoFile.changeVideoTitle(req.body.videoID, req.body.newVideoTitle, req.body.folderIDPath));
}

// get video data for specified video by id header
app.get("/video-data/:id", findVideosByID);
function findVideosByID(req, res){
  res.json(streamVideoFile.findVideosByID(req.params.id));
}

// get all available video data header
app.get("/all-available-video-data", getAllAvailableVideos);
function getAllAvailableVideos(req, res){
  res.json(streamVideoFile.getAllAvailableVideos());
}

// download live video stream header
app.post("/downloadVideoStream", express.json(), downloadVideoStream);
function downloadVideoStream(req, res){
  streamVideoFile.downloadVideoStream(req, res);
}

// download video header
app.post("/downloadVideo", express.json(), downloadVideo);
function downloadVideo(req, res){
  streamVideoFile.downloadVideo(req, res);
}

// download video from specified section header
app.post("/trimVideo", express.json(), trimVideo);
function trimVideo(req, res){
  streamVideoFile.trimVideo(req, res);
}

// stop downloading live video stream header
app.post("/stopDownloadVideoStream", express.json(), stopDownloadVideoStream);
async function stopDownloadVideoStream(req, res){ 
  res.json(await streamVideoFile.stopDownloadVideoStream(req.body.id));
}

// load path name /saved/videos with index.html page
app.all("/saved/videos", savedVideos);
function savedVideos(req, res){
  res.sendFile(path.join(__dirname, "client", "index.html"));
}

//show current downloads
app.get("/current-video-downloads", currentDownloads);
function currentDownloads(req, res){
  res.json(streamVideoFile.currentDownloads());
}

// complete download unfinnished video by specified video id header
app.post("/complete-unfinnished-video-download",  express.json(), completeUnfinnishedVideoDownload);
function completeUnfinnishedVideoDownload(req, res){
  res.json(streamVideoFile.completeUnfinnishedVideoDownload(req.body.id));
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
  streamVideoFile.cheackForAvailabeUnFinishedVideoDownloads();
});
