import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";

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

// get download confirmation status
export async function getDownloadConfirmation() {
  const response = await fetch("../getDownloadConfirmation");
  let userConfirmationSettings;
  if (response.ok) {
    userConfirmationSettings = await response.json(); 
    if (userConfirmationSettings == "userConfirmationSettings unavailable") {
      userConfirmationSettings = {
        "downloadVideoStream": false,
        "trimVideo": false,
        "downloadVideo": false
      }; 
      return userConfirmationSettings;
    } else {
      return userConfirmationSettings;
    }
  } else {
    userConfirmationSettings = {
      "downloadVideoStream": false,
      "trimVideo": false,
      "downloadVideo": false
    }; 
    return userConfirmationSettings;
  }
}

// update download confirmation by id & bool
export async function updateDownloadConfirmation(id, bool) {
  const payload = {  // data sending in fetch request
    updateID : id,
    updateBool : bool
  };
  const response = await fetch("../updateDownloadConfirmation",{ 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }); 
  if (response.ok) {  
    const updateConfirmation = await response.json();  
    if (updateConfirmation == "bool updated") { 
      return "Updated confirmation";
    } else {
      return "Failed to update confirmation";
    }
  }else { 
    return "Failed to update confirmation";
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
    const downloadVideoConfirmation = async function (){
      const response = await getDownloadConfirmation();
      const downloadConfirmationResponse = response.downloadVideo;
      let downloadConfirm;
      if (typeof downloadConfirmationResponse == "boolean") {
        if (downloadConfirmationResponse === true) {
          downloadConfirm = downloadConfirmationResponse;
        } else {
          downloadConfirm = confirm("Press OK to Download Full Video");
          if (downloadConfirm) {
            updateDownloadConfirmation("downloadVideo", true);
          }
        }
      } else {
        downloadConfirm = confirm("Press OK to Download Full Video");
        if (downloadConfirm) {
          updateDownloadConfirmation("downloadVideo", true);
        }
      }
      if (downloadConfirm) {
        notify.message("success","Start Full Video Download");
        // if user confirms download full video then send videoSrc, videoType to the server as a post request by downloadVideo
        downloadVideo(videoSrc, videoType).then( (returnValue) => { // downloading video
          let number_of_errors = 0;
          let isDownloading = true;
          if (returnValue == "failed download video file") {
            console.log("failed download video file");
            notify.message("error","Error Connection Refused");
          } else if (returnValue == "Cannot-find-ffmpeg-ffprobe") {
            console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
            notify.message("error","Encoding Error: Cannot find ffmpeg and ffprobe ");
          } else if (returnValue == "Cannot-find-ffmpeg") {
            console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
            notify.message("error","Encoding Error: Cannot find ffmpeg");
          } else if (returnValue == "Cannot-find-ffprobe") {
            console.log("Encoding Error: Cannot find ffprobe");
            notify.message("error","Encoding Error: Cannot find ffprobe");
          } else if (returnValue == "ffmpeg-failed") {
            console.log("Encoding Error: ffmpeg failed");
            notify.message("error","Encoding Error: ffmpeg failed");
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
                        notify.message("success","Download Completed: Full Video");
                        console.log(returnValue, "Full Video Download Completed");
                      }
                    } else if (downloadStatus.thumbnail.download == "starting"){ // starting thumbnail download
                        downloadVideoButtonText.innerHTML = "Thumbnail";
                        downloadVideoButton.title =  "Thumbnail";
                        downloadVideoButton.onclick = function(){
                          notify.message("success","Thumbnail Progress: preparing to create thumbnails");
                        };
                        console.log(returnValue, "Thumbnail Progress: preparing to create thumbnails");
                    } else { // downloading thumbnails
                      downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.thumbnail.download)}%`;
                      downloadVideoButton.title =  "Creating Thumbnails";
                      downloadVideoButton.onclick = function(){
                        notify.message("success",`Thumbnail Progress: ${Math.trunc(downloadStatus.thumbnail.download)}%`);
                      };
                      console.log(returnValue, `Thumbnail Progress: ${Math.trunc(downloadStatus.thumbnail.download)}%`);
                    }
                  } else if(downloadStatus.video.download == "starting full video download") { // starting full video downloa msg
                    downloadVideoButtonText.innerHTML = "Full Video";
                    downloadVideoButton.title = "Full Video";
                    downloadVideoButton.onclick = function(){
                      notify.message("success","Video Progress: preparing to download video");

                    };
                    console.log(returnValue, "Video Progress: preparing to download video");
                  } else { // the percentage for video fthat has been  downloaded msg
                    downloadVideoButtonText.innerHTML = `${Math.trunc(downloadStatus.video.download)}%`;
                    downloadVideoButton.title =  "Downloading Video";
                    downloadVideoButton.onclick = function(){
                      notify.message("success",`Video Progress: ${Math.trunc(downloadStatus.video.download)}%`);
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
                  notify.message("error","Error Connection Refused");
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
      if (stopVideoDownloadResponse === "stream download stoped") {
        notify.message("success","Stoped Video Recording");
      } else {
        notify.message("error","Failed: Stop Video Recording");
      }
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
  notify.message("success","Starting Video Recording");
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
          notify.message("success",`Video Recorded Time: ${timemark}`);
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
        notify.message("error","Error: Connection Refused.");
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
    handleClick: async function() {
      const response = await getDownloadConfirmation();
      const downloadConfirmationResponse = response.downloadVideoStream;
      let downloadConfirm;
      if (typeof downloadConfirmationResponse == "boolean") {
        if (downloadConfirmationResponse === true) {
          downloadConfirm = downloadConfirmationResponse;
        } else {
          downloadConfirm = confirm("Press OK to Record Stream Video");
          if (downloadConfirm) {
            updateDownloadConfirmation("downloadVideoStream", true);
          }
        }
      } else {
        downloadConfirm = confirm("Press OK to Record Stream Video");
        if (downloadConfirm) {
          updateDownloadConfirmation("downloadVideoStream", true);
        }
      }
      if (downloadConfirm) {
        downloadVideoStream(videoSrc, videoType).then( (returnValue) => {
          if (returnValue == "failed record video file") {
           console.log("failed record video file");
           notify.message("error","Error: Connection Refused.");
         } else if (returnValue == "Cannot-find-ffmpeg-ffprobe") {
           console.log("Encoding Error: Cannot find ffmpeg and ffprobe in WatchVideoByLink directory");
           notify.message("error","Encoding Error: Cannot find ffmpeg and ffprobe");
         } else if (returnValue == "Cannot-find-ffmpeg") {
           console.log("Encoding Error: Cannot find ffmpeg in WatchVideoByLink directory");
           notify.message("error","Encoding Error: Cannot find ffmpeg");
         } else if (returnValue == "Cannot-find-ffprobe") {
           console.log("Encoding Error: Cannot find ffprobe");
           notify.message("error","Encoding Error: Cannot find ffprobe");
         } else if (returnValue == "ffmpeg-failed") {
           console.log("Encoding Error: ffmpeg failed");
           notify.message("error","Encoding Error: ffmpeg failed");
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