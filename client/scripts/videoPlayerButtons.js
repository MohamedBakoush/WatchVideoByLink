import * as basic from "../scripts/basics.js";
"use strict";
let fileNameID;

export function topPageControlBarContainer(player) {
  const topPageControlBarContainer =  document.createElement("div");
  topPageControlBarContainer.className = "vjs-control-bar backToHomePageContainer";
  player.el().appendChild(topPageControlBarContainer);
  return topPageControlBarContainer;
}
export function backToHomePageButton(container) {
  const backToHomePage = document.createElement("button");
  backToHomePage.title = "Close Player";
  backToHomePage.className =  "backToHomePageButton fa fa-times vjs-control vjs-button";
  backToHomePage.onclick = function(){window.location = "/";};
  container.appendChild(backToHomePage);
}
export function downloadVideoButton(container, videoSrc, videoType) {
  const downloadVideoButton = basic.createSection(container, "button", "vjs-menu-item downloadVideoMenuContentItem", "downloadVideoButton");
  const downloadVideoButtonText = basic.createSection(downloadVideoButton, "span", "vjs-menu-item-text", undefined, "Download Video");
  downloadVideoButton.onclick = function(){
    const downloadConfirm = confirm("Press OK to Download Full Video");
    if (downloadConfirm) {
      //Logic to download video
      downloadVideoButton.disabled = true;
      downloadVideo(videoSrc, videoType).then( () => {
      console.log("downloading");
      downloadVideoButton.title = "Download Status";
      downloadVideoButton.className = "vjs-menu-item downloadVideoMenuContentItem";
      downloadVideoButtonText.innerHTML = "0%";
        const checkDownloadStatus = setInterval( async function(){
          const response = await fetch(`data-video/${fileNameID}`);
          if (response.ok) {
            const downloadStatus = await response.json();
            console.log(downloadStatus.video.download);
            if (downloadStatus.video.download == "completed") {
              if (downloadStatus.thumbnail.download == "completed") {
                clearInterval(checkDownloadStatus);
                downloadVideoButtonText.innerHTML = "Download Video";
                alert("Video Download Completed");
                downloadVideoButton.disabled = false;
              } else if (downloadStatus.thumbnail.download == "starting"){
                  downloadVideoButtonText.innerHTML = "Thumbnail";
              } else {
                downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.thumbnail.download)}%`;
              }
            } else if(downloadStatus.video.download == "starting full video download") {
              downloadVideoButtonText.innerHTML = "Full Video";
            } else {
              downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.video.download)}%`;
            }
            return "downloading";
          } else {
            return "failed";
          }
        }, 500);
      });
    }
  };
  container.appendChild(downloadVideoButton);
}

export async function stopDownloadVideoStream(bool) {
  console.log(fileNameID);
  const payload = {
    bool: bool,
    fileNameID: fileNameID
  };
  const response = await fetch("stopDownloadVideoStream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return "stoped downloading";
  } else {
    return "failed stop record video file";
  }
}

function stopDownloadVideoStreamOnWindowsClose(event) {
  // when windows closes
  event.preventDefault();
  stopDownloadVideoStream(true);
  // dont show popup
  delete event["returnValue"];
}

export function addStopDownloadOnWindowClose() {
  console.log("addStopDownloadOnWindowClose");
  window.addEventListener("beforeunload", stopDownloadVideoStreamOnWindowsClose);

}

export function removeStopDownloadOnWindowClose() {
  console.log("removeStopDownloadOnWindowClose");
  window.removeEventListener("beforeunload", stopDownloadVideoStreamOnWindowsClose);
}


export async function downloadVideoStream(videoSrc, videoType) {
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
    fileNameID = await response.json();
    return "downloading";
  } else {
    return "failed record video file";
  }
}

export async function downloadVideo(videoSrc, videoType) {
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
    fileNameID = await response.json();
    console.log(fileNameID);
    return fileNameID;
  } else {
    return "failed record video file";
  }
}

export async function trimVideo(videoSrc, videoType, startTime, endTime) {
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
    fileNameID = await response.json();
    console.log(fileNameID);
    return fileNameID;
  } else {
    return "failed record video file";
  }
}


function backToMainVideoButton(downloadVideoContainer, downloadVideoMenu, downloadTrimButton, trimVideoBody) {
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
}

export function createTrimVideo(downloadVideoContainer, downloadVideoMenu, downloadVideoButton, downloadVideoMenuContent, videoSrc, videoType) {
  const downloadTrimButton =  basic.createSection(downloadVideoMenuContent, "button", "vjs-menu-item downloadVideoMenuContentItem");
  basic.createSection(downloadTrimButton, "span", "vjs-menu-item-text", undefined, "Trim Video");
  downloadTrimButton.onclick = function(){
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
    backToMainVideoButton(downloadVideoContainer, downloadVideoMenu, downloadTrimButton, trimVideoBody);

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
        basic.createSection(slider, "section", "track");
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
        trimVideoButton.onclick = function(){
          const downloadConfirm = confirm("Press OK to Download Trimed Video from "  + secondsToHms(inputLeft.value) + " to " + secondsToHms(inputRight.value));
          if (downloadConfirm) {
           //Logic to download video
            trimVideo(videoSrc, videoType, inputLeft.value, inputRight.value).then( () => {
            console.log("Download Trimed Video Start");
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
        inputLeft.addEventListener("mouseover", function() {
          thumbLeft.classList.add("hover");
        });
        inputLeft.addEventListener("mouseout", function() {
          thumbLeft.classList.remove("hover");
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
}

function secondsToHms(sec) {
  let hours = Math.floor(sec/3600);
  (hours >= 1) ? sec = sec - (hours*3600) : hours = "00";
  let min = Math.floor(sec/60);
  (min >= 1) ? sec = sec - (min*60) : min = "00";
  (sec < 1) ? sec="00" : void 0;

  (min.toString().length == 1) ? min = "0"+min : void 0;
  (sec.toString().length == 1) ? sec = "0"+sec : void 0;

  return hours+":"+min+":"+sec;
}
