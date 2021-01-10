import * as basic from "../scripts/basics.js";
"use strict";

let VideoDownloadDetailsInterval, show_current_downloads_clicked;
const websiteContentContainer = document.getElementById("websiteContentContainer");

// try to fetch for current-video-downloads if successful send data to currentVideoDownloads function else show error msg
async function loadVideoDetails() {
  try {
    const response = await fetch("../current-video-downloads");
    let currentVideoDownloads;
    if (response.ok) {
      currentVideoDownloads = await response.json();
      if(show_current_downloads_clicked == true){ // show current_downloads when show_current_downloads is supposed to be active
        eachAvailableVideoDownloadDetails(currentVideoDownloads);      
      }
    } else {
      currentVideoDownloads = { msg: "failed to load messages" };
    }
  } catch (e) { // when an error occurs  
    let container, videoDownloadStatusContainer; 
    if(!document.getElementById("download-status-container"))  {  
      container = basic.createSection(websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } else {
      container = document.getElementById("download-status-container");
    }   
    if(show_current_downloads_clicked == false){ // stop showing current_downloads when show_current_downloads is no longer supposed to be active
      container.remove();
      clearInterval(VideoDownloadDetailsInterval); 
    } else {
      // assign videoDownloadStatusContainer Failed fetch current downloads msg conainer
      videoDownloadStatusContainer = document.getElementById("failed-fetch-available-download-details");
      // No current downloads msg
      if(!videoDownloadStatusContainer){ 
        container.innerHTML = "";
        videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", "failed-fetch-available-download-details"); 
        basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "Error: Failed fetch download details");  
      } 
    }
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
      basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "No current available dowloads");  
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
        basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-thubnail`,`Thubnail Progress: ${videoDownloadDetails[videoInfo_ID].thumbnail["download-status"]}`);     
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
  if(videoProgress["download-status"] == "unfinished download") {
    const completeVideoDownloadButton = basic.createLink(videoDownloadStatusContainer, "javascript:;", `${video_ID}-complete-download-button`, "button completeVideoDownloadButton", "Restore damaged video"); 
    // action on button click
    completeVideoDownloadButton.onclick = (e) => {
      e.preventDefault(); 
      completeDownloadRequest(video_ID);  
    }; 
  } else if(thumbnailProgress["download-status"] == "unfinished download" ){
    const completeVideoDownloadButton = basic.createLink(videoDownloadStatusContainer, "javascript:;", `${video_ID}-complete-download-button`, "button completeVideoDownloadButton", "Generate thumbnails"); 
    // action on button click
    completeVideoDownloadButton.onclick = (e) => {
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

// Start Fetching Available Video Download Details 
export function loadAvailableVideoDownloadDetails(show_current_downloads){ 
  show_current_downloads_clicked = show_current_downloads;
  VideoDownloadDetailsInterval = setInterval(loadVideoDetails, 50);
}
// Stop Fetching Available Video Download Details
export function stopAvailableVideoDownloadDetails(show_current_downloads){
  show_current_downloads_clicked = show_current_downloads;
  clearInterval(VideoDownloadDetailsInterval); 
  return("cleared Interval")
}