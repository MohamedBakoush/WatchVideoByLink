import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";
import * as videoPlayerButtons from "../scripts/video-payer-buttons.js";

// dowload full video button
export function downloadVideoButton(container, videoSrc, videoType) {
  if (container === undefined) {
    return "container undefined";
  } else if (typeof videoSrc !== "string") {
    return "videoSrc not string";
  } else if (typeof videoType !== "string") {
    return "videoType not string";
  } else {
    const downloadVideoButton = basic.createElement(container, "button", {
      classList : "vjs-menu-item downloadVideoMenuContentItem",
      id : "downloadVideoButton",
      title : "Download Video"
    });
    const downloadVideoButtonText = basic.createElement(downloadVideoButton, "span", {
      classList : "vjs-menu-item-text",
      textContent : "Download Video"
    });
    const downloadVideoConfirmation = async function (){
      const response = await videoPlayerButtons.getDownloadConfirmation();
      const downloadConfirmationResponse = response.downloadVideo;
      let downloadConfirm;
      if (typeof downloadConfirmationResponse == "boolean") {
        if (downloadConfirmationResponse === true) {
          downloadConfirm = downloadConfirmationResponse;
        } else {
          downloadConfirm = confirm("Press OK to Download Full Video");
          if (downloadConfirm) {
            videoPlayerButtons.updateDownloadConfirmation("downloadVideo", true);
          }
        }
      } else {
        downloadConfirm = confirm("Press OK to Download Full Video");
        if (downloadConfirm) {
            videoPlayerButtons.updateDownloadConfirmation("downloadVideo", true);
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
        const file_ID = videoPlayerButtons.updateFileNameID(fileNameID);
        return file_ID;
      } else {
        return "failed download video file";
      }
    }
  } catch (e) { // when an error occurs
    return "failed download video file";
  }
}