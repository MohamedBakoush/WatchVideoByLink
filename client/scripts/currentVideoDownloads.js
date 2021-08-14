import * as basic from "../scripts/basics.js";

let VideoDownloadDetailsInterval, show_current_downloads_clicked;

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
      container = basic.createSection(basic.websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } else {
      container = document.getElementById("download-status-container");
    }   
    if(show_current_downloads_clicked == false){ // stop showing current_downloads when show_current_downloads is no longer supposed to be active
      // make sure container exists 
      if(container != null){
        container.remove();
      }
      // clear VideoDownloadDetailsInterval
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
      container = basic.createSection(basic.websiteContentContainer, "section", "download-status-container", "download-status-container"); 
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
      container = basic.createSection(basic.websiteContentContainer, "section", "download-status-container", "download-status-container"); 
    } else {
      container = document.getElementById("download-status-container");
    } 
    // check each data from videoDownloadDetails in reverse order
    Object.keys(videoDownloadDetails).forEach(function(videoInfo_ID) {    
      videoDownloadStatusContainer = document.getElementById(`${videoInfo_ID}-download-status-container`);    
      // if video download has been completed then remove videoDownloadStatusContainer
      // check if tumbnail downlaod status is 100.00% or 99.99% (just in case)
      if(videoDownloadDetails[videoInfo_ID].thumbnail["download-status"] === "100.00%" || videoDownloadDetails[videoInfo_ID].thumbnail["download-status"] === "99.99%"){  
        // make sure videoDownloadStatusContainer exists
        if(videoDownloadStatusContainer != null){
          // remove videoDownloadStatusContainer
          videoDownloadStatusContainer.remove(); 
        }
      } else{
        // if videoDownloadStatusContainer dosent exist 
        if(!videoDownloadStatusContainer){
          showDetailsIfDownloadDetailsAvailable(container, videoInfo_ID, videoDownloadDetails[videoInfo_ID]["video"], videoDownloadDetails[videoInfo_ID]["thumbnail"], videoDownloadDetails[videoInfo_ID]["compression"]);      
        } else if(videoDownloadDetails[videoInfo_ID]["video"]["download-status"] !== "unfinished download" 
              && videoDownloadDetails[videoInfo_ID]["video"]["download-status"] !== "working video for untrunc is unavailable" 
              && videoDownloadDetails[videoInfo_ID]["thumbnail"]["download-status"] !== "unfinished download" 
              && videoDownloadDetails[videoInfo_ID]["compression"]["download-status"] !== "unfinished download"){ 
          // clear videoDownloadStatusContainer 
          videoDownloadStatusContainer.innerHTML = "";
          // video id (title)
          basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined,`${videoInfo_ID}`); 
          // videoProgressContainer
          if(videoDownloadDetails[videoInfo_ID]["video"] !== undefined){
            basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-video`,`Video Progress: ${videoDownloadDetails[videoInfo_ID]["video"]["download-status"]}`);
          }  
          // thubnailProgressContainer
          if(videoDownloadDetails[videoInfo_ID]["thumbnail"] !== undefined){
            basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-thubnail`,`Thubnail Progress: ${videoDownloadDetails[videoInfo_ID]["thumbnail"]["download-status"]}`); 
          }         
          // compressionProgressContainer
          if(videoDownloadDetails[videoInfo_ID]["compression"] !== undefined){
            basic.createSection(videoDownloadStatusContainer, "p", undefined, `${videoInfo_ID}-compression`,`Compression Progress: ${videoDownloadDetails[videoInfo_ID]["compression"]["download-status"]}`);  
          }  
        } 
      }  
    });
  }
} 

