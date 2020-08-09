import * as videoButton from "../scripts/videoPlayerButtons.js";
import * as basic from "../scripts/basics.js";
"use strict";

// identify elements from html
const videoID = document.getElementById("video");
const videoLink = document.getElementById("videoLinkContainer");

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
function showDetails() {
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
  basic.createOption(videoTypeSelect, "option", "video/mp4", "MP4 (.mp4)");
  basic.createOption(videoTypeSelect, "option", "application/x-mpegURL", "HLS (.m3u8)");
  basic.createOption(videoTypeSelect, "option", "application/dash+xml", "MPEG-DASH (.mpd)");
  // submit video button
  basic.createInput(videoLinkForm, "submit", "Watch Video", undefined , "button watchVideoButton");
  // once sumbitVideo button is clicked
  videoLinkForm.onsubmit = function(){
    // puts video type and video file in url
    history.pushState(null, "", `?t=${videoTypeSelect.value}?v=${videoLinkInput.value}`);
    // remove videoLink from client
    videoLink.remove();
    // video styleing
    videoID.style.width = "100vw";
    videoID.style.height = "100vh";
    // put video src and type in video player
    showVideo(videoLinkInput.value, videoTypeSelect.value);
  };
}

// assign video src and type to video id
function showVideo(videoSrc, videoType) {
  const Button = videojs.getComponent("Button"); // eslint-disable-line
  if (videoType == "application/x-mpegURL") {
    const videoID = document.getElementById("video");
    const player = videojs(videoID, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto"
    });

    const StopRecButton = videojs.extend(Button, { // eslint-disable-line
      constructor: function() {
          Button.apply(this, arguments);
          /* initialize your button */
          this.controlText("Stop Record");
      },
      createEl: function() {
        return Button.prototype.createEl("button", {
          className: "vjs-icon-stop-record fas fa-square vjs-control vjs-button"
        });
      },
      handleClick: function() {
            /* do something on click */
         videoButton.stopDownloadVideoStream(true).then( () => {
           console.log("stop downloading");
           this.hide();
           videojs.registerComponent("RecButton", RecButton); // eslint-disable-line
           player.getChild("controlBar").addChild("RecButton", {}, 1);

           videoButton.removeStopDownloadOnWindowClose();
         });
      }
    });

    const RecButton = videojs.extend(Button, { // eslint-disable-line
      constructor: function() {
          Button.apply(this, arguments);
          /* initialize your button */
          this.controlText("Record");
      },
      createEl: function() {
          return Button.prototype.createEl("button", {
          className: "vjs-icon-circle vjs-icon-record-start vjs-control vjs-button"
        });
      },
      handleClick: function() {
        /* do something on click */
       videoButton.downloadVideoStream(videoSrc, videoType).then( () => {
         console.log("downloading");
           this.hide();
           videojs.registerComponent("StopRecButton", StopRecButton); // eslint-disable-line
           player.getChild("controlBar").addChild("StopRecButton", {}, 1);

           videoButton.addStopDownloadOnWindowClose();
       });
      }
    });

    videojs.registerComponent("RecButton", RecButton);  // eslint-disable-line
    player.getChild("controlBar").addChild("RecButton", {}, 1);

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls); //  closes player
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
    const videoID = document.getElementById("video");
    const player = videojs(videoID, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto"
    });

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls); //  closes player
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
    const videoID = document.getElementById("video");
    var player = videojs(videoID, {  // eslint-disable-line
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

    videoButton.backToHomePageButton(topControls); //  closes player
    player.play(); // play video on load
    player.muted(true); // mute video on load
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  }
}

// all the functions that are to load when the page loads
function pageLoaded() {
    const url = window.location.href;
    if (url.includes("?t=") && url.includes("?v=")) {
      // remove videoLink from client
      videoLink.remove();
      // video styleing
      videoID.style.width = "100vw";
      videoID.style.height = "100vh";
      showVideoFromUrl(url);
    } else {
      showDetails();
    }
 }

// load pageLoaded when html page loads
addEventListener("load", pageLoaded);
