import * as basic from "../scripts/basics.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js";

// try to fetch for all-available-video-data is successful send data to eachAvailableVideoDetails function else show error msg
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
  } catch (e) { // when an error occurs
    // if responseErrorAvailableVideo id dosent exist
    if (!document.getElementById("responseErrorAvailableVideo")) {
      // show error msg
      const responseError = basic.createSection(basic.websiteContentContainer, "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
      basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
    }
  }
}

// if there is available videoDetails then get each video Details and send the data to showDetails
// if there are no videoDetails then show  noAvailableVideos msg
function eachAvailableVideoDetails(videoDetails) {
  if (Object.keys(videoDetails).length == 0) { // no available videos
    const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer, "section", "noAvailableVideosContainer");
    basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
  } else {
    const container = basic.createSection(basic.websiteContentContainer, "section", "savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
    Object.keys(videoDetails).reverse().forEach(function(videoInfo_ID) {
      if (videoDetails[videoInfo_ID].hasOwnProperty("info")) {  // eslint-disable-line
        showDetails(container, videoInfo_ID, videoDetails[videoInfo_ID]);
      }
    });
  }
}

// load video details to user which include thumbnail image, video id as title and option menu
function showDetails(container, videoInfo_ID, videoDetails) {
  const video_name = videoDetails.info.title;
  const numberOfThumbnails = Object.keys(videoDetails.info.thumbnailLink).length;
  const mainThumbnail = `${window.location.origin}${videoDetails.info.thumbnailLink[1]}`;
  const linkContainer = basic.createLink(container, `${window.location.origin}/?t=${videoDetails.info.videoLink.type}?v=${window.location.origin}${videoDetails.info.videoLink.src}`, videoInfo_ID, "videoThumbnailContainer");
  const thumbnailContainer = basic.createSection(linkContainer, "section");
  const imageContainer = basic.createSection(thumbnailContainer, "section", "thumbnail-image-container");

  const thumbnail = appendImg(imageContainer, mainThumbnail, undefined, undefined, undefined, "thumbnail-image", videoInfo_ID);

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
      if(document.getElementById("download-status-container"))  { 
        const stopInterval = currentVideoDownloads.stopAvailableVideoDownloadDetails(false);  
        if(stopInterval == "cleared Interval"){
          document.getElementById("download-status-container").remove();   
        }
      }
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

      // Video title 
      const video_title_edit_settings_container = basic.createSection(video_edit_form, "section");
      const video_title_edit_settings_ul = basic.createSection(video_title_edit_settings_container, "ul");
      const video_title_edit_settings_li = basic.createSection(video_title_edit_settings_ul, "li", "videoTitleEditContainer");

      const video_title_edit_content_container = basic.createSection(video_title_edit_settings_li, "section");
      basic.createSection(video_title_edit_content_container, "strong", undefined, undefined, "Video Title");
      const video_title_edit_content_input = basic.inputType(video_title_edit_content_container, "text", undefined, "videoTitleEditInput", false);
      video_title_edit_content_input.placeholder = document.getElementById(`${videoInfo_ID}-title`).textContent;

      const video_title_edit_button_container = basic.createSection(video_title_edit_settings_li, "section", "videoTitleEditButtonContainer");
      const videoTitleEditButton = basic.createSection(video_title_edit_button_container, "button", "videoTitleEditButton", undefined, "Change video title");

      videoTitleEditButton.onclick = function(e){
        e.preventDefault();  
        document.body.style.removeProperty("overflow");
        video_edit_container.remove();
        if (document.getElementById(`${videoInfo_ID}-title`)) { 
          changeVideoTitle(videoInfo_ID, video_title_edit_content_input.value); 
        } else {
          basic.notify("error",`ID ${videoInfo_ID}-title is Missing`); 
        }
      };

      // Danger zone setting 
      const dangerZone_title_container = basic.createSection(video_edit_form, "section");
      basic.createSection(dangerZone_title_container, "h2", "dangerZone-title", undefined, "Danger Zone");

      const dangerZone_settingsContainer = basic.createSection(video_edit_form, "section", "dangerZone-settingsContainer");
      const dangerZone_settings_ul = basic.createSection(dangerZone_settingsContainer, "ul");
      const dangerZone_settings_li = basic.createSection(dangerZone_settings_ul, "li", "deleteVideoContainer");

      // Delete video 
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
  basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);

  let loopTroughThumbnails, mainThumbnailNumber = 1;
  thumbnail.addEventListener("mouseover", ( ) => { 
    if (typeof loopTroughThumbnails != "number"){
      loopTroughThumbnails = setInterval( () => {
        if (mainThumbnailNumber == numberOfThumbnails) {
          thumbnail.src =  mainThumbnail;
          mainThumbnailNumber = 1;
        } else {
          mainThumbnailNumber = mainThumbnailNumber + 1;
          thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
        }
      }, 500); 
    }
  });

  thumbnail.addEventListener("mouseout", ( ) => {
   clearInterval(loopTroughThumbnails);
   if (typeof loopTroughThumbnails == "number"){
    loopTroughThumbnails = undefined;
   }
   mainThumbnailNumber = 1;
   thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
  });

}