// show video downoad details
function showDetailsIfDownloadDetailsAvailable(container, video_ID, videoProgress, thumbnailProgress, compressionProgress) { 
  const savedVideosThumbnailContainer = document.getElementById("savedVideosThumbnailContainer");
  let compressionProgressUnfinished, thumbnailProgressUnfinished;
  try { // if thumbnailProgress exits and is complete return true else false
    if (thumbnailProgress["download-status"] == "unfinished download") {
      thumbnailProgressUnfinished = true;
    } else {
      thumbnailProgressUnfinished = false;
    }
  } catch (error) {
    thumbnailProgressUnfinished = false;
  }
  try { // if compressionProgress exits and is complete return true else false
    if (compressionProgress["download-status"] == "unfinished download") {
      compressionProgressUnfinished = true;
    } else {
      compressionProgressUnfinished = false;
    }
  } catch (error) {
    compressionProgressUnfinished = false;
  }
  // container
  const videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", `${video_ID}-download-status-container`); 
  //  title
  basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined,`${video_ID}`); 
  if(videoProgress["download-status"] == "unfinished download") {
    const videoOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "videoOptionsContainer"); 
    const completeVideoDownloadButton = basic.createSection(videoOptionsContainer, "button", "button completeVideoDownloadButton", `${video_ID}-complete-download-button`, "Restore damaged video");
    // action on button click
    completeVideoDownloadButton.onclick = (e) => {
      e.preventDefault(); 
      completeDownloadRequest(video_ID);  
    }; 
     
    const deleteVideoButton = basic.createSection(videoOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
    // action on button click
    deleteVideoButton.onclick = function(e){
      e.preventDefault();
      const confirmVideoDelete = confirm("Press OK to permanently delete video");
      if (confirmVideoDelete) {   
        console.log("starting"); 
        deleteVideoDataPermanently(video_ID);
      }
    };
  } else if(videoProgress["download-status"] == "working video for untrunc is unavailable") { 
    // videoProgressContainer
    basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-untrunc`,"Untrunc: working video.mp4 unavailable");
  } else if(thumbnailProgress["download-status"] == "unfinished download"){
    const tumbnailOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "tumbnailOptionsContainer");
    const completeVideoDownloadButton = basic.createSection(tumbnailOptionsContainer, "button", "button completeTumbnailDownloadButton", `${video_ID}-complete-download-button`, "Generate thumbnails");
    // action on button click
    completeVideoDownloadButton.onclick = (e) => {
      e.preventDefault();  
      completeDownloadRequest(video_ID);  
    }; 
 
    const deleteVideoButton = basic.createSection(tumbnailOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
    // action on button click
    deleteVideoButton.onclick = function(e){
      e.preventDefault();
      const confirmVideoDelete = confirm("Press OK to permanently delete video");
      if (confirmVideoDelete) {   
        console.log("starting"); 
        deleteVideoDataPermanently(video_ID);
      }
    };
  } else{
    // videoProgressContainer
    if(videoProgress !== undefined){
      basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-video`,`Video Progress: ${videoProgress["download-status"]}`);
    }  
    // thubnailProgressContainer
    if(thumbnailProgress !== undefined){
      basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-thubnail`,`Thubnail Progress: ${thumbnailProgress["download-status"]}`); 
    }         
    // compressionProgressContainer
    if(compressionProgress !== undefined){
      basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-compression`,`Compression Progress: ${compressionProgress["download-status"]}`);  
    }  
  }  
}
 
async function completeDownloadRequest(filename) {
  try { 
    const payload = { 
      id: filename
    };
    const response = await fetch("../complete-unfinnished-video-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (response.ok) {
      const downloadStatus = await response.json();
      console.log(downloadStatus);
      if (downloadStatus == "redownload thumbnails & compression") {
        basic.notify("success",`Redownload Thumbnails & Compression: ${filename}`);
      } else if(downloadStatus == "redownload thumbnails"){
        basic.notify("success",`Redownload Thumbnails: ${filename}`);
      } else if (downloadStatus == "redownload compression") {
        basic.notify("success",`Redownload Compression: ${filename}`);
      } else if(downloadStatus == "untrunc broke video"){
        basic.notify("success",`Untrunc Broke Video: ${filename}`);
      } else if(downloadStatus == "download status: completed"){
        basic.notify("success",`Download Completed: ${filename}`);
      } 
      return "all good";
    } else {
      basic.notify("error","Failed to Complete Request");
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
  return "cleared Interval"; 
}

// send request to server to delete video and all video data permently from the system
async function deleteVideoDataPermanently(videoID) {
  const response = await fetch(`../delete-video-data-permanently/${videoID}`);
  if (response.ok) {
    const deleteVideoStatus = await response.json();
    if (deleteVideoStatus == `video-id-${videoID}-data-permanently-deleted`) {

      basic.notify("success",`Deleted: ${videoID}`);  
      console.log("deleted");
  
      const videoDownloadStatusContainer = document.getElementById(`${videoID}-download-status-container`);    
      console.log(videoDownloadStatusContainer);
      if(videoDownloadStatusContainer !== null){
        videoDownloadStatusContainer.remove(); 
        console.log("removed");
      }
    } else if (deleteVideoStatus == `video-id-${videoID}-data-failed-to-permanently-deleted`) {
      basic.notify("error",`Failed Delete: ${videoID}`);
      console.log(`Failed Delete: ${videoID}`);
    }
    return "videoDataDeletedPermanently";
  }
}
