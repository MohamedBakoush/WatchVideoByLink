import * as basic from "../scripts/basics.js";
import * as folder from "./folder.js";
import * as folderPath from "./folderPath.js";
import * as optionMenu from "../scripts/optionMenu.js";

// try to fetch for all-available-video-data is successful send data to eachAvailableVideoDetails function else show error msg
export async function loadVideoDetails() {
  try {
    const response = await fetch("../all-available-video-data", {cache: "no-store"});
    if (response.ok) {
      const availablevideoDetails = await response.json(); 
      basic.setNewAvailablevideoDetails(availablevideoDetails);
      eachAvailableVideoDetails(availablevideoDetails); 
      return "Video details loaded";
    } else {
      return "Failed to load video details";
    }
  } catch (error) { // when an error occurs
    // if responseErrorAvailableVideo id dosent exist
    if (!document.getElementById("responseErrorAvailableVideo")) {
      // show error msg
      const responseError = basic.createSection(basic.websiteContentContainer(), "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
      basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
    }
    return "Fetch Request Failed";
  }
}

// if there is available videoDetails then get each video Details and send the data to showDetails
// if there are no videoDetails then show  noAvailableVideos msg
export function eachAvailableVideoDetails(videoDetails) {
  try {
    if (typeof videoDetails == "object") {
      // search bar
      const searchBarContainer = basic.createSection(basic.websiteContentContainer(), "section", "searchBarContainer", "searchBarContainer"); 
      searchBar(searchBarContainer); 
      // folder path 
      const pathContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer pathContainer", "pathContainer"); 
      folderPath.homepagePath(pathContainer);
      // videos tumbnails contailer 
      let savedVideosThumbnailContainer; 
      if (document.getElementById("savedVideosThumbnailContainer")) { 
        document.getElementById("savedVideosThumbnailContainer").innerHTML = "";
        savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
      } else { 
        savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
      }
      // make sure searchable video is empty
      if(basic.getSearchableVideoDataArray().length !== 0){ 
        basic.resetSearchableVideoDataArray();
      } 
      // create folder button 
      const createFolderButton = basic.createLink(searchBarContainer, "javascript:;", undefined, "button category-link", "Create Folder"); 
      createFolderButton.onclick = function(e){
        e.preventDefault(); 
        folder.createFolderOnClick();
      };
      folder.resetInsideFolderID();
      // activate drag drop for available video details
      dragDropAvailableVideoDetails(savedVideosThumbnailContainer);
      // display video details
      displayVideoDetails(savedVideosThumbnailContainer, videoDetails);
      return "available videos"; 
    } else {
      return "input not an object";
    }
  } catch (error) {
    return error;
  }
}

// display noAvailableVideosDetails no if exits
export function noAvailableVideosDetails() {
  if (!document.getElementById("noAvailableVideosContainer")) {
    const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer", "noAvailableVideosContainer");
    basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
  } 
}

// remove noAvailableVideosDetails if exits
export function removeNoAvailableVideosDetails() {
  if (document.getElementById("noAvailableVideosContainer")) {
    document.getElementById("noAvailableVideosContainer").remove();
  }
}

// display noSearchableVideoData no if exits
export function noSearchableVideoData() {
  if (!document.getElementById("noSearchableVideoData")) {
    const noSearchableVideoData = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer", "noSearchableVideoData");
    basic.createSection(noSearchableVideoData, "h1", "noAvailableVideosHeader", undefined,  "No results found: Try different keywords");
  }
}

// remove noSearchableVideoData if exits
export function removeNoSearchableVideoData() {
  if (document.getElementById("noSearchableVideoData")) {
    document.getElementById("noSearchableVideoData").remove();
  }
}

// if savedVideosThumbnailContainer is empty, display either noAvailableVideosDetails or noSearchableVideoData depending on the senario 
export function noAvailableOrSearchableVideoMessage() {
  if (document.getElementById("savedVideosThumbnailContainer")) {
    if (document.getElementById("savedVideosThumbnailContainer").childElementCount == 0) {  
      if(basic.getSearchableVideoDataArray().length == 0){ 
          noAvailableVideosDetails();
          return "no avaiable video data";
      } else {
          noSearchableVideoData();
          return "key phrase unavailable";
      }
    }
  } 
}

// display folder or video details to client
export function displayVideoDetails(savedVideosThumbnailContainer, videoDetails) { 
  if (Object.keys(videoDetails).length == 0) { // no available videos
    noAvailableVideosDetails();
    return "no available videoDetails";
  } else {
    basic.resetSearchableVideoDataArray();
    Object.keys(videoDetails).reverse().forEach(function(videoInfo_ID) {
      if (videoInfo_ID.includes("folder-")) {  
        basic.pushDataToSearchableVideoDataArray(videoDetails[videoInfo_ID]);
        showFolderDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails[videoInfo_ID]);
      } else {
        if (videoDetails[videoInfo_ID].hasOwnProperty("info")) {  // eslint-disable-line
          // add video details into searchableVideoDataArray array 
          videoDetails[videoInfo_ID]["info"]["id"] = videoInfo_ID; 
          basic.pushDataToSearchableVideoDataArray(videoDetails[videoInfo_ID]);
          // display video details
          showDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails[videoInfo_ID]);
        } 
      }
    }); 
    return "available videoDetails";
  }
}

