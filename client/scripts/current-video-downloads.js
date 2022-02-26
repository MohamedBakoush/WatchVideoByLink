import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";

let VideoDownloadDetailsInterval, show_current_downloads_clicked;

// try to fetch for current-video-downloads if successful send data to currentVideoDownloads function else show error msg
export async function loadVideoDetails() {
  try {
    const response = await fetch("../current-video-downloads");
    let currentVideoDownloads;
    if (response.ok) {
      currentVideoDownloads = await response.json();
      if(show_current_downloads_clicked == true){ // show current_downloads when show_current_downloads is supposed to be active
        eachAvailableVideoDownloadDetails(currentVideoDownloads);   
        return "Display Current Downloads";   
      } else{  
        return "Show Current Downlods False";
       } 
    } else {
      return "Fetch response not ok";
    }
  } catch (e) { // when an error occurs  
    let container, videoDownloadStatusContainer; 
    if(!document.getElementById("download-status-container"))  {  
      container = basic.createSection(basic.websiteContentContainer(), "section", "download-status-container", "download-status-container"); 
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
      return "stoped current downloads no longer visable";
    } else {
      // assign videoDownloadStatusContainer Failed fetch current downloads msg conainer
      videoDownloadStatusContainer = document.getElementById("failed-fetch-available-download-details");
      // No current downloads msg
      if(!videoDownloadStatusContainer){ 
        container.innerHTML = "";
        videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", "failed-fetch-available-download-details"); 
        basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "Error: Failed fetch download details");  
      } 
      return "Failed fetch download details";
    }
  }
} 

// Split fetch data into individual video download details or show no availabe video dowloads
export function eachAvailableVideoDownloadDetails(videoDownloadDetails) { 
  if (videoDownloadDetails == undefined) {
    return "video download details unavailable";
  } else {
    let container, videoDownloadStatusContainer;
    if(document.getElementById("download-status-container"))  { // assign download-status-container as container
      container = document.getElementById("download-status-container");
    } else {
      container = basic.createSection(basic.websiteContentContainer(), "section", "download-status-container", "download-status-container"); 
    } 
    if (Object.keys(videoDownloadDetails).length == 0){   
      // assign videoDownloadStatusContainer - No current downloads msg conainer
      if (document.getElementById("no-current-dowloads-available")) {
        videoDownloadStatusContainer = document.getElementById("no-current-dowloads-available");
      } else {
        container.innerHTML = "";
        videoDownloadStatusContainer = basic.createSection(container, "section", "video-download-status-container", "no-current-dowloads-available"); 
        basic.createSection(videoDownloadStatusContainer, "strong", undefined, undefined, "No current available dowloads");  
      }
      return "No current available dowloads";
    } else  { // available downloads
      // check each data from videoDownloadDetails in reverse order
      Object.keys(videoDownloadDetails).forEach(function(videoInfo_ID) {    
        forEachVideoDownloadDetails(container, videoDownloadDetails, videoInfo_ID); 
      });
      return "Show current available dowloads";
    }
  }    
} 
 
