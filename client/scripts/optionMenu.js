import * as basic from "../scripts/basics.js";
import * as folder from "./folder.js";
import * as showAvailableVideos from "../scripts/showAvailableVideos.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js";

// on click video option menu
export function optionVideoMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, linkContainer, thumbnailContainer, thumbnailTitleContainer) {
    try {
      if (typeof videoSrc !== "string") {  
        return "videoSrc not string";
      } else if (typeof videoType !== "string") {  
        return "videoType not string";
      } else if (typeof videoInfo_ID !== "string") {  
        return "videoInfo_ID not string";
      } else if (typeof video_name !== "string") {  
        return "video_name not string";
      } else if (option_menu === undefined) {  
        return "option_menu undefined";
      } else if (linkContainer === undefined) {  
        return "linkContainer undefined";
      } else if (thumbnailContainer === undefined) {  
        return "thumbnailContainer undefined";
      } else if (thumbnailTitleContainer === undefined) {  
        return "thumbnailTitleContainer undefined";
      } else {  
        option_menu.title = "";
        linkContainer.removeAttribute("href");
        option_menu.disabled = true;
        option_menu.classList = "thumbnail-option-menu";
        linkContainer.draggable = false;
        // option_menu_container
        const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");
        // copy video link
        const option_menu_copy = basic.createSection(option_menu_container, "button", "button option-play", undefined, "Get shareable link");
        option_menu_copy.title = "Get shareable link";
        option_menu_copy.onclick = function(e){
          e.preventDefault();
          optionMenuCopyOnClick(videoSrc, videoType, option_menu_copy);
        };
        // check if video title is same as dispalyed by ${videoInfo_ID}-title id
        if (video_name !== document.getElementById(`${videoInfo_ID}-title`).textContent) { 
          video_name = document.getElementById(`${videoInfo_ID}-title`).textContent;
        }
        // update ${videoInfo_ID}-title id into input text box
        document.getElementById(`${videoInfo_ID}-title`).remove();
        const inputNewTitle = basic.createInput(document.getElementById(`${videoInfo_ID}-title-container`),"text", video_name, `${videoInfo_ID}-title`, "inputNewTitle");
        inputNewTitle.focus();
        document.getElementById(`${videoInfo_ID}-title-container`).removeAttribute("href");
        inputNewTitle.onkeypress = function(e){ // on input new title key press
          if (!e) e = window.event;
          var keyCode = e.code || e.key;
          if (keyCode == "Enter"){ 
            if (video_name !== inputNewTitle.value) {
              video_name = inputNewTitle.value;
              showAvailableVideos.changeVideoTitle(videoInfo_ID, video_name);
            }
            inputNewTitle.blur();
            return false;
          }
        };
        // show video edit info menu
        const option_menu_edit = basic.createSection(option_menu_container, "button", "button option-delete", undefined, "Edit");
        option_menu_edit.title = "Edit";
        option_menu_edit.onclick = function(e){
          e.preventDefault();
          optionVideoMenuEditOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle);
        };
        // close video edit info menu
        const close_option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-times");
        close_option_menu.title = "Close menu";
        close_option_menu.onclick = function(e){
          e.preventDefault();
          closeVideoOptionMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
        };
        // if hovered removed over linkContainer, remove option_menu_container, close_option_menu
        const isHover = e => e.parentElement.querySelector(":hover") === e;
        const checkHoverFunction = function checkHover() {
          let hovered = isHover(linkContainer); 
          if (hovered !== checkHover.hovered) { 
            checkHover.hovered = hovered;  
            const checkIfInputActive = setInterval(function(){ 
                if (document.activeElement.id === `${videoInfo_ID}-title`) {
                  hovered = checkHover.hovered; 
                  inputNewTitle.onkeypress = function(e){
                    if (!e) e = window.event;
                    var keyCode = e.code || e.key;
                    if (keyCode == "Enter"){
                      if (video_name !== inputNewTitle.value) {
                        video_name = inputNewTitle.value;
                        showAvailableVideos.changeVideoTitle(videoInfo_ID, video_name);   
                      }
                      if (hovered  === false) {
                        document.getElementById(`${videoInfo_ID}-title`).remove();
                        basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
                        document.getElementById(`${videoInfo_ID}-title-container`).href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                        option_menu.title = "menu";
                        linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                        option_menu.classList = "thumbnail-option-menu fa fa-bars";
                        linkContainer.draggable = true;
                        option_menu.disabled = false;
                        option_menu_container.remove();
                        close_option_menu.remove();
                        document.removeEventListener("mousemove", checkHoverFunction);
                        clearInterval(checkIfInputActive);
                      } else {
                        inputNewTitle.blur();
                      }
                      return false;
                    }
                  };
                } else{
                  if (hovered === false) {
                    closeVideoOptionMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
                    document.removeEventListener("mousemove", checkHoverFunction);
                  } 
                  clearInterval(checkIfInputActive);
              }
            }, 50); 
          }
        };
        document.addEventListener("mousemove", checkHoverFunction);
        return "optionVideoMenuOnClick";
      }
    } catch (error) { 
      return "optionVideoMenuOnClick didnt work";
    }  
}
// on click folder option menu
export function  optionFolderMenuOnClick(savedVideosThumbnailContainer, folderInfo_ID, folder_name, option_menu, folderContainerLink, folderContainer, folderTitleContainer, videoDetails) { 
    option_menu.title = ""; 
    option_menu.disabled = true;
    option_menu.classList = "thumbnail-option-menu";
    folderContainerLink.onclick = null;
    folderContainerLink.draggable = false;
    // option_menu_container
    const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");
    // check if video title is same as dispalyed by ${videoInfo_ID}-title id
    if (folder_name !== document.getElementById(`${folderInfo_ID}-title`).textContent) { 
      folder_name = document.getElementById(`${folderInfo_ID}-title`).textContent;
    }
    // update ${videoInfo_ID}-title id into input text box
    document.getElementById(`${folderInfo_ID}-title`).remove();
    const inputNewTitle = basic.createInput(document.getElementById(`${folderInfo_ID}-title-container`),"text", folder_name, `${folderInfo_ID}-title`, "inputNewTitle");
    inputNewTitle.focus();
    inputNewTitle.onkeypress = function(e){ // on input new title key press
      if (!e) e = window.event;
      var keyCode = e.code || e.key;
      if (keyCode == "Enter"){ 
        if (folder_name !== inputNewTitle.value) {
          folder_name = inputNewTitle.value;
          showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name); 
        }
        inputNewTitle.blur();
        return false;
      }
    };
    // show video edit info menu
    const option_menu_edit = basic.createSection(option_menu_container, "button", "button option-delete", undefined, "Edit");
    option_menu_edit.title = "Edit";
    option_menu_edit.onclick = function(e){
      e.preventDefault();
      optionFolderMenuEditOnClick(folderInfo_ID, folder_name, option_menu, option_menu_container, close_option_menu, inputNewTitle);
    };
    // close video edit info menu
    const close_option_menu = basic.createSection(folderContainer, "button", "thumbnail-option-menu fa fa-times");
    close_option_menu.title = "Close menu";
    close_option_menu.onclick = function(e){
      e.preventDefault();
      closeFolderOptionMenuOnClick(folderInfo_ID, folder_name, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle);
    };
    // if hovered removed over linkContainer, remove option_menu_container, close_option_menu
    const isHover = e => e.parentElement.querySelector(":hover") === e;
    const checkHoverFunction = function checkHover() {
      let hovered = isHover(folderContainerLink); 
      if (hovered !== checkHover.hovered) { 
        checkHover.hovered = hovered;  
        const checkIfInputActive = setInterval(function(){ 
            if (document.activeElement.id === `${folderInfo_ID}-title`) {
              hovered = checkHover.hovered; 
              inputNewTitle.onkeypress = function(e){
                if (!e) e = window.event;
                var keyCode = e.code || e.key;
                if (keyCode == "Enter"){
                  if (folder_name !== inputNewTitle.value) {
                    folder_name = inputNewTitle.value;
                    showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name);   
                  }   
                  if (hovered  === false) {
                    if (document.getElementById(`${folderInfo_ID}-title`)) {  
                        document.getElementById(`${folderInfo_ID}-title`).remove();
                        basic.createSection(folderTitleContainer, "h1", undefined, `${folderInfo_ID}-title`, folder_name);
                    } 
                    option_menu.title = "menu";
                    option_menu.classList = "thumbnail-option-menu fa fa-bars";
                    folderContainerLink.onclick = function(e){
                        e.preventDefault();  
                        showAvailableVideos.folderOnClick(savedVideosThumbnailContainer, videoDetails);
                    };
                    folderContainerLink.draggable = true;
                    option_menu.disabled = false;
                    option_menu_container.remove();
                    close_option_menu.remove(); 
                    document.removeEventListener("mousemove", checkHoverFunction);
                    clearInterval(checkIfInputActive);
                  } else {
                    inputNewTitle.blur();
                  }
                  return false;
                }
              };
            } else{
              if (hovered === false) { 
                if (folder_name !== inputNewTitle.value) {
                    folder_name = inputNewTitle.value;
                    showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name); 
                }
                if (document.getElementById(`${folderInfo_ID}-title`)) {  
                    document.getElementById(`${folderInfo_ID}-title`).remove();
                    basic.createSection(folderTitleContainer, "h1", undefined, `${folderInfo_ID}-title`, folder_name);
                } 
                option_menu.title = "menu";
                option_menu.classList = "thumbnail-option-menu fa fa-bars";
                folderContainerLink.onclick = function(e){
                    e.preventDefault();  
                    showAvailableVideos.folderOnClick(savedVideosThumbnailContainer, videoDetails);
                };
                folderContainerLink.draggable = true;
                option_menu.disabled = false;
                option_menu_container.remove();
                close_option_menu.remove(); 
                document.removeEventListener("mousemove", checkHoverFunction);
              } 
              clearInterval(checkIfInputActive);
          }
        }, 50); 
      }
    };
    document.addEventListener("mousemove", checkHoverFunction);
}

