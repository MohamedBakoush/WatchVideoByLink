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
  let container, videoDownloadStatusContainer;
  if (Object.keys(videoDownloadDetails).length == 0){  
    // make sure container exists
    if(!document.getElementById("download-status-container"))  {  
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } else {
      container = document.getElementById("download-status-container");
    } 
    // assign videoDownloadStatusContainer No current downloads msg conainer
    videoDownloadStatusContainer = document.getElementById("no-current-dowloads-available");
    // No current downloads msg
    if(!videoDownloadStatusContainer){ 
      container.innerHTML = "";
      videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", "no-current-dowloads-available"); 
      basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "No Current Dowloads");  
    }
  } else  {
    // available downloads
    if(!document.getElementById("download-status-container"))  {  
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    }
    // check each data from videoDownloadDetails in reverse order
    Object.keys(videoDownloadDetails).reverse().forEach(function(videoInfo_ID) {    
      videoDownloadStatusContainer = document.getElementById(`${videoInfo_ID}-download-status-container`);    
      // if video download ahs been completed then remove videoDownloadStatusContainer
      if(videoDownloadDetails[videoInfo_ID].thumbnail["download-status"] === "100.00%"){
        videoDownloadStatusContainer.remove();
      }
      // if videoDownloadStatusContainer dosent exist
      if(!videoDownloadStatusContainer){
        showDetailsIfDownloadDetailsAvailable(container, videoInfo_ID, videoDownloadDetails[videoInfo_ID].video , videoDownloadDetails[videoInfo_ID].thumbnail);      
      } else if(videoDownloadDetails[videoInfo_ID].video["download-status"] !== "unfinished download" && videoDownloadDetails[videoInfo_ID].thumbnail["download-status"] !== "unfinished download"){
        // clear videoDownloadStatusContainer
        videoDownloadStatusContainer.innerHTML = "";
        // video id (title)
        basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined,`${videoInfo_ID}`); 
        // videoProgressContainer
        basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-video`,`Video Progress: ${videoDownloadDetails[videoInfo_ID].video["download-status"]}`);
        // thubnailProgressContainer
        basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-thubnail`,`Thubnail Progress: ${videoDownloadDetails[videoInfo_ID].thumbnail ["download-status"]}`);     
      }   
    });
  }
} 

// show video downoad details
function showDetailsIfDownloadDetailsAvailable(container, video_ID, videoProgress, thumbnailProgress) { 
  // container
  const videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", `${video_ID}-download-status-container`); 
  //  title
  basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined,`${video_ID}`); 
  if(thumbnailProgress["download-status"] == "unfinished download" || videoProgress["download-status"] == "unfinished download") {
    const completeDownloadButton = basic.createLink(videoDownloadStatusContainer, "javascript:;", `${video_ID}-complete-download-button`, "button completeVideoDownloadButton", "Complete Download"); 
    // action on button click
    completeDownloadButton.onclick = (e) => {
      e.preventDefault(); 
      completeDownloadRequest(video_ID);  
    }; 

  } else{
    // videoProgressContainer
    basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-video`,`Video Progress: ${videoProgress["download-status"]}`);
    // thubnailProgressContainer
    basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-thubnail`,`Thubnail Progress: ${thumbnailProgress["download-status"]}`);
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

let VideoDownloadDetailsInterval;
// Start Fetching Available Video Download Details
export function loadAvailableVideoDownloadDetails(){
  VideoDownloadDetailsInterval = setInterval(loadVideoDetails, 50);
}
// Stop Fetching Available Video Download Details
export function stopAvailableVideoDownloadDetails(){
  clearInterval(VideoDownloadDetailsInterval); 
}