// for each video download details
export function forEachVideoDownloadDetails(container, videoDownloadDetails, videoInfo_ID) {    
  let videoDownloadStatusContainer = document.getElementById(`${videoInfo_ID}-download-status-container`);    
  // if videoDownloadStatusContainer dosent exist    
  let compressionProgressUnfinished, thumbnailProgressUnfinished, videoProgressUnfinished;
  try { 
    if (videoDownloadDetails[videoInfo_ID]["video"]["download-status"] ==  "untrunc unavailable") {
      videoProgressUnfinished = "untrunc unavailable";
    } else if (videoDownloadDetails[videoInfo_ID]["video"]["download-status"] == "unfinished download") {
      videoProgressUnfinished = "unfinished download";
    } else if (videoDownloadDetails[videoInfo_ID]["video"]["download-status"] == "working video for untrunc is unavailable") {
      videoProgressUnfinished = "working video for untrunc is unavailable";
    } else {
      videoProgressUnfinished = false;
    }
  } catch (error) {
    videoProgressUnfinished = false;
  }
  try { // if thumbnailProgress exits and is complete return true else false
    if (videoDownloadDetails[videoInfo_ID]["thumbnail"]["download-status"] == "unfinished download") {
      thumbnailProgressUnfinished = true;
    } else {
      thumbnailProgressUnfinished = false;
    }
  } catch (error) {
    thumbnailProgressUnfinished = false;
  }
  try { // if compressionProgress exits and is complete return true else false
    if (videoDownloadDetails[videoInfo_ID]["compression"]["download-status"] == "unfinished download") {
      compressionProgressUnfinished = true;
    } else {
      compressionProgressUnfinished = false;
    }
  } catch (error) {
    compressionProgressUnfinished = false;
  }
  if(!videoDownloadStatusContainer){
    showDetailsIfDownloadDetailsAvailable(container, videoInfo_ID, videoDownloadDetails[videoInfo_ID]["video"], videoDownloadDetails[videoInfo_ID]["thumbnail"], videoDownloadDetails[videoInfo_ID]["compression"]);      
    return "show download details if avaiable";
  } else if(videoProgressUnfinished !== "untrunc unavailable" 
        && videoProgressUnfinished !== "unfinished download" 
        && videoProgressUnfinished !== "working video for untrunc is unavailable" 
        && thumbnailProgressUnfinished !== true 
        && compressionProgressUnfinished !== true){ 
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
    return "Display Video Download Details";
  } else {
     return "video download unfinished";
  }  
}

