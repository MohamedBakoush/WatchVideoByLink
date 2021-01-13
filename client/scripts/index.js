import * as videoButton from "../scripts/videoPlayerButtons.js";
import * as basic from "../scripts/basics.js";
import * as navigationBar from "../scripts/navigationBar.js";
import * as showAvailableVideos from "../scripts/showAvailableVideos.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js";
"use strict";

const websiteContentContainer = document.getElementById("websiteContentContainer");

// get video link and video type from the url
function showVideoFromUrl(url) {
    // split url to get video and video type
    const hostname_typeVideo = url.split("?t=");
    const type_video = hostname_typeVideo[1].split( "?v=");
    const type = type_video[0];
    const video = type_video[1];
    // put video src and type in video player
    showVideo(video, type);
}

// load details into html using video and videoLink id
export function showDetails() {
  // input video link container
  const videoLink = basic.createSection(websiteContentContainer, "section", "videoLinkContainer", "videoLinkContainer");
  // create form
  const videoLinkForm = basic.createSection(videoLink, "form");
  videoLinkForm.onsubmit = function(){
    return false;
  };
  // video srcv
  basic.createSection(videoLinkForm, "h4", undefined, undefined,  "Video Link: ");
  const videoLinkInput = basic.inputType(videoLinkForm, "text", "videoLinkInput", "videoLinkInput", true);
  videoLinkInput.placeholder = "Enter Video Link";
  // video type
  basic.createSection(videoLinkForm, "h4", undefined, undefined,  "Video Type: ");
  const videoTypeSelect = basic.createSection(videoLinkForm, "select", "videoTypeSelect", "select");
  // all the diffrent types of video that can be choosen
  basic.createOption(videoTypeSelect, "option", "Automatic", "Automatic");
  basic.createOption(videoTypeSelect, "option", "video/mp4", "MP4 (.mp4)");
  basic.createOption(videoTypeSelect, "option", "application/x-mpegURL", "HLS (.m3u8)");
  basic.createOption(videoTypeSelect, "option", "application/dash+xml", "MPEG-DASH (.mpd)");
  // submit video button
  basic.createInput(videoLinkForm, "submit", "Watch Video", undefined , "button watchVideoButton");
  // once sumbitVideo button is clicked
  videoLinkForm.onsubmit = function(){
    if(document.getElementById("download-status-container"))  {
      const stopInterval = currentVideoDownloads.stopAvailableVideoDownloadDetails(false);  
      if(stopInterval == "cleared Interval"){
        document.getElementById("download-status-container").remove();   
      }
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
      showVideo(videoLinkInput.value, videoTypeSelect.value);
    }
  };
}

