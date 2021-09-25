import * as basic from "../scripts/basics.js";

let fileNameID;

// update file name ID variable
export function updateFileNameID(updateFileNameID) {
  if(updateFileNameID === null) { 
    fileNameID = undefined;
    return fileNameID;
  } else if (typeof updateFileNameID !== "string" || updateFileNameID === undefined) {
    return fileNameID;
  } else {
    fileNameID = updateFileNameID;
    return fileNameID;
  }
}

// controlBar at the top of the video player
export function topPageControlBarContainer(player) {
  const topPageControlBarContainer =  document.createElement("div");
  topPageControlBarContainer.className = "vjs-control-bar backToHomePageContainer";
  player.el().appendChild(topPageControlBarContainer);
  return topPageControlBarContainer;
}

// close video player button, go back to homepage/ previous page
export function backToHomePageButton(container, videoLinkFromUrl) {
  if (container === undefined) {
     return "container undefined";
  } else {
    const backToHomePage = document.createElement("button");
    backToHomePage.title = "Close Player";
    backToHomePage.className =  "backToHomePageButton fa fa-times vjs-control vjs-button";
    backToHomePage.onclick = function() {
      backToHomePageOnClick(videoLinkFromUrl);
    };
    container.appendChild(backToHomePage);
    return "backToHomePageButton";
  }
}

export function backToHomePageOnClick(videoLinkFromUrl) {  
  if (videoLinkFromUrl == "Automatic") {
    window.location = "/";
    return "load home page";
  } else if (document.referrer.indexOf(window.location.host) !== -1) { 
    // history.length: page loaded in a new tab returns 1
    if(history.length == 1){ 
      window.location = "/";
      return "load home page";
    } else{ 
      history.back();
      return "load previous URL from history list";
    }
   } else { 
      window.location = "/";
      return "load home page";
   } 
}