// request to stop download video srteam
export async function changeVideoTitle(videoID, newVideoTitle) { 
  try {
    
    const payload = {
      videoID: videoID,
      newVideoTitle: newVideoTitle
    }; 

    const response = await fetch("../changeVideoTitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let requestResponse;
    if (response.ok) {
      // get json data from response
      requestResponse = await response.json(); 
      if (requestResponse == "video-title-changed") {
        document.getElementById(`${videoID}-title`).innerHTML = newVideoTitle;
        basic.notify("success",`Video Title Changed: ${newVideoTitle}`);
      } else if (requestResponse == "failed-to-change-video-title") {
        basic.notify("error","Failed to Change Video Title"); 
      }
      return requestResponse;
    } else {
      basic.notify("error","Failed to Change Video Title"); 
      return "Failed to Change Video Title";
    } 
  } catch (error) {
    basic.notify("error","Failed fetch: Change Video Title"); 
    return "Failed fetch";
  }
}

// append image to container with features as, src, onload, onerror and optional  height, width
function appendImg(container, src, width, height, idHere, classHere, videoInfo_ID) {
  try {
    const image = document.createElement("img"); // create image element
    if (height != undefined) { // create height
      image.height = height;
    }
    if (width != undefined) { // create height
      image.width = width;
    }
    if (idHere != undefined) { // assign id
      image.id = idHere;
    }
    if (classHere != undefined) { // assign class
      image.classList = classHere;
    }   
    image.src = src; // create src
    image.onload = function () { 
     container.appendChild(image); // append image in container
    };
    image.onerror = function () {
      document.getElementById(videoInfo_ID).remove();  // remove image container
    };
    return image;
  } catch (e) { // when an error occurs
    return "appendImg didnt work";
  }
}

// close edit menu button
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

// send request to server to delete video and all video data permently from the system
async function deleteVideoDataPermanently(videoID, savedVideosThumbnailContainer) {
    const response = await fetch(`../delete-video-data-permanently/${videoID}`);
    if (response.ok) {
      const deleteVideoStatus = await response.json();
      if (deleteVideoStatus == `video-id-${videoID}-data-permanently-deleted`) {
        basic.notify("success",`Deleted: ${videoID}`);
        if (savedVideosThumbnailContainer.childElementCount == 0) {
          savedVideosThumbnailContainer.remove();
          const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer, "section", "noAvailableVideosContainer");
          basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
        }
      } else if (deleteVideoStatus == `video-id-${videoID}-data-failed-to-permanently-deleted`) {
        basic.notify("error",`Failed Delete: ${videoID}`);
      }
      return "videoDataDeletedPermanently";
    }
}

// load pageLoaded to html page when requested
export function pageLoaded() {
  loadVideoDetails();
}
