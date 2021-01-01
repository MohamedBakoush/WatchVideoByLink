import * as basic from "../scripts/basics.js";
"use strict";

const websiteContentContainer = document.getElementById("websiteContentContainer");

// try to fetch for current-video-downloads if successful send data to currentVideoDownloads function else show error msg
async function loadVideoDetails() {
  try {
    const response = await fetch("../current-video-downloads");
    let currentVideoDownloads;
    if (response.ok) {
      currentVideoDownloads = await response.json();
      eachAvailableVideoDownloadDetails(currentVideoDownloads);
    } else {
      currentVideoDownloads = { msg: "failed to load messages" };
    }
  } catch (e) { // when an error occurs
    console.log("error"); 
  }
} 

// Split fetch data into individual video download details or show no availabe video dowloads
function eachAvailableVideoDownloadDetails(videoDownloadDetails) {     
  let container;
  if (Object.keys(videoDownloadDetails).length == 0){  
    if(document.getElementById("download-status-container"))  {
      document.getElementById("download-status-container").remove();
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    }
     else{  
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } 
    showDetailsifDownloadDetailsNotAvailable(container);
  } else  {
    if(document.getElementById("download-status-container"))  {
      document.getElementById("download-status-container").remove();
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } else{  
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    }
    Object.keys(videoDownloadDetails).reverse().forEach(function(videoInfo_ID) {   
      showDetailsIfDownloadDetailsAvailable(container, videoInfo_ID, videoDownloadDetails[videoInfo_ID].video , videoDownloadDetails[videoInfo_ID].thumbnail);      
    });
  }
} 

// show video downoad details
function showDetailsIfDownloadDetailsAvailable(container, video_ID, videoProgress, thumbnailProgress) { 
  const videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", `${video_ID}-download-status-container`); 
  const videoID_Container = basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined,`${video_ID}`); 
  if(thumbnailProgress["download-status"] == "unfinished download" || videoProgress["download-status"] == "unfinished download") {
    const a = basic.createLink(videoDownloadStatusContainer, "javascript:;", undefined, "button completeVideoDownloadButton", "Complete Download"); 

    a.onclick = (e) => {
      e.preventDefault(); 
      completeDownloadRequest(video_ID);  
    }; 
  } else{
    // videoProgressContainer
    basic.createSection(videoDownloadStatusContainer, "p", undefined, undefined,`Video Progress: ${videoProgress["download-status"]}`);
    // thubnailProgressContainer
    basic.createSection(videoDownloadStatusContainer, "p", undefined, undefined,`Thubnail Progress: ${thumbnailProgress["download-status"]}`);
  }  
}

 
async function completeDownloadRequest(filename) {
  try { 
    const payload = { 
      id: filename
    };
    const response = await fetch(`../complete-unfinnished-video-download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return "all good";
    } else {
      return "failed";
    }
  } catch (e) { // when an error occurs
    console.log("error"); 
  }  
} 

// No current downloads msg
function showDetailsifDownloadDetailsNotAvailable(container) { 
  const videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container"); 
  basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "No Current Dowloads"); 
}

let VideoDownloadDetailsInterval;
// Start Fetching Available Video Download Details
export function loadAvailableVideoDownloadDetails(){
  VideoDownloadDetailsInterval = setInterval(loadVideoDetails, 500);
}
// Stop Fetching Available Video Download Details
export function stopAvailableVideoDownloadDetails(){
  clearInterval(VideoDownloadDetailsInterval); 
}