// on click option menu copy video link
export function optionMenuCopyOnClick(videoSrc, videoType, option_menu_copy) { 
    try {
      if (typeof videoSrc !== "string") {
        basic.notify("error","Copied Video Link: Invalid videoSrc");
        return "videoSrc not string";
      } else if (typeof videoType !== "string") {
        basic.notify("error","Copied Video Link: Invalid videoType");
        return "videoType not string";
      } else {
        const tempCopyLink = document.createElement("textarea");
        document.body.appendChild(tempCopyLink);
        tempCopyLink.value = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
        tempCopyLink.select();
        document.execCommand("copy");
        document.body.removeChild(tempCopyLink);
        option_menu_copy.textContent = "Copied";
        basic.notify("success","Copied Video Link");
        return "optionMenuCopyOnClick";
      }
    } catch (error) {
      basic.notify("error","Copied Video Link: Failed to execute function properly");
      return "optionMenuCopyOnClick didnt work";
    }
}

// on click video option menu edit
export function optionVideoMenuEditOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle) {
    try {
      if (typeof videoSrc !== "string") {  
        return "videoSrc not string";
      } else if (typeof videoType !== "string") {  
        return "videoType not string";
      } else if (typeof videoInfo_ID !== "string") {  
        return "videoInfo_ID not string";
      } else if (typeof video_name !== "string") {  
        return "video_name not string";
      } else if (option_menu === undefined) {  
        return "option_menu undefined";
      } else if (option_menu_container === undefined) {  
        return "option_menu_container undefined";
      } else if (close_option_menu === undefined) {  
        return "close_option_menu undefined";
      } else if (linkContainer === undefined) {  
        return "linkContainer undefined";
      } else if (inputNewTitle === undefined) {  
        return "inputNewTitle undefined";
      } else {
        if(document.getElementById("download-status-container"))  { 
          document.getElementById("download-status-container").remove(); 
          currentVideoDownloads.stopAvailableVideoDownloadDetails();  
        }
        if (video_name !== inputNewTitle.value) {
          video_name = inputNewTitle.value;
          showAvailableVideos.changeVideoTitle(videoInfo_ID, video_name); 
        }
        linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
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
        video_title_edit_content_input.placeholder = video_name;
        video_title_edit_content_input.focus();
        const video_title_edit_button_container = basic.createSection(video_title_edit_settings_li, "section", "videoTitleEditButtonContainer");
        const videoTitleEditButton = basic.createSection(video_title_edit_button_container, "button", "videoTitleEditButton", undefined, "Change video title");
      
        videoTitleEditButton.onclick = function(e){
          e.preventDefault();  
          document.body.style.removeProperty("overflow");
          video_edit_container.remove();
          if (document.getElementById(`${videoInfo_ID}-title`)) { 
            video_name = video_title_edit_content_input.value;
            showAvailableVideos.changeVideoTitle(videoInfo_ID, video_name); 
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
            // remove container
            document.body.style.removeProperty("overflow");
            video_edit_container.remove();
            //delete data permanently
            deleteVideoDataPermanently(videoInfo_ID);
          }
        };
        return "optionVideoMenuEditOnClick";
      }
    } catch (error) {
      return "optionVideoMenuEditOnClick didnt work";
    }
}