// show video download details
export function showDetailsIfDownloadDetailsAvailable(container, video_ID, videoProgress, thumbnailProgress, compressionProgress) { 
  try { 
    if (container == undefined) {
      return "container unavaiable";
    } else if (video_ID == undefined) {
      return "Video ID unavaiable";
    } else if (videoProgress == undefined && thumbnailProgress == undefined && compressionProgress == undefined) { 
      return "Video Download Details unavaiable";
    } else {
      let savedVideosThumbnailContainer;
      if (document.getElementById("savedVideosThumbnailContainer")) {
        savedVideosThumbnailContainer = document.getElementById("savedVideosThumbnailContainer");
      } else {
        savedVideosThumbnailContainer = false;
      } 
      let compressionProgressUnfinished, thumbnailProgressUnfinished, videoProgressUnfinished;
      try {
        if (videoProgress["download-status"] == "untrunc unavailable") {
          videoProgressUnfinished = "untrunc unavailable";
        } else if (videoProgress["download-status"] == "unfinished download") {
          videoProgressUnfinished = "unfinished download";
        } else if (videoProgress["download-status"] == "working video for untrunc is unavailable") {
          videoProgressUnfinished = "working video for untrunc is unavailable";
        } else {
          videoProgressUnfinished = false;
        }
      } catch (error) {
        videoProgressUnfinished = false;
      }
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
      if (videoProgressUnfinished == "untrunc unavailable") {
        const videoOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "videoOptionsContainer"); 
        const untruncUnavailableButton = basic.createSection(videoOptionsContainer, "button", "button untruncUnavailableButton", `${video_ID}-untrunc-unavailable-button`, "Restore damaged video");
        // action on button click
        untruncUnavailableButton.onclick = (e) => {
          e.preventDefault(); 
          notify.message("error", "Untrunc Unavailable");   
        }; 
        // delete video button
        const deleteVideoButton = basic.createSection(videoOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
        // action on button click
        deleteVideoButton.onclick = function(e){
          e.preventDefault();
          deleteVideoButton.remove();
          const confirmationButton = basic.createSection(videoOptionsContainer, "button", "deleteVideoButton2", undefined, "Confirm");
          confirmationButton.onclick = function(e){
            e.preventDefault();
            deleteVideoDataPermanently(video_ID);
          };
        };
        return "untrunc unavailable";
      } else if(videoProgressUnfinished == "unfinished download") {
        const videoOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "videoOptionsContainer"); 
        const completeVideoDownloadButton = basic.createSection(videoOptionsContainer, "button", "button completeVideoDownloadButton", `${video_ID}-complete-download-button`, "Restore damaged video");
        // action on button click
        completeVideoDownloadButton.onclick = (e) => {
          e.preventDefault(); 
          completeDownloadRequest(video_ID);  
        }; 
        // delete video button
        const deleteVideoButton = basic.createSection(videoOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
        // action on button click
        deleteVideoButton.onclick = function(e){
          e.preventDefault();
          deleteVideoButton.remove();
          const confirmationButton = basic.createSection(videoOptionsContainer, "button", "deleteVideoButton2", undefined, "Confirm");
          confirmationButton.onclick = function(e){
            e.preventDefault();
            deleteVideoDataPermanently(video_ID);
          };
        };
        return "video unfinished";
      } else if(videoProgressUnfinished == "working video for untrunc is unavailable") { 
        // videoProgressContainer
        basic.createSection(videoDownloadStatusContainer, "p", undefined, `${video_ID}-untrunc`,"Untrunc: working video.mp4 unavailable");
        return "working video for untrunc is unavailable";
      } else if(thumbnailProgressUnfinished && compressionProgressUnfinished) { 
        // thumbnail and compression unfinished 
        const tumbnailCompressionOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "tumbnailCompressionOptionsContainer");
        const completeTumbnailCompressionDownloadButton = basic.createSection(tumbnailCompressionOptionsContainer, "button", "button completeTumbnailCompressionDownloadButton", `${video_ID}-complete-download-button`, "Generate thumbnails & video compression");
        // action on button click
        completeTumbnailCompressionDownloadButton.onclick = (e) => {
          e.preventDefault();  
          completeDownloadRequest(video_ID);  
        }; 
        // delete video button
        const deleteVideoButton = basic.createSection(tumbnailCompressionOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
        // action on button click
        deleteVideoButton.onclick = function(e){
          e.preventDefault();   
          deleteVideoButton.remove();
          const confirmationButton = basic.createSection(tumbnailCompressionOptionsContainer, "button", "deleteVideoButton2", undefined, "Confirm");
          confirmationButton.onclick = function(e){
            e.preventDefault();
            deleteVideoDataPermanently(video_ID);
          };
        };
        return "thumbnail and compression unfinished";
      } else if(thumbnailProgressUnfinished && !compressionProgressUnfinished) { 
        // thumbnail unfinished, compression finished 
        const tumbnailOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "tumbnailOptionsContainer");
        const completeTumbnailDownloadButton = basic.createSection(tumbnailOptionsContainer, "button", "button completeTumbnailDownloadButton", `${video_ID}-complete-download-button`, "Generate thumbnails");
        // action on button click
        completeTumbnailDownloadButton.onclick = (e) => {
          e.preventDefault();  
          completeDownloadRequest(video_ID);  
        }; 
        // delete video button
        const deleteVideoButton = basic.createSection(tumbnailOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
        // action on button click
        deleteVideoButton.onclick = function(e){
          e.preventDefault();
          deleteVideoButton.remove();
          const confirmationButton = basic.createSection(tumbnailOptionsContainer, "button", "deleteVideoButton2", undefined, "Confirm");
          confirmationButton.onclick = function(e){
            e.preventDefault();
            deleteVideoDataPermanently(video_ID);
          };
        };
        return "thumbnail unfinished";
      } else if(!thumbnailProgressUnfinished && compressionProgressUnfinished) { 
        // thumbnail finished, compression unfinished
        const compressionOptionsContainer = basic.createSection(videoDownloadStatusContainer,"section", "compressionOptionsContainer");
        const completeCompressionDownloadButton = basic.createSection(compressionOptionsContainer, "button", "button completeCompressionDownloadButton", `${video_ID}-complete-download-button`, "Generate video compression");
        // action on button click
        completeCompressionDownloadButton.onclick = (e) => {
          e.preventDefault();  
          completeDownloadRequest(video_ID);  
        };  
        // delete video button
        const deleteVideoButton = basic.createSection(compressionOptionsContainer, "button", "deleteVideoButton", undefined, "Delete");
        // action on button click
        deleteVideoButton.onclick = function(e){
          e.preventDefault();
          deleteVideoButton.remove();
          const confirmationButton = basic.createSection(compressionOptionsContainer, "button", "deleteVideoButton2", undefined, "Confirm");
          confirmationButton.onclick = function(e){
            e.preventDefault();
            deleteVideoDataPermanently(video_ID);
            if (savedVideosThumbnailContainer) {
              //remove video from /saved/videos
              document.getElementById(video_ID).remove();
              // delete searchable array item 
              const searchableArrayItemId = search.searchableVideoDataArray.findIndex(x => x.info.id === video_ID);
              search.searchableVideoDataArray.splice(searchableArrayItemId, 1);
              // display either noAvailableVideosDetails or noSearchableVideoData depending on the senario if no availabe videos
              search.noAvailableOrSearchableVideoMessage();
            }
          };
        };
        return "compression unfinished";
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
        return "Display Video Download Details";
      }   
    }
  } catch (error) {
    return error;
  }
}
 
