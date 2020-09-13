import * as basic from "../scripts/basics.js";
"use strict";

const websiteContentContainer = document.getElementById("websiteContentContainer");

async function loadVideoDetails() {
  try {
    const response = await fetch("../all-available-video-data");
    let availablevideoDetails;
    if (response.ok) {
      availablevideoDetails = await response.json();
      eachAvailableVideoDetails(availablevideoDetails);
    } else {
      availablevideoDetails = { msg: "failed to load messages" };
    }
  } catch (e) {
    const responseError = basic.createSection(websiteContentContainer, "section", "responseErrorAvailableVideo");
    basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
  }
}

function eachAvailableVideoDetails(videoDetails) {
  if (Object.keys(videoDetails).length == 0) { // no available videos
    const noAvailableVideosContainer = basic.createSection(websiteContentContainer, "section", "noAvailableVideosContainer");
    basic.createSection(noAvailableVideosContainer, "h1", undefined, undefined,  "There has been no recorded/downloaded videos.");
  } else {
    const container = basic.createSection(websiteContentContainer, "section", "savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
    Object.keys(videoDetails).reverse().forEach(function(videoInfo_ID) {
      if (videoDetails[videoInfo_ID].hasOwnProperty("info")) {  // eslint-disable-line
        showDetails(container, videoInfo_ID, videoDetails[videoInfo_ID]);
      }
    });
  }
}

// load video thumbnail
function showDetails(container, videoInfo_ID, videoDetails) {
  const video_name = videoInfo_ID;
  const numberOfThumbnails = Object.keys(videoDetails.info.thumbnailLink).length;
  const mainThumbnail = `${window.location.origin}${videoDetails.info.thumbnailLink[1]}`;
  const linkContainer = basic.createLink(container, `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`, videoInfo_ID, "videoThumbnailContainer");
  const thumbnailContainer = basic.createSection(linkContainer, "section");
  const imageContainer = basic.createSection(thumbnailContainer, "section");

  const thumbnail = appendImg(imageContainer, mainThumbnail, "290.5", "165.4", videoInfo_ID);

  // menu options
  const option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-bars");
  option_menu.title = "menu";
  option_menu.onclick = function(e){
    e.preventDefault();
      option_menu.title = "";
    linkContainer.removeAttribute("href");
    option_menu.disabled = true;
    option_menu.classList = "thumbnail-option-menu";
    // option_menu_container
    const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");

    // copy video link
    const option_menu_copy = basic.createSection(option_menu_container, "button", "button option-play", undefined, "Get shareable link");
    option_menu_copy.title = "Get shareable link";
    option_menu_copy.onclick = function(e){
      e.preventDefault();
      const tempCopyLink = document.createElement("textarea");
      document.body.appendChild(tempCopyLink);
      tempCopyLink.value = `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`;
      tempCopyLink.select();
      document.execCommand("copy");
      document.body.removeChild(tempCopyLink);
      option_menu_copy.textContent = "Copied";
    };

    // show video edit info menu
    const option_menu_edit = basic.createSection(option_menu_container, "button", "button option-delete", undefined, "Edit");
    option_menu_edit.title = "Edit";
    option_menu_edit.onclick = function(e){
      e.preventDefault();
      linkContainer.href = `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`;
      option_menu.classList = "thumbnail-option-menu fa fa-bars";
      option_menu_container.remove();
      close_option_menu.remove();
      document.body.style.overflow ="hidden";
      const video_edit_container = basic.createSection(document.body, "section", "video_edit_container", "video_edit_container");
      const video_edit_body = basic.createSection(video_edit_container, "section", "video-edit-body");
      backToViewAvailableVideoButton(video_edit_body, video_edit_container, option_menu, option_menu_container,close_option_menu);
      const video_edit_article = basic.createSection(video_edit_body, "article", "video-edit-article");
      const video_edit_form = basic.createSection(video_edit_article, "form");

      const video_edit_form_title = basic.createSection(video_edit_form, "section");
      basic.createSection(video_edit_form_title, "h2", "video-edit-form-title", undefined, "Edit mode");

      const dangerZone_title_container = basic.createSection(video_edit_form, "section");
      basic.createSection(dangerZone_title_container, "h2", "dangerZone-title", undefined, "Danger Zone");

      const dangerZone_settingsContainer = basic.createSection(video_edit_form, "section", "dangerZone-settingsContainer");
      const dangerZone_settings_ul = basic.createSection(dangerZone_settingsContainer, "ul");
      const dangerZone_settings_li = basic.createSection(dangerZone_settings_ul, "li", "deleteVideoContainer");

      const deleteVideoContentContainer = basic.createSection(dangerZone_settings_li, "section");
      basic.createSection(deleteVideoContentContainer, "strong", undefined, undefined, "Delete this video");
      basic.createSection(deleteVideoContentContainer, "p", undefined, undefined, "Once you delete a video, there is no going back. Please be certain.");

      const deleteVideoButtonContainer = basic.createSection(dangerZone_settings_li, "section", "deleteVideoButtonContainer");
      const deleteVideoButton = basic.createSection(deleteVideoButtonContainer, "button", "deleteVideoButton", undefined, "Delete this video");
      deleteVideoButton.onclick = function(e){
        e.preventDefault();
        const confirmVideoDelete = confirm("Press OK to permanently delete video");
        if (confirmVideoDelete) {
          document.body.style.removeProperty("overflow");
          video_edit_container.remove();
          document.getElementById(videoInfo_ID).remove();
          deleteVideoDataPermanently(videoInfo_ID, container);
          console.log("deleted");
        }
      };
    };

    // close video edit info menu
    const close_option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-times");
    close_option_menu.title = "Close menu";
    close_option_menu.onclick = function(e){
      e.preventDefault();
      option_menu.title = "menu";
      linkContainer.href = `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`;
      option_menu.classList = "thumbnail-option-menu fa fa-bars";
      option_menu.disabled = false;
      option_menu_container.remove();
      close_option_menu.remove();
    };

    // if hovered removed over linkContainer, remove option_menu_container, close_option_menu
    const isHover = e => e.parentElement.querySelector(":hover") === e;
    const checkHoverFunction = function checkHover() {
      const hovered = isHover(linkContainer);
      if (hovered !== checkHover.hovered) {
        console.log(hovered ? "hovered" : "not hovered");
        checkHover.hovered = hovered;
        if (hovered === false) {
           option_menu.title = "menu";
          linkContainer.href = `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`;
           option_menu.classList = "thumbnail-option-menu fa fa-bars";
           option_menu.disabled = false;
           option_menu_container.remove();
           close_option_menu.remove();
           document.removeEventListener("mousemove", checkHoverFunction);
        }
      }
    };
    document.addEventListener("mousemove", checkHoverFunction);
  };

  // video title container - if user want to be redirected to video player even if menu is active when onclick
  const thumbnailTitleContainer = basic.createLink(thumbnailContainer, `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`, undefined, "thumbnailTitleContainer");
  basic.createSection(thumbnailTitleContainer, "h1", undefined, undefined, video_name);

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

function backToViewAvailableVideoButton(video_edit_body, video_edit_container, option_menu) {
  const backToMainVideoButton = document.createElement("button");
  option_menu.title = "menu";
  backToMainVideoButton.title = "Close Edit mode";
  backToMainVideoButton.className =  "backToViewAvailableVideoButton fa fa-times";
  backToMainVideoButton.onclick = function(){
    document.body.style.removeProperty("overflow");
    video_edit_container.remove();
  };
  video_edit_body.appendChild(backToMainVideoButton);
}

async function deleteVideoDataPermanently(videoID, savedVideosThumbnailContainer) {
    const response = await fetch(`../delete-video-data-permanently/${videoID}`);

    if (response.ok) {
      const deleteVideoStatus = await response.json();
      if (deleteVideoStatus == `video-id-${videoID}-data-permanently-deleted`) {
        alert(`video ${videoID} has been deleted`);
        if (savedVideosThumbnailContainer.childElementCount == 0) {
          savedVideosThumbnailContainer.remove();
          const noAvailableVideosContainer = basic.createSection(websiteContentContainer, "section", "noAvailableVideosContainer");
          basic.createSection(noAvailableVideosContainer, "h1", undefined, undefined,  "There has been no recorded/downloaded videos.");
        }
      } else if (deleteVideoStatus == `video-id-${videoID}-data-failed-to-permanently-deleted`) {
        alert(`failed to deleted ${videoID} video`);
      }
      return "videoDataDeletedPermanently";
    }
}

 export function pageLoaded() {
  loadVideoDetails();
}
