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
  const downloadVideoButton = document.createElement("button");
  downloadVideoButton.title = "Download Video";
  downloadVideoButton.className =  "vjs-downloadVideo fa fa-download vjs-control vjs-button";
  downloadVideoButton.onclick = function(){
    const downloadConfirm = confirm("Press OK to Download Video");
    if (downloadConfirm) {
      //Logic to download video
      downloadVideoButton.disabled = true;
      downloadVideo(videoSrc, videoType).then( () => {
      console.log("downloading");
      downloadVideoButton.title = "Download Status";
      downloadVideoButton.className =  "vjs-downloadVideo vjs-control vjs-button";
      downloadVideoButton.innerHTML = "0%";
        const checkDownloadStatus = setInterval( async function(){
          const response = await fetch(`data-video/${fileNameID}`);
          if (response.ok) {
            const downloadStatus = await response.json();
            console.log(downloadStatus.download);
            if (downloadStatus.download == "complete") {
              clearInterval(checkDownloadStatus);
              downloadVideoButton.remove();
            } else {
              downloadVideoButton.innerHTML = `${Math.trunc(downloadStatus.download)}%`;
            }
            return "downloading";
          } else {
            return "failed ";
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