// assign video src and type to video id
async function showVideo(videoSrc, videoType, videoLinkFromUrl) {
  // fetch video settings
  const videoPlayerSettings = await getVideoPlayerSettings(); 
  // update info
  document.title = "Watching Video By Provided Link"; 
  document.body.classList = "watching-video-body";
  websiteContentContainer.classList = "watching-video-websiteContentContainer";
  // create video player
  const videoPlayer = basic.createSection(websiteContentContainer, "video-js", "vjs-default-skin vjs-big-play-centered", "video");
  videoPlayer.style.width = "100vw";
  videoPlayer.style.height = "100vh";
  const Button = videojs.getComponent("Button"); // eslint-disable-line
  if (videoType == "application/x-mpegURL") {
    const player = videojs(videoPlayer, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto"
    });

    // record stream
    const StopRecButton = videoButton.stopRecStreamButton(player, Button);
    const RecButton = videoButton.RecStreamButton(player, Button, StopRecButton, videoSrc, videoType);

    videojs.registerComponent("RecButton", RecButton);  // eslint-disable-line
    player.getChild("controlBar").addChild("RecButton", {}, 1);

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls, videoLinkFromUrl); //  closes player
    player.play(); // play video on load
    player.muted(videoPlayerSettings.muted); // set mute video settings on load
    player.volume(videoPlayerSettings.volume);  // set volume video settings on load
    document.getElementById("video_html5_api").onvolumechange = (event) => {  // update global video player volume/mute settings
      updateVideoPlayerVolume(player.volume(), player.muted()); 
    };
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
    // hide time from live video player
    const style = document.createElement("style");
    style.innerHTML = `
      .video-js .vjs-time-control{display:none;}
      .video-js .vjs-remaining-time{display: none;}
    `;
    document.head.appendChild(style);
  } else if ( videoType == "application/dash+xml" ) {
    const player = videojs(videoPlayer, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto"
    });

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls, videoLinkFromUrl); //  closes player
    player.play(); // play video on load
    player.muted(videoPlayerSettings.muted); // set mute video settings on load
    player.volume(videoPlayerSettings.volume);  // set volume video settings on load
    document.getElementById("video_html5_api").onvolumechange = (event) => {  // update global video player volume/mute settings
      updateVideoPlayerVolume(player.volume(), player.muted()); 
    };
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  } else {
    var player = videojs(videoPlayer, {  // eslint-disable-line
      "playbackRates":[0.25,0.5, 1, 1.25, 1.5, 2],
      controls: true,
      techOrder: [ "chromecast", "html5" ],
      plugins: {
        chromecast: {},
        seekButtons: {
          forward: 30,
          back: 10
        }
      }
    });
    const topControls = videoButton.topPageControlBarContainer(player);
    const downloadVideoContainer = basic.createSection(topControls, "div", "vjs-downloadVideo-container");
    const downloadVideoButton = basic.createSection(downloadVideoContainer, "button", "vjs-downloadVideo fa fa-download vjs-control vjs-button", "downloadVideoButton");
    downloadVideoButton.title = "Download Video";

    const downloadVideoMenu = basic.createSection(downloadVideoContainer, "section", "vjs-menu vjs-downloadVideo-menu");
    downloadVideoMenu.style.display = "none";
    const downloadVideoMenuContent = basic.createSection(downloadVideoMenu, "div", "vjs-menu-content");

    videoButton.downloadVideoButton(downloadVideoMenuContent, videoSrc, videoType);
    videoButton.createTrimVideo(player, downloadVideoContainer, downloadVideoMenu,downloadVideoButton, downloadVideoMenuContent, videoSrc, videoType);

    downloadVideoContainer.onmouseover = function(){
      document.getElementById("downloadVideoButton").focus();
      downloadVideoMenu.style.display = "block";
      document.getElementById("downloadVideoButton").onclick = document.getElementById("downloadVideoButton").blur();
    };
    downloadVideoContainer.onmouseout = function(){
      document.getElementById("downloadVideoButton").blur();
      downloadVideoMenu.style.display = "none";
    };

    videoButton.backToHomePageButton(topControls, videoLinkFromUrl); //  closes player
    player.play(); // play video on load
    player.muted(videoPlayerSettings.muted); // set mute video settings on load
    player.volume(videoPlayerSettings.volume);  // set volume video settings on load 
    document.getElementById("video_html5_api").onvolumechange = (event) => { // update global video player volume/mute settings
      updateVideoPlayerVolume(player.volume(), player.muted()); 
    };  
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  }
}

// get video player settings
async function getVideoPlayerSettings() {
  const response = await fetch(`../getVideoPlayerSettings`);
  let videoPlayerSettings
  if(response.ok){
    videoPlayerSettings = await response.json();  
    return videoPlayerSettings;
  }else {
    // failed to fetch video settings
    videoPlayerSettings = {
      volume: 1.0,
      muted: false
    } 
    return videoPlayerSettings; 
  }
}