// dowload full video button
export function downloadVideoButton(container, videoSrc, videoType) {
  if (container === undefined) {
    return "container undefined";
  } else if (typeof videoSrc !== "string") {
    return "videoSrc not string";
  } else if (typeof videoType !== "string") {
    return "videoType not string";
  } else {
    const downloadVideoButton = basic.createSection(container, "button", "vjs-menu-item downloadVideoMenuContentItem", "downloadVideoButton");
    downloadVideoButton.title = "Download Video";
    const downloadVideoButtonText = basic.createSection(downloadVideoButton, "span", "vjs-menu-item-text", undefined, "Download Video");
    const downloadVideoConfirmation = function (){
      const downloadConfirm = confirm("Press OK to Download Full Video");
      if (downloadConfirm) {
        basic.notify("success","Start Full Video Download");
        // if user confirms download full video then send videoSrc, videoType to the server as a post request by downloadVideo
        downloadVideo(videoSrc, videoType).then( (returnValue) => { // downloading video
          let number_of_errors = 0;
          let isDownloading = true;
          if (returnValue == "failed download video file") {
            console.log("failed download video file");
            basic.notify("error","Error Connection Refused");
          } else if (returnValue == "Cannot-find-ffmpeg-ffprobe") {
            console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
            basic.notify("error","Encoding Error: Cannot find ffmpeg and ffprobe ");
          } else if (returnValue == "Cannot-find-ffmpeg") {
            console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
            basic.notify("error","Encoding Error: Cannot find ffmpeg");
          } else if (returnValue == "Cannot-find-ffprobe") {
            console.log("Encoding Error: Cannot find ffprobe");
            basic.notify("error","Encoding Error: Cannot find ffprobe");
          } else if (returnValue == "ffmpeg-failed") {
            console.log("Encoding Error: ffmpeg failed");
            basic.notify("error","Encoding Error: ffmpeg failed");
          } else {
            console.log("Download Full Video Start");
            downloadVideoButton.title = "Download Status";
            downloadVideoButton.className = "vjs-menu-item downloadVideoMenuContentItem";
            downloadVideoButtonText.innerHTML = "0%";
            const checkDownloadStatus = setInterval( async function(){
              try {
                const response = await fetch(`../video-data/${returnValue}`);
                if (response.ok) {
                  const downloadStatus = await response.json();
                  if (downloadStatus.video.download == "completed") { // if the video portion has finished downloading
                    if (downloadStatus.thumbnail.download == "completed") {// completed thumbnail download
                      clearInterval(checkDownloadStatus);
                      downloadVideoButtonText.innerHTML = "Download Video";
                      downloadVideoButton.title = "Download Video";
                      downloadVideoButton.onclick = downloadVideoConfirmation;
                      if (isDownloading) {
                        isDownloading = false;
                        basic.notify("success","Download Completed: Full Video");
                        console.log(returnValue, "Full Video Download Completed");
                      }
                    } else if (downloadStatus.thumbnail.download == "starting"){ // starting thumbnail download
                        downloadVideoButtonText.innerHTML = "Thumbnail";
                        downloadVideoButton.title =  "Thumbnail";
                        downloadVideoButton.onclick = function(){
                          basic.notify("success","Thumbnail Progress: preparing to create thumbnails");
                        };
                        console.log(returnValue, "Thumbnail Progress: preparing to create thumbnails");
                    } else { // downloading thumbnails
                      downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.thumbnail.download)}%`;
                      downloadVideoButton.title =  "Creating Thumbnails";
                      downloadVideoButton.onclick = function(){
                        basic.notify("success",`Thumbnail Progress: ${Math.trunc(downloadStatus.thumbnail.download)}%`);
                      };
                      console.log(returnValue, `Thumbnail Progress: ${Math.trunc(downloadStatus.thumbnail.download)}%`);
                    }
                  } else if(downloadStatus.video.download == "starting full video download") { // starting full video downloa msg
                    downloadVideoButtonText.innerHTML = "Full Video";
                    downloadVideoButton.title = "Full Video";
                    downloadVideoButton.onclick = function(){
                      basic.notify("success","Video Progress: preparing to download video");

                    };
                    console.log(returnValue, "Video Progress: preparing to download video");
                  } else { // the percentage for video fthat has been  downloaded msg
                    downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.video.download)}%`;
                    downloadVideoButton.title =  "Downloading Video";
                    downloadVideoButton.onclick = function(){
                      basic.notify("success",`Video Progress: ${Math.trunc(downloadStatus.video.download)}%`);
                    };
                    console.log(returnValue, `Video Progress: ${Math.trunc(downloadStatus.video.download)}%`);
                  }
                  return "downloading";
                } else {
                  return "failed";
                }
              } catch (e) { // when an error occurs
                number_of_errors = number_of_errors + 1;
                console.log(returnValue, "number_of_errors", number_of_errors);
                // when number of error become one
                // number_of_errors == 1 is created becouse setInterval could try to run the async function more then once and fail
                // since it could cause more then one error the change record buttons/notify would also run more then once
                if (number_of_errors == 1) {
                  clearInterval(checkDownloadStatus);
                  downloadVideoButtonText.innerHTML = "Download Video";
                  downloadVideoButton.title = "Download Video";
                  downloadVideoButton.onclick = downloadVideoConfirmation;
                  basic.notify("error","Error Connection Refused");
                  console.log(returnValue, "Error Connection Refused.");
                }
              }
            }, 500);
          }
        });
      }
    };
    downloadVideoButton.onclick = downloadVideoConfirmation;
    container.appendChild(downloadVideoButton);
    return "downloadVideoButton";
 }
}