// load video details to user which include thumbnail image, video id as title and option menu
export function showDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails) {
  try {
    if (savedVideosThumbnailContainer === undefined) {
      return "savedVideosThumbnailContainer undefined";
    } else if (typeof videoInfo_ID !== "string") {  
      return "videoInfo_ID not string";
    } else if (videoDetails === undefined) {
      return "invalid videoDetails";
    } else {
      let videoSrc, videoType;
      try {
        if (videoDetails.info.videoLink.compressdSrc !== undefined && videoDetails.info.videoLink.compressedType !== undefined) {
          videoSrc = videoDetails.info.videoLink.compressdSrc; // compressed src
          videoType = videoDetails.info.videoLink.compressedType; // video/webm
        } else {
          videoSrc = videoDetails.info.videoLink.src; // original src
          videoType = videoDetails.info.videoLink.type; // video/mp4
        }
      } catch (error) {
        videoSrc = videoDetails.info.videoLink.src; // original src
        videoType = videoDetails.info.videoLink.type; // video/mp4
      }
      let video_name = videoDetails.info.title;
      const numberOfThumbnails = Object.keys(videoDetails.info.thumbnailLink).length;
      const mainThumbnail = `${window.location.origin}${videoDetails.info.thumbnailLink[1]}`;
      const linkContainer = basic.createLink(savedVideosThumbnailContainer, `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`, videoInfo_ID, "videoThumbnailContainer");
      linkContainer.draggable = true;
      const thumbnailContainer = basic.createSection(linkContainer, "section", undefined, `${videoInfo_ID}-container`);
      const imageContainer = basic.createSection(thumbnailContainer, "section", "thumbnail-image-container",  `${videoInfo_ID}-image-container`);
      const thumbnail = basic.appendImg(imageContainer, mainThumbnail, undefined, undefined, `${videoInfo_ID}-img`, "thumbnail-image", videoInfo_ID);
      thumbnail.draggable = false;
      // menu options
      const option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-bars", `${videoInfo_ID}-menu`);
      option_menu.onmouseenter = () => {
        linkContainer.draggable = false;
      };
      option_menu.onmouseleave = () => {
        linkContainer.draggable = true;
      };
      option_menu.title = "menu";
      option_menu.onclick = function(e){
        e.preventDefault();
        optionMenu.optionVideoMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, linkContainer, thumbnailContainer, thumbnailTitleContainer);
      };
      // video title container - if user want to be redirected to video player even if menu is active when onclick
      const thumbnailTitleContainer = basic.createLink(thumbnailContainer, `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`, `${videoInfo_ID}-title-container`, "thumbnailTitleContainer");
      basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
      
      let loopTroughThumbnails, mainThumbnailNumber = 1;
      thumbnail.addEventListener("mouseover", ( ) => { 
        if (typeof loopTroughThumbnails != "number"){
          loopTroughThumbnails = setInterval( () => {
            if (linkContainer.classList.contains("dragging")) { 
              clearInterval(loopTroughThumbnails);
              if (typeof loopTroughThumbnails == "number"){
                loopTroughThumbnails = undefined;
              }
              mainThumbnailNumber = 1;
              thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
            } else { 
              if (mainThumbnailNumber == numberOfThumbnails) {
                thumbnail.src =  mainThumbnail;
                mainThumbnailNumber = 1;
              } else {
                mainThumbnailNumber = mainThumbnailNumber + 1;
                thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
              }
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
      return "showDetails";
    }
  } catch (error) { 
    return "showDetails didnt work";
  } 
}

// load folder details to user 
export function showFolderDetails(savedVideosThumbnailContainer, folderInfoID, videoDetails) {
  let folder_name = videoDetails.info.title;
  videoDetails["info"]["id"] = folderInfoID;
  basic.pushDataToSearchableVideoDataArray(videoDetails[folderInfoID]); 
  
  const folderContainerLink = basic.createLink(savedVideosThumbnailContainer, undefined, folderInfoID, "folderContainer"); 
  folderContainerLink.draggable = true; 
  folderContainerLink.onclick = function(e){
    e.preventDefault();  
    folderOnClick(savedVideosThumbnailContainer, videoDetails);
  };

  folderContainerLink.onmouseenter = function(e){
    e.preventDefault();
    folderContainerLink.style.cursor = "pointer";
    folderTitleContainer.style["text-decoration"] = "underline";
  };
  
  folderContainerLink.onmouseleave = function(e){
    e.preventDefault();
    folderContainerLink.style.cursor = "default";
    folderTitleContainer.style["text-decoration"] = "none";
  };

  const folderContainer = basic.createSection(folderContainerLink, "section", undefined, `${folderInfoID}-container`);
  basic.createSection(folderContainer, "section", "folder-image-container fa fa-folder", `${folderInfoID}-image-container`);
  const folderTitleContainer = basic.createLink(folderContainer, undefined, `${folderInfoID}-title-container`, "folderTitleContainer");
  basic.createSection(folderTitleContainer, "h1", undefined, `${folderInfoID}-title`, folder_name);   

  // menu options
  const option_menu = basic.createSection(folderContainer, "button", "thumbnail-option-menu fa fa-bars", `${folderInfoID}-menu`);
  option_menu.onmouseenter = () => {
    folderContainerLink.onclick = null;
    folderContainer.draggable = false;
  };
  option_menu.onmouseleave = () => {
    folderContainerLink.onclick = function(e){
      e.preventDefault();  
      folderOnClick(savedVideosThumbnailContainer, videoDetails);
    };
    folderContainer.draggable = true;
  };
  option_menu.title = "menu";
  option_menu.onclick = function(e){
    e.preventDefault();
    optionMenu.optionFolderMenuOnClick(savedVideosThumbnailContainer, folderInfoID, folder_name, option_menu, folderContainerLink, folderContainer, folderTitleContainer, videoDetails);
  };

  return "showFolderDetails";
}

// reset search bar value
export function resetSearchBarValue() {
  if (document.getElementById("searchBar")) {
    document.getElementById("searchBar").value = ""; 
  }
}

// when folder element is click on 
export function folderOnClick(savedVideosThumbnailContainer, videoDetails) {
  basic.resetSearchableVideoDataArray();
  resetSearchBarValue();
  savedVideosThumbnailContainer.remove();
  savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
  folder.pushNewFolderIDToFolderIDPath(videoDetails.info.id); 
  folderPath.folderPath(savedVideosThumbnailContainer, document.getElementById("pathContainer"), videoDetails.info.id, videoDetails.info.title); 
  const availableVideosFolderIDPath = folder.getAvailableVideoDetailsByFolderPath(folder.getFolderIDPath());   
  dragDropAvailableVideoDetails(savedVideosThumbnailContainer);
  displayVideoDetails(savedVideosThumbnailContainer, availableVideosFolderIDPath);
}

// rearange available videos by drag and drop
export function dragDropAvailableVideoDetails(section){
  let dragEl, target, prevtarget, dragElTargetPosition;
  const dragDropContainers = document.querySelectorAll(".dragDropContainer");
  if (section === undefined) {
    return "section undefined";
  } else { 
    section.addEventListener("dragstart", function(e){      
      dragEl = e.target; 
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("Text", dragEl.textContent);
      dragDropContainers.forEach(container => {  
        container.addEventListener("dragover", _onDragOver, false);  
        container.addEventListener("dragend", _onDragEnd, false);  
      });
      dragEl.classList.add("dragging");
    });
    return "dragDropAvailableVideoDetails";
  }
  
  function _onDragOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.target.id.includes("-img")) { 
      target = document.getElementById(e.target.id.replace("-img",""));  
    } else if (e.target.id.includes("-menu")) { 
      target = document.getElementById(e.target.id.replace("-menu",""));  
    } else if (e.target.id.includes("-image-container")) { 
      target = document.getElementById(e.target.id.replace("-image-container",""));  
    } else if (e.target.id.includes("-container")) {
      target = document.getElementById(e.target.id.replace("-container",""));
    } else if (e.target.id.includes("-title")) { 
      target = document.getElementById(e.target.id.replace("-title",""));   
    } else { 
      target = e.target; 
    }
    if(target.nodeName == "A" || e.target.id.includes("path-folder-")){ 
      var rect = target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      const maxWidth = rect.right - rect.left;
      const maxHight = rect.bottom - rect.top;  
      if (prevtarget !== undefined) { 
        if ((folder.getFolderIDPath().length == 0 && target.id == "path-folder-main") ||
          (folder.getFolderIDPath()[folder.getFolderIDPath().length - 1] === target.id.replace("path-","")) ||
          (prevtarget.id !== target.id)
        ) {    
          prevtarget.classList.remove("dragging-target");
          prevtarget.classList.remove("dragging-target-left");
          prevtarget.classList.remove("dragging-target-middle"); 
          prevtarget.classList.remove("dragging-target-right"); 
          prevtarget.classList.remove("dragging-target-top"); 
          prevtarget.classList.remove("dragging-target-bottom"); 
        } else { 
          if ( e.target.id.includes("path-folder-")) { 
            target.classList.add("dragging-target"); 
          } else {
            if (target.id === dragEl.id) {
              target.classList.add("dragging-target-middle"); 
            } else {
              if (window.innerWidth <= 749) {
                if (target.id.includes("folder-")) {  
                  if (y > (maxHight / 3) * 2) { 
                    dragElTargetPosition = "bottom";
                    prevtarget.classList.remove("dragging-target-middle"); 
                    prevtarget.classList.remove("dragging-target-top"); 
                    target.classList.add("dragging-target-bottom"); 
                  } else if (y > (maxHight / 3) * 1) { 
                    dragElTargetPosition = "inside-folder";
                    prevtarget.classList.remove("dragging-target-bottom"); 
                    prevtarget.classList.remove("dragging-target-top"); 
                    target.classList.add("dragging-target-middle"); 
                  } else if (y > 0) {  
                    dragElTargetPosition = "top";
                    prevtarget.classList.remove("dragging-target-bottom"); 
                    prevtarget.classList.remove("dragging-target-middle"); 
                    target.classList.add("dragging-target-top"); 
                  }  
                } else {    
                  if (y > (maxHight / 2) * 1) { 
                    dragElTargetPosition = "bottom";
                    prevtarget.classList.remove("dragging-target-top"); 
                    target.classList.add("dragging-target-bottom");
                  } else if (y > 0) {  
                    dragElTargetPosition = "top";
                    prevtarget.classList.remove("dragging-target-bottom"); 
                    target.classList.add("dragging-target-top");
                  } 
                } 
              } else {
                if (target.id.includes("folder-")) { 
                  if (x > (maxWidth / 4) * 3) { 
                    dragElTargetPosition = "right";
                    prevtarget.classList.remove("dragging-target-middle"); 
                    prevtarget.classList.remove("dragging-target-left"); 
                    target.classList.add("dragging-target-right"); 
                  } else if (x > (maxWidth / 4) * 1) {   
                    dragElTargetPosition = "inside-folder";
                    prevtarget.classList.remove("dragging-target-left"); 
                    prevtarget.classList.remove("dragging-target-right"); 
                    target.classList.add("dragging-target-middle"); 
                  } else if (x > 0) { 
                    dragElTargetPosition = "left"; 
                    prevtarget.classList.remove("dragging-target-middle"); 
                    prevtarget.classList.remove("dragging-target-right"); 
                    target.classList.add("dragging-target-left");  
                  } 
                } else {  
                  if (x > (maxWidth / 2)) { 
                    dragElTargetPosition = "right"; 
                    prevtarget.classList.remove("dragging-target-left"); 
                    target.classList.add("dragging-target-right"); 
                  } else if (x > 0) {    
                    dragElTargetPosition = "left"; 
                    prevtarget.classList.remove("dragging-target-right"); 
                    target.classList.add("dragging-target-left");  
                  }  
                }
              } 
            } 
          }
        }   
        prevtarget = target;
      } else  {
        prevtarget = target;
      }
    } else  { 
      prevtarget.classList.remove("dragging-target");
      prevtarget.classList.remove("dragging-target-left");
      prevtarget.classList.remove("dragging-target-middle"); 
      prevtarget.classList.remove("dragging-target-right"); 
      prevtarget.classList.remove("dragging-target-top"); 
      prevtarget.classList.remove("dragging-target-bottom"); 
    }
  } 

  function _onDragEnd(e){
    e.preventDefault();
    dragEl.classList.remove("dragging"); 
    target.classList.remove("dragging-target");
    target.classList.remove("dragging-target-left");
    target.classList.remove("dragging-target-middle"); 
    target.classList.remove("dragging-target-right");   
    target.classList.remove("dragging-target-top");     
    target.classList.remove("dragging-target-bottom");
    prevtarget.classList.remove("dragging-target-left");
    prevtarget.classList.remove("dragging-target-middle"); 
    prevtarget.classList.remove("dragging-target-right");   
    prevtarget.classList.remove("dragging-target-top");     
    prevtarget.classList.remove("dragging-target-bottom");
    dragDropContainers.forEach(container => {  
      container.removeEventListener("dragover", _onDragOver, false);
      container.removeEventListener("dragend", _onDragEnd, false);
    });     
    
    if (
        (target && target !== dragEl && target.id.includes("path-folder-")) === true &&
        (folder.getFolderIDPath().length == 0 && target.id == "path-folder-main") === false &&
        (folder.getFolderIDPath()[folder.getFolderIDPath().length - 1] === target.id.replace("path-","")) === false
      ) {  
      folder.inputSelectedIDOutOfFolderID(dragEl.id, target.id.replace("path-",""));
      document.getElementById(dragEl.id).remove();
    } else if( target && target !== dragEl && target.nodeName == "A"){
      if (dragElTargetPosition == "inside-folder") {
        document.getElementById(dragEl.id).remove();
        folder.inputSelectedIDIntoFolderID(dragEl.id, target.id);
      } else if (dragElTargetPosition == "left") { 
        if ([...section.children].indexOf(target) !== [...section.children].indexOf(dragEl) + 1) {
          section.insertBefore(dragEl, target); 
          basic.searchableVideoDataArray_move_before(dragEl.id, target.id);
          moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(dragEl.id, target.id);
        }
      } else if (dragElTargetPosition == "right") { 
        if ([...section.children].indexOf(target) !== [...section.children].indexOf(dragEl) - 1) { 
          section.insertBefore(dragEl, target.nextSibling);  
          basic.searchableVideoDataArray_move_after(dragEl.id, target.id);
          moveSelectedIdAfterTargetIdAtAvailableVideoDetails(dragEl.id, target.id);
        }
      } else if (dragElTargetPosition == "top") {
        if ([...section.children].indexOf(target) !== [...section.children].indexOf(dragEl) + 1) {
          section.insertBefore(dragEl, target); 
          basic.searchableVideoDataArray_move_before(dragEl.id, target.id);
          moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(dragEl.id, target.id);
        } 
      }  else if (dragElTargetPosition == "bottom") { 
        if ([...section.children].indexOf(target) !== [...section.children].indexOf(dragEl) - 1) { 
          section.insertBefore(dragEl, target.nextSibling); 
          basic.searchableVideoDataArray_move_after(dragEl.id, target.id);
          moveSelectedIdAfterTargetIdAtAvailableVideoDetails(dragEl.id, target.id);
        } 
      } 
    }    
  }
}

// request to update selected available video details orientation
async function moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(selectedID, targetID) {
  try {
    if (selectedID === undefined && targetID === undefined) {
      basic.notify("error", "selectedID & targetID undefined"); 
      return "selectedID & targetID undefined";
    } else if (selectedID === undefined) {
      basic.notify("error", "selectedID undefined"); 
      return "selectedID undefined";
    } else if (targetID === undefined) {
      basic.notify("error", "targetID undefined"); 
      return "targetID undefined";
    } else {
      const payload = {
        folderIDPath: folder.getFolderIDPath(),
        selectedID: selectedID,
        targetID: targetID
      }; 
      let requestResponse;
      const response = await fetch("../moveSelectedIdBeforeTargetIdAtAvailableVideoDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) { 
        requestResponse = await response.json();   
        if (requestResponse.message === "availableVideos updated successfully"){
          basic.notify("success", `Position updated: ${document.getElementById(`${selectedID}-title`).textContent}`);     
          const availablevideoDetails = requestResponse.availableVideos; 
          basic.setNewAvailablevideoDetails(availablevideoDetails);
          return "availableVideos updated successfully"; 
        } else if (requestResponse.message === `${selectedID} unavailable at availableVideos`) {
          basic.notify("error", `${selectedID} unavailable at availableVideos`); 
          return `${selectedID} unavailable at availableVideos`; 
        } else if (requestResponse.message === `${targetID} unavailable at availableVideos`) {
          basic.notify("error", `${targetID} unavailable at availableVideos`); 
          return `${targetID} unavailable at availableVideos`; 
        } else {        
          basic.notify("error",`${selectedID} && ${targetID} unavailable at availableVideos`); 
          return `${selectedID} && ${targetID} unavailable at availableVideos`;
        }
      } else {        
        basic.notify("error","Failed to update rearanged available video details"); 
        return "Failed to update rearanged available video details";
      }
    }
  } catch (error) {
    basic.notify("error","Failed to update rearanged available video details"); 
    return error;
  } 
}

// request to update selected available video details orientation
async function moveSelectedIdAfterTargetIdAtAvailableVideoDetails(selectedID, targetID) { 
  try {
    if (selectedID === undefined && targetID === undefined) {
      basic.notify("error", "selectedID & targetID undefined"); 
      return "selectedID & targetID undefined";
    } else if (selectedID === undefined) {
      basic.notify("error", "selectedID undefined"); 
      return "selectedID undefined";
    } else if (targetID === undefined) {
      basic.notify("error", "targetID undefined"); 
      return "targetID undefined";
    } else {
      const payload = {
        folderIDPath: folder.getFolderIDPath(),
        selectedID: selectedID,
        targetID: targetID
      }; 
      let requestResponse;
      const response = await fetch("../moveSelectedIdAfterTargetIdAtAvailableVideoDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) { 
        requestResponse = await response.json();   
        if (requestResponse.message === "availableVideos updated successfully"){
          basic.notify("success", `Position updated: ${document.getElementById(`${selectedID}-title`).textContent}`);     
          const availablevideoDetails = requestResponse.availableVideos; 
          basic.setNewAvailablevideoDetails(availablevideoDetails);
          return "availableVideos updated successfully"; 
        } else if (requestResponse.message === `${selectedID} unavailable at availableVideos`) {
          basic.notify("error", `${selectedID} unavailable at availableVideos`); 
          return `${selectedID} unavailable at availableVideos`; 
        } else if (requestResponse.message === `${targetID} unavailable at availableVideos`) {
          basic.notify("error", `${targetID} unavailable at availableVideos`); 
          return `${targetID} unavailable at availableVideos`; 
        } else {        
          basic.notify("error",`${selectedID} && ${targetID} unavailable at availableVideos`); 
          return `${selectedID} && ${targetID} unavailable at availableVideos`;
        }
      } else {        
        basic.notify("error","Failed to update rearanged available video details"); 
        return "Failed to update rearanged available video details";
      }
    }
  } catch (error) {
    basic.notify("error","Failed to update rearanged available video details"); 
    return error;
  }
}

// request to stop download video srteam
export async function changeVideoTitle(videoID, newVideoTitle) { 
  try {
    const payload = {
      videoID: videoID,
      newVideoTitle: newVideoTitle,
      folderIDPath: folder.getFolderIDPath()
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
      if (requestResponse.message == "video-title-changed") { 
        const availablevideoDetails = requestResponse.availableVideos; 
        basic.setNewAvailablevideoDetails(availablevideoDetails);
        // find array id of searchableVideoDataArray by videoID
        const searchableArrayItemId = basic.getSearchableVideoDataArray().findIndex(x => x.info.id === videoID);
        if (searchableArrayItemId !== -1) {// change video title from old to new
          document.getElementById(`${videoID}-title`).innerHTML = newVideoTitle;
          basic.searchableVideoDataArray[searchableArrayItemId].info.title = newVideoTitle;
          basic.notify("success",`Video Title Changed: ${newVideoTitle}`);
          return "Video Title Changed";
        } else {
          basic.notify("error", "Video Data ID Unavailable");
          return "searchable video data array id unavailable";
        }
      } else {
        basic.notify("error","Failed to Change Video Title"); 
        return "Failed to Change Video Title";
      }
    } else {
      basic.notify("error","Failed to Change Video Title"); 
      return "Failed to Change Video Title";
    } 
  } catch (error) {
    basic.notify("error","Failed fetch: Change Video Title");  
    return error;
  }
}


// find video by filtering trough each available video by textinput
export function searchBar(container){
  // create search input
  const searchBar = basic.inputType(container, "text", "searchBar", "searchBar", true);
  searchBar.name = "searchBar";
  searchBar.placeholder="Type to search";
  // filters trough video data by name at every key press
  searchBar.addEventListener("keyup", (e) => { 
    const searchString = e.target.value;
    searchBarKeyUp(searchString);
  });
  return "searchBar";
}

// filters trough video data by searchString input
export function searchBarKeyUp(searchString) { 
  if (typeof searchString == "string") {
    const savedVideosThumbnailContainer = document.getElementById("savedVideosThumbnailContainer");
    // check from searchableVideoDataArray if any video data title matches input string
    const filteredsearchableVideoData = basic.getSearchableVideoDataArray().filter((video) => {
      return (
        video.info.title.toLowerCase().includes(searchString.toLowerCase())
      );
    }); 
    // clear savedVideosThumbnailContainer
    savedVideosThumbnailContainer.innerHTML = ""; 
    // check if inputed key phrase available data is avaiable or not to either display data or state the problem
    if (filteredsearchableVideoData.length == 0) {
      noAvailableOrSearchableVideoMessage();
    } else {
      removeNoAvailableVideosDetails();
      removeNoSearchableVideoData();
      // display filterd details to client
      filteredsearchableVideoData.forEach(function(data) {   
        if (data.info.id.includes("folder-")) {
          showFolderDetails(savedVideosThumbnailContainer, data.info.id, data);
        } else { 
          showDetails(savedVideosThumbnailContainer, data.info.id, data);
        } 
      });
      return "Display filterd avaiable video data";
    } 
  } else {
    return "searchString not string";
  }
}

// load pageLoaded to html page when requested
export function pageLoaded() {
  loadVideoDetails();
  return "pageLoaded";
}
