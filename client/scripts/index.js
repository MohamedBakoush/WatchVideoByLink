import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";
import * as videoPlayer from "../scripts/video-player.js";
import * as uploadVideo from "../scripts/upload-video.js";
import * as navigationBar from "../scripts/navigation-bar.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js"; 

// get video link and video type from the url
export function showVideoFromUrl(url) {
  try {     
    if (url.includes("?t=") && url.includes("?v=")) {
      // split url to get video and video type
      const hostname_typeVideo = url.split("?t=");
      const type_video = hostname_typeVideo[1].split("?v=");
      const type = type_video[0];
      const video = type_video[1];  
      history.replaceState(null, "", `?t=${type}?v=${video}`);         
      // put video src and type in video player
      videoPlayer.showVideo(video, type);
      return "showVideoFromUrl";
    } else {
      history.replaceState(null, "", "/");
      navigationBar.loadNavigationBar(); 
      return "redirect to homepage";
    }
  } catch (error) {
    return "showVideoFromUrl didnt work";
  }
}

// load details into html using video and videoLink id
export function showDetails() { 
  // input video link container
  const videoLink = basic.createElement(basic.websiteContentContainer(), "section", {
    classList : "videoLinkContainer",
    id : "videoLinkContainer"
  }); 
  // create form
  const videoLinkForm = basic.createElement(videoLink, "form", {
    classList : "videoLinkContainerForm"
  }); 
  videoLinkForm.onsubmit = function(){
    return false;
  };
  // video src
  const videoLinkInputBody = basic.createElement(videoLinkForm, "section", {
    classList : "videoLinkInputBody"
  }); 
  const videoLinkInputLabel = basic.createElement(videoLinkInputBody, "label", {
    classList : "videoLinkInputLabel"
  }); 
  const videoLinkInputContainer = basic.createElement(videoLinkInputLabel, "section", {
    classList : "videoLinkInputContainer"
  }); 
  basic.createElement(videoLinkInputContainer, "section", {
    textContent : "Video Link: "
  }); 
  const videoLinkInput = basic.createElement(videoLinkInputContainer, "input", {
    type : "text",
    id : "videoLinkInput",
    classList : "videoLinkInput",
    placeholder : "Enter Video Link",
    required : true
  });
  //video type
  const videoLinkTypeBody = basic.createElement(videoLinkForm, "section", {
    classList : "videoTypeInputBody"
  }); 
  const videoLinkTypeLabel = basic.createElement(videoLinkTypeBody, "label", {
    classList : "videoTypeInputLabel"
  }); 
  const videoLinkTypeContainer = basic.createElement(videoLinkTypeLabel, "section", {
    classList : "videoTypeInputContainer"
  }); 
  basic.createElement(videoLinkTypeContainer, "section", {
    textContent : "Video Type: "
  }); 
  const videoTypeSelect = basic.createElement(videoLinkTypeContainer, "select", {
    classList : "videoTypeSelect",
    id: "select"
  }); 
  // all the diffrent types of video that can be choosen 
  basic.createElement(videoTypeSelect, "option", {
    value : "Automatic", 
    textContent : "Automatic"
  });
  basic.createElement(videoTypeSelect, "option", {
    value : "video/mp4", 
    textContent : "MP4 (.mp4)"
  });
  basic.createElement(videoTypeSelect, "option", {
    value : "application/x-mpegURL", 
    textContent : "HLS (.m3u8)"
  });
  basic.createElement(videoTypeSelect, "option", {
    value : "video/webm", 
    textContent : "WebM (.webm)"
  });
  basic.createElement(videoTypeSelect, "option", {
    value : "application/dash+xml", 
    textContent :"MPEG-DASH (.mpd)"
  });
  // submit video button
  const submitVideoButtonContainer = basic.createElement(videoLinkForm, "section", {
    classList : "submitVideoButtonContainer"
  }); 
  basic.createElement(submitVideoButtonContainer, "input", {
    type : "submit",
    value : "Watch Video",
    classList : "button watchVideoButton"
  });
  // once sumbitVideo button is clicked
  videoLinkForm.onsubmit = function(){
    if(document.getElementById("download-status-container"))  {
      document.getElementById("download-status-container").remove(); 
      currentVideoDownloads.stopAvailableVideoDownloadDetails(); 
    }
    if (videoTypeSelect.value === "Automatic") {
      getVideoUrlAuto(videoLinkInput.value);
      // remove videoLink from client
      videoLink.remove();
      // remove navBar
      document.getElementById("headerContainer").remove();
    } else {
      // puts video type and video file in url
      history.pushState(null, "", `?t=${videoTypeSelect.value}?v=${videoLinkInput.value}`);
      // remove videoLink from client
      videoLink.remove();
      // remove navBar
      document.getElementById("headerContainer").remove();
      // put video src and type in video player
      videoPlayer.showVideo(videoLinkInput.value, videoTypeSelect.value);
    }
  };
  // reset folder path
  folderData.resetInsideFolderID();
  // Create upload video 
  uploadVideo.uploadVideoDetails(videoLink);
  return "showDetails";
}
// video type Automatic activated function
export function getVideoUrlAuto(URL) {
  if (typeof URL !== "string") return "input not string";  
  history.pushState(null, "", `?auto=${URL}`); 
  document.title = `Searching for video link: ${URL} - WatchVideoByLink`; 
  document.body.classList = "index-body";
  basic.websiteContentContainer().classList = "index-websiteContentContainer"; 
  const searchVideoTypeContainer = basic.createElement(basic.websiteContentContainer(), "section", {
    classList : "getVideoUrlAutoMessageConatinaer"
  }); 
  basic.createElement(searchVideoTypeContainer, "h1", {
    classList : "getVideoUrlAutoMessageHeader",
    textContent : `Searching for video link: ${URL}`
  }); 
  getVideoLinkFromUrl(URL, searchVideoTypeContainer);
  return "getVideoUrlAuto";  
}

