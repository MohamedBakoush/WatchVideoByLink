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
  streamVideoFile.updateVideoPlayerVolume(req, res);
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
app.get("/delete-video-data-permanently/:id", deletevideoData);
function deletevideoData(req, res){
  streamVideoFile.checkIfCompressedVideoIsDownloadingBeforeVideoDataDeletion(req, res, req.params.id);
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

// change title of video
app.post("/changeVideoTitle", express.json(), changeVideoTitle);
function changeVideoTitle(req, res){
  streamVideoFile.changeVideoTitle(req, res);
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
function stopDownloadVideoStream(req, res){
  streamVideoFile.stopDownloadVideoStream(req, res);
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
  // streamVideoFile.completeUnfinnishedVideoDownload(req, res);
  res.json(streamVideoFile.completeUnfinnishedVideoDownload(req, res));
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
