import * as basic from "../scripts/basics.js";
"use strict";

async function loadVideoDetails() {
  const response = await fetch("../all-available-video-data");
  let availablevideoDetails;
  if (response.ok) {
    availablevideoDetails = await response.json();
    eachAvailableVideoDetails(availablevideoDetails);
  } else {
    availablevideoDetails = { msg: "failed to load messages" };
  }
}

function eachAvailableVideoDetails(videoDetails) {
  Object.keys(videoDetails).forEach(function(videoInfo_ID) {
    if (videoDetails[videoInfo_ID].hasOwnProperty("info")) {  // eslint-disable-line
      showDetails(videoInfo_ID, videoDetails[videoInfo_ID]);
    }
  });
}

// load video thumbnail
function showDetails(videoInfo_ID, videoDetails) {
  const numberOfThumbnails = Object.keys(videoDetails.info.thumbnailLink).length;
  const mainThumbnail = `${window.location.origin}${videoDetails.info.thumbnailLink[1]}`;
  const container = document.getElementById("savedVideosThumbnailContainer");

  const linkContainer = basic.createLink(container,   `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`, videoInfo_ID, "videoThumbnailContainer");
  const thumbnailContainer = basic.createSection(linkContainer, "section");
  const imageContainer = basic.createSection(thumbnailContainer, "section", undefined, undefined);

  const thumbnail = appendImg(imageContainer, mainThumbnail, "290.5", "165.4", videoInfo_ID);

  // video title
  basic.createSection(thumbnailContainer, "h1", undefined, undefined, videoInfo_ID);

  let loopTroughThumbnails;
  let mainThumbnailNumber = 1;
  thumbnail.addEventListener("mouseover", ( ) => {
    loopTroughThumbnails = setInterval( () => {
      if (mainThumbnailNumber == numberOfThumbnails) {
        thumbnail.src =  mainThumbnail;
        mainThumbnailNumber = 1;
      } else {
        mainThumbnailNumber = mainThumbnailNumber + 1;
        thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
      }
    }, 500);
  });

  thumbnail.addEventListener("mouseout", ( ) => {
   clearInterval(loopTroughThumbnails);
   mainThumbnailNumber = 1;
   thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
  });

}

function appendImg(container, src, width, height, videoInfo_ID) {
  try {
    const image = document.createElement("img"); // create image element
    image.height = height; // create height
    image.width = width; // create width
    image.src = src; // create src
    image.onload = function () {
     container.appendChild(image); // append image in container
    };
    image.onerror = function () {
      document.getElementById(videoInfo_ID).remove();  // remove image container
    };
    return image;
  } catch (e) {
    return "appendImg didnt work";
  }
}

function pageLoaded() {
  loadVideoDetails();
}

window.addEventListener("load", pageLoaded);
