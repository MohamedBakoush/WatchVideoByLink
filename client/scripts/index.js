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
  const videoLink = basic.createSection(basic.websiteContentContainer(), "section", "videoLinkContainer", "videoLinkContainer");
  // create form
  const videoLinkForm = basic.createSection(videoLink, "form", "videoLinkContainerForm");
  videoLinkForm.onsubmit = function(){
    return false;
  };
  // video src
  const videoLinkInputBody = basic.createSection(videoLinkForm, "section", "videoLinkInputBody");
  const videoLinkInputLabel = basic.createSection(videoLinkInputBody, "label", "videoLinkInputLabel");
  const videoLinkInputContainer = basic.createSection(videoLinkInputLabel, "section" , "videoLinkInputContainer");
  basic.createSection(videoLinkInputContainer, "section", undefined, undefined,  "Video Link: ");
  const videoLinkInput = basic.createElement(videoLinkInputContainer, "input", {
    type : "text",
    id : "videoLinkInput",
    classList : "videoLinkInput",
    placeholder : "Enter Video Link",
    required : true
  });
  //video type
  const videoLinkTypeBody = basic.createSection(videoLinkForm, "section", "videoTypeInputBody");
  const videoLinkTypeLabel = basic.createSection(videoLinkTypeBody, "label", "videoTypeInputLabel");
  const videoLinkTypeContainer = basic.createSection(videoLinkTypeLabel, "section", "videoTypeInputContainer");
  basic.createSection(videoLinkTypeContainer, "section", undefined, undefined,  "Video Type: ");
  const videoTypeSelect = basic.createSection(videoLinkTypeContainer, "select", "videoTypeSelect", "select"); 
  // all the diffrent types of video that can be choosen 
  basic.createOption(videoTypeSelect, "Automatic", "Automatic");
  basic.createOption(videoTypeSelect, "video/mp4", "MP4 (.mp4)");
  basic.createOption(videoTypeSelect, "application/x-mpegURL", "HLS (.m3u8)");
  basic.createOption(videoTypeSelect, "video/webm", "WebM (.webm)"); 
  basic.createOption(videoTypeSelect, "application/dash+xml", "MPEG-DASH (.mpd)");
  // submit video button
  const submitVideoButtonContainer = basic.createSection(videoLinkForm, "section", "submitVideoButtonContainer");
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
export function getVideoUrlAuto(url_link) {
  if (typeof url_link !== "string") {
    return "url_link not string";
  } else {
    // change address bar
    history.pushState(null, "", `?auto=${url_link}`);
    // change document title
    document.title = `Searching for video link: ${url_link} - WatchVideoByLink`;
    // change css
    document.body.classList = "index-body";
    basic.websiteContentContainer().classList = "index-websiteContentContainer";
    // searchingForVideoLinkMessage
    const searchingForVideoLinkMessageContainer = basic.createSection(basic.websiteContentContainer(), "section", "getVideoUrlAutoMessageConatinaer");
    basic.createSection(searchingForVideoLinkMessageContainer, "h1", "getVideoUrlAutoMessageHeader", undefined,  `Searching for video link: ${url_link}`);
    // look for video data from url_link
    getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer);
    return "getVideoUrlAuto"; 
  }
}

// trys to fetch video data from provided url_link
export async function getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer) {
  if (typeof url_link !== "string") {
    return "url_link not string";
  } else if (searchingForVideoLinkMessageContainer == undefined) {
    return "searchingForVideoLinkMessageContainer undefined";
  } else {
    try {
      const payload = {  // data sending in fetch request
        url: url_link
      };
      const response = await fetch("../getVideoLinkFromUrl", { // look for video data from provided url_link
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let getVideoLinkFromUrl;
      const headerContainer = document.getElementById("headerContainer");
      // fetch response
      if (response.ok) {
        // get json data from response
        getVideoLinkFromUrl = await response.json();
        // change document title
        document.title = "WatchVideoByLink";
        // if url_link provided failed to get required video data
        if (getVideoLinkFromUrl == "failed-get-video-url-from-provided-url") {
          // invalid url alert msg
          notify.message("error","Invalid Url Link");
          // change address bar
          history.pushState(null, "", "/");
          // load index details into html
          if(headerContainer){ // if headerContainer exists
            navigationBar.loadNavigationBar();
            showDetails();
          } else{ // if headerContainer dosnet exists
            basic.createSection(document.body, "header", undefined, "headerContainer");
            navigationBar.loadNavigationBar();
            showDetails();
          }
          // reamove searching for viddeo link msg
          searchingForVideoLinkMessageContainer.remove();
          return "Failed to get video link from URL";
        } else { // if url_link provided is good
          if (headerContainer) { // if headerContainer exists remove headerContainer
            headerContainer.remove();
          }
          // reamove searching for viddeo link msg
          searchingForVideoLinkMessageContainer.remove();
          // make sure that websiteContentContainer is empty
          basic.websiteContentContainer().innerHTML = "";
          // change address bar
          history.pushState(null, "", `?t=${getVideoLinkFromUrl.video_file_format}?v=${getVideoLinkFromUrl.video_url}`);
          // put video src and type in video player
          videoPlayer.showVideo(getVideoLinkFromUrl.video_url, getVideoLinkFromUrl.video_file_format, "Automatic");
          return getVideoLinkFromUrl;
        }
      } else {
        return "Failed to get video link from URL";
      }
    } catch (e) { // when an error occurs
      // if responseErrorAvailableVideo id dosent exist
      if (!document.getElementById("responseErrorAvailableVideo")) {
        // remove searchingForVideoLinkMessageContainer
        searchingForVideoLinkMessageContainer.remove();
        // change document title
        document.title = "WatchVideoByLink";
        // change addressbar
        history.pushState(null, "", "/");
        // add back header to document body
        basic.createSection(document.body, "header", undefined, "headerContainer");
        // naviagtionbar content
        navigationBar.loadNavigationBar();
        // show error msg
        const responseError = basic.createSection(basic.websiteContentContainer(), "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
        basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
      }
      return "Failed fetch video link from URL";
    }
  }
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