// on click folder option menu edit
export function optionFolderMenuEditOnClick(folderInfo_ID, folder_name, option_menu, option_menu_container, close_option_menu, inputNewTitle) {
    if(document.getElementById("download-status-container"))  { 
        document.getElementById("download-status-container").remove(); 
        currentVideoDownloads.stopAvailableVideoDownloadDetails();  
    }
    if (folder_name !== inputNewTitle.value) {
        folder_name = inputNewTitle.value;
        showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name); 
    }
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
    basic.createSection(video_title_edit_content_container, "strong", undefined, undefined, "Folder Title");
    const video_title_edit_content_input = basic.inputType(video_title_edit_content_container, "text", undefined, "videoTitleEditInput", false);
    video_title_edit_content_input.placeholder = folder_name;
    video_title_edit_content_input.focus();
    const video_title_edit_button_container = basic.createSection(video_title_edit_settings_li, "section", "videoTitleEditButtonContainer");
    const videoTitleEditButton = basic.createSection(video_title_edit_button_container, "button", "videoTitleEditButton", undefined, "Change folder title");

    videoTitleEditButton.onclick = function(e){
        e.preventDefault();  
        document.body.style.removeProperty("overflow");
        video_edit_container.remove();
        if (document.getElementById(`${folderInfo_ID}-title`)) { 
        folder_name = video_title_edit_content_input.value;
        showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name); 
        } else {
        basic.notify("error",`ID ${folderInfo_ID}-title is Missing`); 
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
    basic.createSection(deleteVideoContentContainer, "strong", undefined, undefined, "Delete this folder");
    basic.createSection(deleteVideoContentContainer, "p", undefined, undefined, "Once you delete a folder, there is no going back. Please be certain.");

    const deleteVideoButtonContainer = basic.createSection(dangerZone_settings_li, "section", "deleteVideoButtonContainer");
    const deleteVideoButton = basic.createSection(deleteVideoButtonContainer, "button", "deleteVideoButton", undefined, "Delete this folder");
    deleteVideoButton.onclick = function(e){
        e.preventDefault();
        const confirmVideoDelete = confirm("Press OK to permanently delete video");
        if (confirmVideoDelete) {
        // remove container
        document.body.style.removeProperty("overflow");
        video_edit_container.remove();
        //delete data permanently
        deleteVideoDataPermanently(folderInfo_ID);
        }
    };
}

