import * as videoButton from "../scripts/videoPlayerButtons.js";
import * as basic from "../scripts/basics.js";
import * as navigationBar from "../scripts/navigationBar.js";
import * as showAvailableVideos from "../scripts/showAvailableVideos.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js"; 

// get video link and video type from the url
function showVideoFromUrl(url) {
    // split url to get video and video type
    const hostname_typeVideo = url.split("?t=");
    const type_video = hostname_typeVideo[1].split( "?v=");
    const type = type_video[0];
    const video = type_video[1];  
    history.replaceState(null, "", `?t=${type}?v=${video}`); 
    // put video src and type in video player
    showVideo(video, type);
}

// load details into html using video and videoLink id
export function showDetails() { 
  // input video link container
  const videoLink = basic.createSection(basic.websiteContentContainer, "section", "videoLinkContainer", "videoLinkContainer");
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
  const videoLinkInput = basic.inputType(videoLinkInputContainer, "text", "videoLinkInput", "videoLinkInput", true);
  videoLinkInput.placeholder = "Enter Video Link";
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
  basic.createInput(submitVideoButtonContainer, "submit", "Watch Video", undefined , "button watchVideoButton");
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
  // Create upload video 
  uploadVideoDetails(videoLink);
}


function uploadVideoDetails(videoLink){  
  // upload video container
  const uploadVideoForm = basic.createSection(videoLink, "form", "uploadVideoContainer", "uploadVideoContainer");  
  uploadVideoForm.onsubmit = function(){
    return false;
  };
  // submit video button container
  const submitUploadVideoButtonContainer = basic.createSection(uploadVideoForm, "section", "submitUploadVideoButtonContainer");
  // choose video input body
  const chooseVideoInputBody = basic.createSection(submitUploadVideoButtonContainer, "section", "chooseVideoInputBody");
  // choose video input label
  const chooseVideoInputLabel = basic.createSection(chooseVideoInputBody, "label", "chooseVideoInputLabel");
  // select video to input
  const inputUploadVideo = basic.createInput(chooseVideoInputLabel, "file");  
  inputUploadVideo.accept = "video/*";
  inputUploadVideo.name = "file";
  inputUploadVideo.required = true;
  // submit choosen video button container
  const submitChoosenVideoButtonContainer = basic.createSection(submitUploadVideoButtonContainer, "section", "submitChoosenVideoButtonContainer");
  // upload Video button
  basic.createInput(submitChoosenVideoButtonContainer, "submit", "Upload Video", undefined , "button uploadVideoButton");
  // once upload Video button is clicked
  uploadVideoForm.onsubmit = function(){ 
    const file = inputUploadVideo.files[0]; 
    // file size has to be smaller then 1 GB to be uploaded to server
    if (file.size > (1024 * 1024 * 1024)) {  
      // remove upload Video container 
      uploadVideoForm.remove();
      uploadVideoDetails(videoLink);
      // error msg
      basic.notify("error", "Size Error: Unable to upload videos greater then 1 GB");
    } else {
      // remove upload Video container
      uploadVideoForm.remove();  
      // create new upload Video container
      const newUploadVideoForm = basic.createSection(videoLink, "section", "uploadVideoContainer", "uploadVideoContainer"); 
      // create new submit Video button container
      basic.createSection(newUploadVideoForm, "section", "submitUploadVideoButtonContainer", undefined, `Uploading: ${file.name}`); 
      // upload video file 
      uploadFile(inputUploadVideo, videoLink, newUploadVideoForm);
    }
  };
}