// update video player volume settings
async function updateVideoPlayerVolume(volume, muted) {
  const payload = {  // data sending in fetch request
    updatedVideoPlayerVolume : volume,
    updatedVideoPlayerMuted : muted
  };
  const response = await fetch("../updateVideoPlayerVolume", { // look for video data from provided url_link
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let updatedVideoPlayerVolume;
  if (response.ok) { 
    updatedVideoPlayerVolume = await response.json(); 
  }else {
    updatedVideoPlayerVolume = { msg: "failed to update video volume messages" };
  }
}

// video type Automatic activated function
function getVideoUrlAuto(url_link) {
  // change address bar
  history.pushState(null, "", `?auto=${url_link}`);
  // change document title
  document.title = `Searching for video link: ${url_link} - Watch Video By Provided Link`;
  // change css
  document.body.classList = "index-body";
  websiteContentContainer.classList = "index-websiteContentContainer";
  // searchingForVideoLinkMessage
  const searchingForVideoLinkMessageContainer = basic.createSection(websiteContentContainer, "section", "getVideoUrlAutoMessageConatinaer");
  basic.createSection(searchingForVideoLinkMessageContainer, "h1", "getVideoUrlAutoMessageHeader", undefined,  `Searching for video link: ${url_link}`);
  // look for video data from url_link
  getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer);
}

// trys to fetch video data from provided url_link
async function getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer) {
  try {
    const payload = {  // data sending in fetch request
      url: url_link
    };
    const response = await fetch("../getVideoLinkFromUrl", { // look for video data from provided url_link
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("waiting for video url and file type");
    let getVideoLinkFromUrl;
    const headerContainer = document.getElementById("headerContainer");
    // fetch response
    if (response.ok) {
      // get json data from response
      getVideoLinkFromUrl = await response.json();
      // change document title
      document.title = "Watch Video By Provided Link";
      // if url_link provided failed to get required video data
      if (getVideoLinkFromUrl == "failed-get-video-url-from-provided-url") {
        // invalid url alert msg
        basic.notify("error",`Invalid Url Link`);
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
      } else { // if url_link provided is good
        if (headerContainer) { // if headerContainer exists remove headerContainer
          headerContainer.remove();
        }
        // reamove searching for viddeo link msg
        searchingForVideoLinkMessageContainer.remove();
        // make sure that websiteContentContainer is empty
        websiteContentContainer.innerHTML = "";
        // change address bar
        history.pushState(null, "", `?t=${getVideoLinkFromUrl.video_file_format}?v=${getVideoLinkFromUrl.video_url}`);
        // put video src and type in video player
        showVideo(getVideoLinkFromUrl.video_url, getVideoLinkFromUrl.video_file_format, "Automatic");
      }
    } else { // give getVideoLinkFromUrl failed response msg
      getVideoLinkFromUrl = { msg: "failed to load messages" };
    }
    // return getVideoLinkFromUrl
    return getVideoLinkFromUrl;
  } catch (e) { // when an error occurs
    // if responseErrorAvailableVideo id dosent exist
    if (!document.getElementById("responseErrorAvailableVideo")) {
      // remove searchingForVideoLinkMessageContainer
      searchingForVideoLinkMessageContainer.remove();
      // change document title
      document.title = "Watch Video By Provided Link";
      // change addressbar
      history.pushState(null, "", "/");
      // add back header to document body
      basic.createSection(document.body, "header", undefined, "headerContainer");
      // naviagtionbar content
      navigationBar.loadNavigationBar();
      // show error msg
      const responseError = basic.createSection(websiteContentContainer, "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
      basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
    }
  }
}

// all the functions that are to load when the page loads
function pageLoaded() {
    // when active history entry changes load location.herf
    window.onpopstate = function() {
      window.location.href = location.href;
    };
    // url herf and pathname
    const url_href = window.location.href;
    const url_pathname = window.location.pathname;
    // show website content depending on url_href/url_pathname
    if (url_href.includes("?t=") && url_href.includes("?v=")) { // play specified video
      showVideoFromUrl(url_href);
    } else if (url_href.includes("?auto=")) { // find video data from url link
      const url_link_from_auto = url_href.split("?auto=")[1];
      getVideoUrlAuto(url_link_from_auto);
    } else if (url_pathname === "/saved/videos") { // show saved video
      navigationBar.loadNavigationBar("/saved/videos");
      showAvailableVideos.pageLoaded();
    } else { // show homepage
      navigationBar.loadNavigationBar();
      showDetails();
    }
 }

// load pageLoaded when html page loads
addEventListener("load", pageLoaded);