// on click close option menu
export function closeVideoOptionMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle) {
    try {
      if (typeof videoSrc !== "string") {  
        return "videoSrc not string";
      } else if (typeof videoType !== "string") {  
        return "videoType not string";
      } else if (typeof videoInfo_ID !== "string") {  
        return "videoInfo_ID not string";
      } else if (typeof video_name !== "string") {  
        return "video_name not string";
      } else if (option_menu === undefined) {  
        return "option_menu undefined";
      } else if (option_menu_container === undefined) {  
        return "option_menu_container undefined";
      } else if (close_option_menu === undefined) {  
        return "close_option_menu undefined";
      } else if (linkContainer === undefined) {  
        return "linkContainer undefined";
      } else if (thumbnailTitleContainer === undefined) {  
        return "thumbnailTitleContainer undefined";
      } else if (inputNewTitle === undefined) {  
        return "inputNewTitle undefined";
      } else {  
        if (video_name !== inputNewTitle.value) {
          video_name = inputNewTitle.value;
          showAvailableVideos.changeVideoTitle(videoInfo_ID, video_name); 
        }
        document.getElementById(`${videoInfo_ID}-title`).remove();
        document.getElementById(`${videoInfo_ID}-title-container`).href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
        basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
        option_menu.title = "menu";
        linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
        option_menu.classList = "thumbnail-option-menu fa fa-bars";
        linkContainer.draggable = true;
        option_menu.disabled = false;
        option_menu_container.remove();
        close_option_menu.remove(); 
        return "closeVideoOptionMenuOnClick"; 
      }
    } catch (error) {
      return "closeVideoOptionMenuOnClick didnt work";
    }
}