async function uploadFile(data, videoLink, newUploadVideoForm){  
  try {
    // notification to user 
    basic.notify("success", "Uploading: video to server");
    // holds file once its been choosen
    const formData = new FormData(); 
    // sends file + file data to server 
    formData.append("file", data.files[0]);
    const response = await fetch("/uploadVideoFile",{ 
      method: "POST",
      body: formData
    });
    // fetch response
    if (response.ok) {
      const returnedValue = await response.json();
      // notification from response
      if(returnedValue == "downloading-uploaded-video") { 
        basic.notify("success", "Downloading: uploaded video"); 
      } else if (returnedValue == "video-size-over-size-limit") { 
        console.log("Size Error: Attempted video upload has a size greater then 1 GB");
        basic.notify("error","Size Error: Attempted video upload has a size greater then 1 GB");
      } else if (returnedValue == "Cannot-find-ffmpeg-ffprobe") {
        console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
        basic.notify("error","Encoding Error: Cannot find ffmpeg and ffprobe ");
      } else if (returnedValue == "Cannot-find-ffmpeg") {
        console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
        basic.notify("error","Encoding Error: Cannot find ffmpeg");
      } else if (returnedValue == "Cannot-find-ffprobe") {
        console.log("Encoding Error: Cannot find ffprobe");
        basic.notify("error","Encoding Error: Cannot find ffprobe");
      } else if (returnedValue == "ffmpeg-failed") {
        console.log("Encoding Error: ffmpeg failed");
        basic.notify("error","Encoding Error: ffmpeg failed");
      }
      // execute function showDetails()  
      if(document.getElementById("uploadVideoContainer")){   
        newUploadVideoForm.remove();
        uploadVideoDetails(videoLink);
      } 
    } else { 
      // execute function showDetails()  
      if(document.getElementById("uploadVideoContainer")){   
        newUploadVideoForm.remove();
        uploadVideoDetails(videoLink);
      } 
      // request error msg 
      basic.notify("error","Error: Request Error.");
    }
  } catch (e) {  // when an error occurs
    // execute function showDetails()  
    if(document.getElementById("uploadVideoContainer")){   
      newUploadVideoForm.remove();
      uploadVideoDetails(videoLink);
    } 
    // error msg 
    basic.notify("error","Error: Connection Refused.");
  }
}

