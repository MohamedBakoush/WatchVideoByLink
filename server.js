"use strict";
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const streamVideoFile = require("./streamVideo");
const app = express();

// show website icon on tab
app.use(favicon(path.join(__dirname, "client", "images", "favicon", "favicon.ico")));

app.get("/video/:id", streamVideoById);
function streamVideoById(req, res){
  streamVideoFile.streamVideo(req, res, req.params.id);
}

app.get("/data-video/:id", findVideosByID);
function findVideosByID(req, res){
  res.json(streamVideoFile.findVideosByID(req.params.id));
}

app.post("/downloadVideoStream", express.json(), downloadVideoStream);
function downloadVideoStream(req, res){
  streamVideoFile.downloadVideoStream(req, res);
}

app.post("/downloadVideo", express.json(), downloadVideo);
function downloadVideo(req, res){
  streamVideoFile.downloadVideo(req, res);
}

app.post("/trimVideo", express.json(), trimVideo);
function trimVideo(req, res){
  streamVideoFile.trimVideo(req, res);
}

app.post("/stopDownloadVideoStream", express.json(), stopDownloadVideoStream);
function stopDownloadVideoStream(req, res){
  streamVideoFile.stopDownloadVideoStream(req, res);
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
});