// request to stop download video srteam
export async function stopDownloadVideoStream() {
  const file_ID = updateFileNameID();
  if (file_ID === undefined) {
    return "fileNameID undefined";
  } else {
    const payload = {
      id: file_ID
    };
    const response = await fetch("stopDownloadVideoStream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let stopVideoDownloadResponse;
    if (response.ok) {
      stopVideoDownloadResponse = await response.json();
      return stopVideoDownloadResponse;
    } else {
      return "stop video stream download failed";
    } 
  }
}

// if the window closes then stop download of video stream
function stopDownloadVideoStreamOnWindowsClose(event) {
  // when windows closes
  event.preventDefault();
  stopDownloadVideoStream();
  // dont show popup
  delete event["returnValue"];
}

// add function stop download video stream when winodw closes
export function addStopDownloadOnWindowClose() {
  window.addEventListener("beforeunload", stopDownloadVideoStreamOnWindowsClose);
  return "addStopDownloadOnWindowClose";
}

// remove function stop download video stream when winodw closes
export function removeStopDownloadOnWindowClose() {
  window.removeEventListener("beforeunload", stopDownloadVideoStreamOnWindowsClose);
  return "removeStopDownloadOnWindowClose";
}

// request to start download video stream
export async function downloadVideoStream(videoSrc, videoType) {
  try {
    if (typeof videoSrc !== "string") {
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {
      return "videoType not string";
    } else {
      const payload = {
        videoSrc: videoSrc,
        videoType: videoType,
      };
      const response = await fetch("downloadVideoStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const fileNameID = await response.json();
        const file_ID = updateFileNameID(fileNameID);
        return file_ID;
      } else {
        return "failed record video file";
      }
    }
  } catch (e) { // when an error occurs
    return "failed record video file";
  }
}

// check if video stream is still being recorded
export function recordingStreamCheck(player, RecButton) {
  let timemark = "00:00:00.00";
  let number_of_errors = 0;
  basic.notify("success","Starting Video Recording");
  const checkRecordingStatus = setInterval( async function(){
    try {
      const response = await fetch(`../video-data/${fileNameID}`);
      if (response.ok) {
        const downloadStatus = await response.json();
        console.log(downloadStatus.video.download);
        if (downloadStatus.video.timemark !== undefined) {
          timemark = downloadStatus.video.timemark;
        }
        if (downloadStatus.video.download == "completed") {
          // hide StopRecButton
          player.getChild("controlBar").getChild("StopRecButton").hide();
          // RecButton
          if (document.getElementById("RecButton")) { // if RecButton exists then show
            player.getChild("controlBar").getChild("RecButton").show();
          } else { // create rec button
            videojs.registerComponent("RecButton", RecButton); // eslint-disable-line
            player.getChild("controlBar").addChild("RecButton", {}, 1);
          }

          // stop interval
          clearInterval(checkRecordingStatus);
          console.log(timemark);
          basic.notify("success",`Video Recorded Time: ${timemark}`);
          console.log("stopped rec");
        }
        return "downloading";
      } else {
        console.log("failed");
        return "failed";
      }
    } catch (e) { // when an error occurs
      number_of_errors = number_of_errors + 1;
      console.log("number_of_errors", number_of_errors);
      // when number of error become one
      // number_of_errors == 1 is created becouse setInterval could try to run the async function more then once and fail
      // since it could cause more then one error the change record buttons/notify would also run more then once
      if (number_of_errors == 1) {
        // hide StopRecButton
        player.getChild("controlBar").getChild("StopRecButton").hide();
        // RecButton
        if (document.getElementById("RecButton")) { // if RecButton exists then show
          player.getChild("controlBar").getChild("RecButton").show();
        } else { // create rec button
          videojs.registerComponent("RecButton", RecButton); // eslint-disable-line
          player.getChild("controlBar").addChild("RecButton", {}, 1);
        }
        // stop interval
        clearInterval(checkRecordingStatus);
        basic.notify("error","Error: Connection Refused.");
        console.log("recordingStreamCheck failed");
      }
    }
  }, 500);
  return checkRecordingStatus;
}

// Stop recoding video button
export function stopRecStreamButton(player, Button) {
  const StopRecButton = videojs.extend(Button, { // eslint-disable-line
    constructor: function() {
        Button.apply(this, arguments);
        /* initialize your button */
        this.controlText("Stop Record");
    },
    createEl: function() {
      return Button.prototype.createEl("button", {
        className: "vjs-icon-stop-record fas fa-square vjs-control vjs-button",
        id: "StopRecButton"
      });
    },
    handleClick: function() {
          /* do something on click */
        stopDownloadVideoStream().then( () => {
         // stop remove download on windows close
         removeStopDownloadOnWindowClose();
       });
    }
  });
  return StopRecButton;
}

// Record video stream button
export function RecStreamButton(player, Button, StopRecButton, videoSrc, videoType) {
  const RecButton = videojs.extend(Button, { // eslint-disable-line
    constructor: function() {
      Button.apply(this, arguments);
      /* initialize your button */
      this.controlText("Record");
    },
    createEl: function() {
      return Button.prototype.createEl("button", {
        className: "vjs-icon-circle vjs-icon-record-start vjs-control vjs-button",
        id: "RecButton"
      });
    },
    handleClick: function() {
      /* do something on click */
     downloadVideoStream(videoSrc, videoType).then( (returnValue) => {
       if (returnValue == "failed record video file") {
        console.log("failed record video file");
        basic.notify("error","Error: Connection Refused.");
      } else if (returnValue == "Cannot-find-ffmpeg-ffprobe") {
        console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
        basic.notify("error","Encoding Error: Cannot find ffmpeg and ffprobe");
      } else if (returnValue == "Cannot-find-ffmpeg") {
        console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
        basic.notify("error","Encoding Error: Cannot find ffmpeg");
      } else if (returnValue == "Cannot-find-ffprobe") {
        console.log("Encoding Error: Cannot find ffprobe");
        basic.notify("error","Encoding Error: Cannot find ffprobe");
      } else if (returnValue == "ffmpeg-failed") {
        console.log("Encoding Error: ffmpeg failed");
        basic.notify("error","Encoding Error: ffmpeg failed");
      } else {
        console.log("downloading");
        // hide rec button when stop rec is avtive
        player.getChild("controlBar").getChild("RecButton").hide();
        // StopRecButton
        if (document.getElementById("StopRecButton")) { // if StopRecButton exists then show
          player.getChild("controlBar").getChild("StopRecButton").show();
        } else { // create stop rec button
          videojs.registerComponent("StopRecButton", StopRecButton); // eslint-disable-line
          player.getChild("controlBar").addChild("StopRecButton", {}, 1);
        }
        recordingStreamCheck(player, RecButton);
        addStopDownloadOnWindowClose();
      }
     });
    }
  });
  return RecButton;
}

// request to download full video
export async function downloadVideo(videoSrc, videoType) {
  try {
    if (typeof videoSrc !== "string") {
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {
      return "videoType not string";
    } else {
      const payload = {
        videoSrc: videoSrc,
        videoType: videoType,
      };
      const response = await fetch("downloadVideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const fileNameID = await response.json();
        const file_ID = updateFileNameID(fileNameID);
        return file_ID;
      } else {
        return "failed download video file";
      }
    }
  } catch (e) { // when an error occurs
    return "failed download video file";
  }
}

// requet to downlaod video with specifed start and end time
export async function trimVideo(videoSrc, videoType, startTime, endTime) {
  try {
    if (typeof videoSrc !== "string") {
      return "videoSrc not string"; 
    } else if (typeof videoType !== "string") {
      return "videoType not string";
    } else if (startTime === undefined) {
      return "startTime undefined";
    } else if (endTime === undefined) {
      return "endTime undefined";
    } else {
      const payload = {
        videoSrc: videoSrc,
        videoType: videoType,
        newStartTime: startTime,
        newEndTime: endTime,
      };
      const response = await fetch("../trimVideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const fileNameID = await response.json();
        const file_ID = updateFileNameID(fileNameID);
        return file_ID;
      } else {
        return "failed download trimed video file";
      }
    }
  } catch (e) { // when an error occurs
    return "failed download trimed video file";
  }
}

// close trim video inerface button
export function backToMainVideoButton(downloadVideoContainer, downloadVideoButton, downloadVideoMenu, downloadTrimButton, trimVideoBody) {
  if (downloadVideoContainer === undefined) {
    return "downloadVideoContainer undefined";
  } else if (downloadVideoButton === undefined) {
    return "downloadVideoButton undefined";
  } else if (downloadVideoMenu === undefined) {
    return "downloadVideoMenu undefined";
  } else if (downloadTrimButton === undefined) {
    return "downloadTrimButton undefined";
  } else if (trimVideoBody === undefined) {
    return "trimVideoBody undefined";
  } else {
    const backToMainVideoButton = document.createElement("button");
    backToMainVideoButton.title = "Close Trim Video";
    backToMainVideoButton.className =  "backToMainVideoButton fa fa-times";
    backToMainVideoButton.onclick = function(){
      trimVideoBody.remove();
      downloadTrimButton.disabled = false;
      downloadVideoContainer.onmouseover = function(){
        downloadVideoMenu.style.display = "block";
      };
      downloadVideoButton.title = "Download Video";
    };
    trimVideoBody.appendChild(backToMainVideoButton);   
    return "backToMainVideoButton";
  }
}

// trim video interace
export function createTrimVideo(player, downloadVideoContainer, downloadVideoMenu, downloadVideoButton, downloadVideoMenuContent, videoSrc, videoType) {
  if (player === undefined) {
    return "player undefined";
  } else if (downloadVideoContainer === undefined) {
    return "downloadVideoContainer undefined";
  } else if (downloadVideoMenu === undefined) {
    return "downloadVideoMenu undefined";
  } else if (downloadVideoButton === undefined) {
    return "downloadVideoButton undefined";
  } else if (downloadVideoMenuContent === undefined) {
    return "downloadVideoMenuContent undefined";
  } else if (typeof videoSrc !== "string") {
    return "videoSrc not string";
  } else if (typeof videoType !== "string") {
    return "videoType not string";
  } else {
    const downloadTrimButton =  basic.createSection(downloadVideoMenuContent, "button", "vjs-menu-item downloadVideoMenuContentItem");
    downloadTrimButton.title = "Trim Video";
    basic.createSection(downloadTrimButton, "span", "vjs-menu-item-text", undefined, "Trim Video");
    downloadTrimButton.onclick = function(){
      // if video player is in fullscreen mode when downloadTrimButton is clicked, exit full screen mode
      if(player.isFullscreen()){
        player.exitFullscreen();
      }
      // if downloadTrimButton has been clicked and then the user clicks on fullscreen mode, remove trimVideoBody
      window.addEventListener("resize", function checkIfFullscreenWhenResize() {
        if (player.isFullscreen()) {
          trimVideoBody.remove();
          // make downloadVideo option active
          downloadTrimButton.disabled = false;
          downloadVideoContainer.onmouseover = function(){
            downloadVideoMenu.style.display = "block";
          };
          downloadVideoButton.title = "Download Video";
          // remove event listener
          window.removeEventListener("resize", checkIfFullscreenWhenResize);
        }
      });
      // to stop extram trim containers to  display while active
      downloadTrimButton.disabled = true;
      downloadVideoContainer.onmouseover = function(){
        downloadVideoMenu.style.display = "none";
      };
      downloadVideoButton.title = "Trim Video Currently Active";
      // pause main video
      document.getElementById("video_html5_api").pause();
      const trimVideoBody =  basic.createSection(document.body, "section", "trimVideoBody");
      // close trim video button
      backToMainVideoButton(downloadVideoContainer, downloadVideoButton, downloadVideoMenu, downloadTrimButton, trimVideoBody);
  
      const trimVideoArticle = basic.createSection(trimVideoBody, "section", "trimVideoArticle");
      const trimVideoContainer = basic.createSection(trimVideoArticle, "section", "trimVideoContainer");
      // videoContainer
      const videoContainer = basic.createSection(trimVideoContainer, "section", "videoContainer");
      const videoPlayer_active = basic.createSection(videoContainer, "video", "trimVideoPlayer", "video-active");
      videoPlayer_active.src = videoSrc;
      videoPlayer_active.controls = false;
      videoPlayer_active.onloadedmetadata = () => {
          const multiRangeSlider = basic.createSection(videoContainer, "section", "multi-range-slider");
          // left input for slider
          const inputLeft = basic.createInput(multiRangeSlider, "range", undefined, "input-left");
          inputLeft.min = 0;
          inputLeft.max = videoPlayer_active.duration;
          inputLeft.value = 0;
          // right input for slider
          const inputRight = basic.createInput(multiRangeSlider, "range", undefined, "input-right");
          inputRight.min = 0;
          inputRight.max = videoPlayer_active.duration;
          inputRight.value = videoPlayer_active.duration;
          const slider = basic.createSection(multiRangeSlider, "section", "slider");
          const track = basic.createSection(slider, "section", "track");
          const range = basic.createSection(slider, "section", "range");
          const thumbLeft = basic.createSection(slider, "section", "thumb left");
          const thumbRight = basic.createSection(slider, "section", "thumb right");
          // trimVideoControls
          const trimVideoControlsBody = basic.createSection(trimVideoContainer, "section", "trimVideoControlsBody");
          const trimVideoControlsContainer = basic.createSection(trimVideoControlsBody, "section", "trimVideoControlsContainer");
          const trimVideoControls = basic.createSection(trimVideoControlsContainer, "section", "trimVideoControls");
          const selectedVideoTimeContainer = basic.createSection(trimVideoControls, "section", "selectedVideoTimeContainer");
          // selectedVideoTimeLabel
          basic.createSection(selectedVideoTimeContainer, "label", "selectedVideoTimeLabel", undefined, "Selected Video Range");
          // selectedVideoTimeStart
          const selectedVideoTimeStart = basic.createSection(selectedVideoTimeContainer, "section", "selectedVideoTimeStart");
          basic.createSection(selectedVideoTimeStart, "label", "StartTime", undefined, "Start Time:");
          const selectedInputLeft = basic.createInput(selectedVideoTimeStart, "text", secondsToHms(inputLeft.value), "selected-video-time-inputLeft", "timeInput");
          selectedInputLeft.readOnly = true;
          // selectedVideoTimeEnd
          const selectedVideoTimeEnd = basic.createSection(selectedVideoTimeContainer, "section", "selectedVideoTimeEnd");
          basic.createSection(selectedVideoTimeEnd, "label", "EndTime", undefined, "End Time:");
          const selectedInputRight = basic.createInput(selectedVideoTimeEnd, "text", secondsToHms(inputRight.value), "selected-video-time-inputRight", "timeInput");
          selectedInputRight.readOnly = true;
          // trimVideoButtonContainer
          const trimVideoButtonBodyContainer = basic.createSection(trimVideoControlsContainer, "section");
          const trimVideoButtonBody = basic.createSection(trimVideoButtonBodyContainer, "section", undefined, "trimVideoButtonBody");
          const trimVideoButtonContainer = basic.createSection(trimVideoButtonBody, "section", "trimVideoButtonContainer");
          // trimVideoButton
          const trimVideoButton = basic.createInput(trimVideoButtonContainer, "submit", "Trim Video", undefined, "button trimVideoButton");
          trimVideoButton.title = "Trim Video";
          trimVideoButton.onclick = function(){
            const downloadConfirm = confirm("Press OK to Download Trimed Video from "  + secondsToHms(inputLeft.value) + " to " + secondsToHms(inputRight.value));
            if (downloadConfirm) {
              basic.notify("success",`Start Trimed Video Download: ${secondsToHms(inputLeft.value)} - ${secondsToHms(inputRight.value)}`);
             //Logic to download video
              trimVideo(videoSrc, videoType, inputLeft.value, inputRight.value).then( (returnValue) => {
                let number_of_errors = 0;
                let isDownloading = true;
                if (returnValue ==  "failed download trimed video file") {
                  console.log("failed download trimed video file");
                  basic.notify("error","Error: Connection Refused");
                } else if (returnValue == "Cannot-find-ffmpeg-ffprobe") {
                  console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
                  basic.notify("error","Encoding Error: Cannot find ffmpeg and ffprobe");
                } else if (returnValue == "Cannot-find-ffmpeg") {
                  console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
                  basic.notify("error","Encoding Error: Cannot find ffmpeg");
                } else if (returnValue == "Cannot-find-ffprobe") {
                  console.log("Encoding Error: Cannot find ffprobe");
                  basic.notify("error","Encoding Error: Cannot find ffprobe");
                } else if (returnValue == "ffmpeg-failed") {
                  console.log("Encoding Error: ffmpeg failed");
                  basic.notify("error","Encoding Error: ffmpeg failed");
                } else {
                 console.log("Download Trimed Video Start");
                 const checkDownloadStatus = setInterval( async function(){
                   try {
                     const response = await fetch(`../video-data/${returnValue}`);
                     if (response.ok) {
                       const downloadStatus = await response.json();
                       if (downloadStatus.video.download == "completed") { // if the video portion has finished downloading
                         if (downloadStatus.thumbnail.download == "completed") {// completed thumbnail download
                           clearInterval(checkDownloadStatus);
                           if (isDownloading) {
                             isDownloading = false;
                             basic.notify("success",`Trimed Video Download Completed: ${secondsToHms(inputLeft.value)} - ${secondsToHms(inputRight.value)}`);
                             console.log(returnValue, `Trimed Video Download from ${secondsToHms(inputLeft.value)} to ${secondsToHms(inputRight.value)} Completed`);
                           }
                         } else if (downloadStatus.thumbnail.download == "starting"){ // starting thumbnail download
                           console.log(returnValue, "Thumbnail Progress: preparing to create thumbnails");
                         } else { // downloading thumbnails
                           console.log(returnValue, `Thumbnail Progress: ${Math.trunc(downloadStatus.thumbnail.download)}%`);
                         }
                       } else if(downloadStatus.video.download == "starting full video download") { // starting full video downloa msg
                         console.log(returnValue, "Video Progress: preparing to download video");
                       } else { // the percentage for video fthat has been  downloaded msg
                         console.log(returnValue, `Video Progress: ${Math.trunc(downloadStatus.video.download)}%`);
                       }
                       return "downloading";
                     } else {
                       return "failed";
                     }
                   } catch (e) { // when an error occurs
                     number_of_errors = number_of_errors + 1;
                     console.log(returnValue, "number_of_errors", number_of_errors);
                     // when number of error become one
                     // number_of_errors == 1 is created becouse setInterval could try to run the async function more then once and fail
                     // since it could cause more then one error the change record buttons/notify would also run more then once
                     if (number_of_errors == 1) {
                       clearInterval(checkDownloadStatus);
                       console.log(returnValue, "Error Connection Refused.");
                       basic.notify("error","Error: Connection Refused.");
                     }
                   }
                 }, 500);
               }
                trimVideoBody.remove();
                // make downloadVideo option active
                downloadTrimButton.disabled = false;
                downloadVideoContainer.onmouseover = function(){
                  downloadVideoMenu.style.display = "block";
                };
                downloadVideoButton.title = "Download Video";
              });
            }
          };
          function setLeftValue() {
            const _this = inputLeft,
              min = parseInt(_this.min),
              max = parseInt(_this.max);
  
            _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
  
            const percent = ((_this.value - min) / (max - min)) * 100;
  
            thumbLeft.style.left = percent + "%";
            range.style.left = percent + "%";
          }
          setLeftValue();
          function setRightValue() {
            const _this = inputRight,
              min = parseInt(_this.min),
              max = parseInt(_this.max);
  
            _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
  
            const percent = ((_this.value - min) / (max - min)) * 100;
  
            thumbRight.style.right = (100 - percent) + "%";
            range.style.right = (100 - percent) + "%";
          }
          setRightValue();
          inputLeft.addEventListener("input", setLeftValue);
          inputRight.addEventListener("input", setRightValue);
          
          // when mouseover thumbLeft activate inputLeft, deactivate inputRight
          thumbLeft.addEventListener("mouseover", function() {
            inputLeft.style.pointerEvents = null;
            inputRight.style.pointerEvents = "none";
          }); 
          
          // when mouseover thumbRight activate inputRight, deactivate inputLeft
          thumbRight.addEventListener("mouseover", function() {
            inputLeft.style.pointerEvents = "none";
            inputRight.style.pointerEvents = null;
          });  
          
          // when mouseover track deactivate inputRight, deactivate inputLeft
          track.addEventListener("mouseover", function() { 
            inputRight.style.pointerEvents = "none";
            inputLeft.style.pointerEvents = "none";
          }); 
  
          // when mouseover range deactivate inputRight, deactivate inputLeft
          range.addEventListener("mouseover", function() { 
            inputRight.style.pointerEvents = "none";
            inputLeft.style.pointerEvents = "none";
          }); 
   
          inputLeft.addEventListener("mouseover", function() {
            thumbLeft.classList.add("hover");
          });
          inputLeft.addEventListener("mouseout", function() {
            thumbLeft.classList.remove("hover"); 
            inputRight.style.pointerEvents = "none";
            inputLeft.style.pointerEvents = "none";
          });
  
          let liveselectedInputLeft;
          inputLeft.addEventListener("mousedown", function() {
            thumbLeft.classList.add("active");
            // update inputLeft time and video player time
            liveselectedInputLeft = setInterval( function() {
              // console.log(secondsToHms(inputLeft.value));
              videoPlayer_active.currentTime = inputLeft.value;
              selectedInputLeft.value = secondsToHms(inputLeft.value);
            },50);
  
          });
          inputLeft.addEventListener("mouseup", function() {
            // stop update inputLeft time and video player time
            clearInterval(liveselectedInputLeft);
  
            thumbLeft.classList.remove("active");
            // one last update for inputLeft time and video player time
            videoPlayer_active.currentTime = inputLeft.value;
            videoPlayer_active.pause();
            selectedInputLeft.value = secondsToHms(inputLeft.value);
          });
  
          inputRight.addEventListener("mouseover", function() {
            thumbRight.classList.add("hover"); 
          });
          inputRight.addEventListener("mouseout", function() {
            thumbRight.classList.remove("hover"); 
            inputRight.style.pointerEvents = "none";
            inputLeft.style.pointerEvents = "none";
          });
  
  
          let liveselectedInputRight;
          inputRight.addEventListener("mousedown", function() {
            thumbRight.classList.add("active");
            // update inputRight time and video player time
            liveselectedInputRight = setInterval( function() {
              // console.log(secondsToHms(inputRight.value));
              videoPlayer_active.currentTime = inputRight.value;
              selectedInputRight.value = secondsToHms(inputRight.value);
            },50);
          });
          inputRight.addEventListener("mouseup", function() {
            // stop update inputRight time and video player time
            clearInterval(liveselectedInputRight);
  
            thumbRight.classList.remove("active");
            // one last update for inputRight time and video player time
            videoPlayer_active.currentTime = inputRight.value;
            videoPlayer_active.pause();
            selectedInputRight.value = secondsToHms(inputRight.value);
          });
      };
    };
    return "createTrimVideo";
  }
}

// converts seconds to hours:min:sec
export function secondsToHms(sec) { 
  if (sec === undefined) {
    return "sec undefined";
  } else {
    let hours = Math.floor(sec/3600);
    (hours >= 1) ? sec = sec - (hours*3600) : hours = "00";
    let min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = "00";
    (sec < 1) ? sec="00" : void 0;
  
    (min.toString().length == 1) ? min = "0"+min : void 0;
    (sec.toString().length == 1) ? sec = "0"+sec : void 0;
  
    return hours+":"+min+":"+sec; 
  }
}