export async function completeDownloadRequest(filename) {
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
      if (downloadStatus == "redownload thumbnails & compression") {
        notify.message("success",`Redownload Thumbnails & Compression: ${filename}`);
        return `Redownload Thumbnails & Compression: ${filename}`;
      } else if(downloadStatus == "redownload thumbnails"){
        notify.message("success",`Redownload Thumbnails: ${filename}`);
        return `Redownload Thumbnails: ${filename}`;
      } else if (downloadStatus == "redownload compression") {
        notify.message("success",`Redownload Compression: ${filename}`);
        return `Redownload Compression: ${filename}`;
      } else if(downloadStatus == "untrunc broke video"){
        notify.message("success",`Untrunc Broke Video: ${filename}`);
        return `Untrunc Broke Video: ${filename}`;
      } else if(downloadStatus == "download status: completed"){
        notify.message("success",`Download Completed: ${filename}`);
        return `Download Completed: ${filename}`;
      } else { 
        notify.message("success","Invalid Current Downlods ID");
        return "Invalid Current Downlods ID";
      } 
    } else {
      notify.message("error","Failed to Complete Request");
      return "Failed to Complete Request";
    }
  } catch (error) {
    return error;
  }  
}  

// updated show current downloads
export function update_show_current_downloads(bool){ 
  if (typeof bool == "boolean") {
    show_current_downloads_clicked = bool;
    return show_current_downloads_clicked;
  } else {
    return "input has to be boolean";
  }
}

// Start Fetching Available Video Download Details 
export function loadAvailableVideoDownloadDetails(){ 
  update_show_current_downloads(true);
  VideoDownloadDetailsInterval = setInterval(loadVideoDetails, 50);
  return "start fetch available download video details";
}

// Stop Fetching Available Video Download Details
export function stopAvailableVideoDownloadDetails(){ 
  update_show_current_downloads(false);
  clearInterval(VideoDownloadDetailsInterval); 
  return "stop fetch available download video details"; 
}

// send request to server to delete video and all video data permently from the system
export async function deleteVideoDataPermanently(videoID) {
  try {
    const payload = {
      id: videoID
    };  
    const response = await fetch("../delete-video-data-permanently", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); 
    if (response.ok) {
      const deleteVideoStatus = await response.json(); 
      if (deleteVideoStatus == `deleted-${videoID}-permanently`) {
        notify.message("success",`Deleted: ${videoID}`);   
        const videoDownloadStatusContainer = document.getElementById(`${videoID}-download-status-container`);    
        if(videoDownloadStatusContainer !== null){
          videoDownloadStatusContainer.remove();  
        }
        return "video data permanently deleted";
      } else {
        notify.message("error",`Failed Delete: ${videoID}`); 
        return "failed to delete video data permanently";
      }  
    } else { 
      notify.message("error",`Failed Delete: ${videoID}`); 
      return "Request Error";
    }
  } catch (error) { 
    return error;
  }
}
