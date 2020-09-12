import * as videoButton from "../scripts/videoPlayerButtons.js";
import * as basic from "../scripts/basics.js";
import * as navigationBar from "../scripts/navigationBar.js";
import * as showAvailableVideos from "../scripts/showAvailableVideos.js";
"use strict";

const websiteContentContainer = document.getElementById("websiteContentContainer");

// show video from url
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
function showVideo(videoSrc, videoType, videoLinkFromUrl) {
  document.title = "Watching Video By Provided Link";
  document.body.classList = "watching-video-body";
  websiteContentContainer.classList = "watching-video-websiteContentContainer";
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

    const StopRecButton = videoButton.stopRecStreamButton(player, Button);
    const RecButton = videoButton.RecStreamButton(player, Button, StopRecButton, videoSrc, videoType);

    videojs.registerComponent("RecButton", RecButton);  // eslint-disable-line
    player.getChild("controlBar").addChild("RecButton", {}, 1);

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls, videoLinkFromUrl); //  closes player
    player.play(); // play video on load
    player.muted(true); // mute video on load
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
    player.muted(true); // mute video on load
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
    videoButton.createTrimVideo(downloadVideoContainer, downloadVideoMenu,downloadVideoButton, downloadVideoMenuContent, videoSrc, videoType);

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
    player.muted(true); // mute video on load
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  }
}

function getVideoUrlAuto(url_link) {
  history.pushState(null, "", `?auto=${url_link}`);
  document.title = `Searching for video link: ${url_link} - Watch Video By Provided Link`;
  document.body.classList = "index-body";
  websiteContentContainer.classList = "index-websiteContentContainer";
  const searchingForVideoLinkMessageContainer = basic.createSection(websiteContentContainer, "section", "getVideoUrlAutoMessageConatinaer");
  basic.createSection(searchingForVideoLinkMessageContainer, "h1", undefined, undefined,  `Searching for video link: ${url_link}`);
  getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer);
}

async function getVideoLinkFromUrl(url_link, searchingForVideoLinkMessageContainer) {
  const payload = {
    url: url_link
  };
  const response = await fetch("../getVideoLinkFromUrl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("waiting for video url and file type");
  let getVideoLinkFromUrl;
  const headerContainer = document.getElementById("headerContainer");
  if (response.ok) {
    getVideoLinkFromUrl = await response.json();
    document.title = "Watch Video By Provided Link";
    // puts video type and video file in url
    if (getVideoLinkFromUrl == "failed-get-video-url-from-provided-url") {
      console.log("failed");
      alert("Invalid Url Link.");
      history.pushState(null, "", "/");
      // replace
      if(headerContainer){
        navigationBar.loadNavigationBar();
        showDetails();
      } else{
        basic.createSection(document.body, "header", undefined, "headerContainer");
        navigationBar.loadNavigationBar();
        showDetails();
      }
      searchingForVideoLinkMessageContainer.remove();
    } else {
      if (headerContainer) {
        headerContainer.remove();
      }
      // document.getElementById("headerContainer").remove();
      searchingForVideoLinkMessageContainer.remove();
      websiteContentContainer.innerHTML = "";
      history.pushState(null, "", `?t=${getVideoLinkFromUrl.video_file_format}?v=${getVideoLinkFromUrl.video_url}`);
      // put video src and type in video player
      showVideo(getVideoLinkFromUrl.video_url, getVideoLinkFromUrl.video_file_format, "Automatic");
    }
  } else {
    getVideoLinkFromUrl = { msg: "failed to load messages" };
  }

 return getVideoLinkFromUrl;
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
    // only play video
    if (url_href.includes("?t=") && url_href.includes("?v=")) {
      showVideoFromUrl(url_href);
    } else if (url_href.includes("?auto=")) {
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