// close folder edit menu button
export function closeFolderOptionMenuOnClick(folderInfo_ID, folder_name, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle) {
    if (folder_name !== inputNewTitle.value) {
      folder_name = inputNewTitle.value;
      showAvailableVideos.changeVideoTitle(folderInfo_ID, folder_name); 
    }
    if (document.getElementById(`${folderInfo_ID}-title`)) {  
        document.getElementById(`${folderInfo_ID}-title`).remove();
        basic.createSection(folderTitleContainer, "h1", undefined, `${folderInfo_ID}-title`, folder_name);
    } 
    option_menu.title = "menu";
    option_menu.classList = "thumbnail-option-menu fa fa-bars";
    folderContainerLink.draggable = true;
    option_menu.disabled = false;
    option_menu_container.remove();
    close_option_menu.remove(); 
    return "closeFolderOptionMenuOnClick"; 
}

// close video edit menu button
export function backToViewAvailableVideoButton(video_edit_body, video_edit_container, option_menu) {
    try {
      if (video_edit_body == undefined || video_edit_container == undefined || option_menu == undefined ) {  
        return "backToViewAvailableVideoButton didnt work";
      } else {
        const backToMainVideoButton = document.createElement("button");
        option_menu.title = "menu";
        backToMainVideoButton.title = "Close Edit mode";
        backToMainVideoButton.className =  "backToViewAvailableVideoButton fa fa-times";
        backToMainVideoButton.onclick = function(){
          document.body.style.removeProperty("overflow");
          video_edit_container.remove();
        };
        video_edit_body.appendChild(backToMainVideoButton);
        return backToMainVideoButton; 
      }
    } catch (error) {
      return "backToViewAvailableVideoButton didnt work";
    }
}

// send request to server to delete video and all video data permently from the system
export async function deleteVideoDataPermanently(videoID) {
    try { 
      const payload = {
        id: videoID,
        folderIDPath: folder.getFolderIDPath()
      };  
      const response = await fetch("../delete-video-data-permanently", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }); 
      let deleteVideoStatus;
      if (response.ok) { 
        deleteVideoStatus = await response.json();
        if (deleteVideoStatus ==  `deleted-${videoID}-permanently`) {
          //remove video from /saved/videos
          document.getElementById(videoID).remove();
          // delete searchable array item 
          basic.deleteIDFromSearchableVideoDataArray(videoID);
          // display either noAvailableVideosDetails or noSearchableVideoData depending on the senario
          showAvailableVideos.noAvailableOrSearchableVideoMessage();
          basic.notify("success",`Deleted: ${videoID}`);
          return `video-id-${videoID}-data-permanently-deleted`;
        } else {
          basic.notify("error",`Failed Delete: ${videoID}`);
          return `video-id-${videoID}-data-failed-to-permanently-deleted`;
        }  
      } else { 
        basic.notify("error","Failed Fetch: Video Deletion");
        return "Failed to Complete Request";
      } 
    } catch (error) {  
      basic.notify("error","Failed Fetch: Video Deletion");
      return error;
    }
}