// assign video src and type to video id
async function showVideo(videoSrc, videoType, videoLinkFromUrl) {
  // fetch video settings
  const videoPlayerSettings = await getVideoPlayerSettings(); 
  // update info
  document.title = "Watching Video By Provided Link"; 
  document.body.classList = "watching-video-body";
  basic.websiteContentContainer.classList = "watching-video-websiteContentContainer";
  let displayChromecast;
  try {    
    if (videoPlayerSettings.chromecast == true) {
      displayChromecast = true;
    } else {
      displayChromecast = false;
    }
  } catch (error) {
    displayChromecast = false;
  }
  // create video player
  const videoPlayer = basic.createSection(basic.websiteContentContainer, "video-js", "vjs-default-skin vjs-big-play-centered", "video");
  videoPlayer.style.width = "100vw";
  videoPlayer.style.height = "100vh";
  const Button = videojs.getComponent("Button"); // eslint-disable-line
  if (videoType == "application/x-mpegURL") {
    const player = videojs(videoPlayer, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto",
      html5: {
        vhs: {
          overrideNative: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false 
      }
    });  

    // change icon from vjs-icon-cog to vjs-icon-hd - needs to be implemented better
    const httpSourceSelectorIconChange = document.createElement("style");
    httpSourceSelectorIconChange.innerHTML = ".vjs-icon-cog:before { content: \"\\f114\"; font-size: 16px; }";
    document.head.appendChild(httpSourceSelectorIconChange);

    const qualityLevels = player.qualityLevels(); 
    // disable quality levels with less one qualityLevel options
    qualityLevels.on("addqualitylevel", function(event) {
      let qualityLevel = event.qualityLevel; 
      if(qualityLevels.levels_.length <= 1){ 
        // dont show httpSourceSelector
        qualityLevel.enabled = false;
      } else{  
        // show httpSourceSelector
        player.httpSourceSelector();
        qualityLevel.enabled = true;
      } 
    });

    let hlsVideoSrc; 
    try { 
      // check if desired chunklist is in videoSrc
      if(videoSrc.substr(videoSrc.length - 4) == "m3u8"){ 
        // get chunklist
        const chunklist = videoSrc.substring( 
          videoSrc.lastIndexOf("/") + 1, 
          videoSrc.lastIndexOf(".m3u8")
        );   
        // if chunklist contains chunklist 
        if(chunklist.includes("chunklist")){ 
          // hls video src == new video src
          hlsVideoSrc = videoSrc.slice(0,videoSrc.lastIndexOf("/")+1) + "playlist" + ".m3u8";
          // replace url from orignial video src to new video src
          history.replaceState(null, "", `?t=${videoType}?v=${hlsVideoSrc}`);
        } else{ // orignial video src = hls video src
          hlsVideoSrc = videoSrc;
        } 
      } else{ // orignial video src = hls video src
        hlsVideoSrc = videoSrc;  
      }
    } catch (error) { // if error orignial video src = hls video src
      hlsVideoSrc = videoSrc;  
    } 
    
    // video hotkeys
    // eslint-disable-next-line no-undef
    videojs(videoPlayer).ready(function() {
      this.hotkeys({
        volumeStep: 0.05,
        seekStep: false,
        enableModifiersForNumbers: false,
        // just in case seekStep is active, return undefined
        forwardKey: function() {
          // override forwardKey to not trigger when pressed
          return undefined;
        },
        rewindKey: function() { 
          // override rewindKey to not trigger when pressed
          return undefined;
        }
      });
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
    document.getElementById("video_html5_api").onvolumechange = () => {  // update global video player volume/mute settings
      updateVideoPlayerVolume(player.volume(), player.muted()); 
    };
    player.src({  // video type and src
      type: videoType,
      src: hlsVideoSrc
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

    // video hotkeys
    // eslint-disable-next-line no-undef
    videojs(videoPlayer).ready(function() {
      this.hotkeys({
        volumeStep: 0.05,
        seekStep: 5,
        enableModifiersForNumbers: false
      });
    });

    const topControls = videoButton.topPageControlBarContainer(player);
    videoButton.backToHomePageButton(topControls, videoLinkFromUrl); //  closes player
    player.play(); // play video on load
    player.muted(videoPlayerSettings.muted); // set mute video settings on load
    player.volume(videoPlayerSettings.volume);  // set volume video settings on load
    document.getElementById("video_html5_api").onvolumechange = () => {  // update global video player volume/mute settings
      updateVideoPlayerVolume(player.volume(), player.muted()); 
    };
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  } else {
    const player = videojs(videoPlayer, {  // eslint-disable-line
      "playbackRates":[0.25,0.5, 1, 1.25, 1.5, 2],
      controls: true,
      techOrder: [ "chromecast", "html5" ],
      plugins: {
        chromecast: {
          addButtonToControlBar: displayChromecast
        },
        seekButtons: {
          forward: 30,
          back: 10
        }
      }
    });
    
    // video hotkeys
    // eslint-disable-next-line no-undef
    videojs(videoPlayer).ready(function() {
      this.hotkeys({
        volumeStep: 0.05,
        seekStep: 5,
        enableModifiersForNumbers: false
      });
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
    document.getElementById("video_html5_api").onvolumechange = () => { // update global video player volume/mute settings
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
  const response = await fetch("../getVideoPlayerSettings");
  let videoPlayerSettings;
  if(response.ok){
    videoPlayerSettings = await response.json();  
    return videoPlayerSettings;
  }else {
    // failed to fetch video settings
    videoPlayerSettings = {
      volume: 1.0,
      muted: false
    }; 
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
   // return updatedVideoPlayerVolume
   return updatedVideoPlayerVolume;
}

// video type Automatic activated function
function getVideoUrlAuto(url_link) {
  // change address bar
  history.pushState(null, "", `?auto=${url_link}`);
  // change document title
  document.title = `Searching for video link: ${url_link} - Watch Video By Provided Link`;
  // change css
  document.body.classList = "index-body";
  basic.websiteContentContainer.classList = "index-websiteContentContainer";
  // searchingForVideoLinkMessage
  const searchingForVideoLinkMessageContainer = basic.createSection(basic.websiteContentContainer, "section", "getVideoUrlAutoMessageConatinaer");
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
        basic.notify("error","Invalid Url Link");
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
        basic.websiteContentContainer.innerHTML = "";
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
      const responseError = basic.createSection(basic.websiteContentContainer, "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
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
      // check url for percent encoding
      const url_link = basic.checkForPercentEncoding(url_href);
      showVideoFromUrl(url_link);
    } else if (url_href.includes("?auto=")) { // find video data from url link
      const url_link_from_auto = url_href.split("?auto=")[1];
      // check url for percent encoding
      const url_link = basic.checkForPercentEncoding(url_link_from_auto);
      getVideoUrlAuto(url_link);
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