// trys to fetch video data from provided url_link
export async function getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer) {
  if (typeof url_link !== "string") return "url_link not string";
  if (searchingForVideoLinkMessageContainer == undefined) return "searchingForVideoLinkMessageContainer undefined";

  // Fetch Request
  const payload = {
    url: url_link
  };
  const response = await fetch("../getVideoLinkFromUrl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let getVideoLinkFromUrl = await response.json();
  const headerContainer = document.getElementById("headerContainer");
  document.title = "WatchVideoByLink";

  // Valid Response 
  if (response.ok && getVideoLinkFromUrl !== "failed-get-video-url-from-provided-url") { 
    if (headerContainer) headerContainer.remove();
    searchingForVideoLinkMessageContainer.remove();
    basic.websiteContentContainer().innerHTML = "";
    history.pushState(null, "", `?t=${getVideoLinkFromUrl.video_file_format}?v=${getVideoLinkFromUrl.video_url}`);
    videoPlayer.showVideo(getVideoLinkFromUrl.video_url, getVideoLinkFromUrl.video_file_format, "Automatic");
    return getVideoLinkFromUrl; 
  } 

  // Invalid Response 
  notify.message("error","Invalid Url Link");
  history.pushState(null, "", "/");
  if(!headerContainer){
    basic.createElement(document.body, "header", {
      id : "headerContainer"
    });  
  }
  navigationBar.loadNavigationBar();
  showDetails();
  searchingForVideoLinkMessageContainer.remove();
  return "Failed to get video link from URL";
}

// all the functions that are to load when the page loads
export function pageLoaded() {
  // when active history entry changes load location.herf
  window.onpopstate = function() {
    window.location.href = location.href;
  };
  // url herf and pathname
  const url_href = window.location.href;
  const url_search = window.location.search;
  const url_pathname = window.location.pathname;
  // show website content depending on url_href/url_pathname
  if (url_href.includes("?t=") && url_href.includes("?v=")) { // play specified video
    // check url for percent encoding
    const url_link = basic.checkForPercentEncoding(url_href);
    showVideoFromUrl(url_link);
    return "Show video from URL";
  } else if (url_href.includes("?auto=")) { // find video data from url link
    const url_link_from_auto = url_href.split("?auto=")[1];
    // check url for percent encoding
    const url_link = basic.checkForPercentEncoding(url_link_from_auto);
    getVideoUrlAuto(url_link);
    return "Get Video URL Auto";
  } else if (url_pathname === "/saved/videos" && url_search == "") { // show saved video homepage
    navigationBar.loadNavigationBar("/saved/videos");
    showAvailableVideos.pageLoaded();
    return "show saved video";
  } else if (url_pathname === "/saved/videos" && url_search !== "") { // show saved video specified path 
    navigationBar.loadNavigationBar("/saved/videos");
    showAvailableVideos.pageLoaded((document.location.search.replaceAll("?=", "")).split("&"));
    return "show saved video";
  } else { // show homepage
    navigationBar.loadNavigationBar();
    showDetails();
    return  "show homepage";
  }  
}

// load pageLoaded when html page loads
addEventListener("load", pageLoaded);
