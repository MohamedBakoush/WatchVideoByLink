import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";
import * as optionTitle from "../scripts/option-title.js";
import * as optionDelete from "../scripts/option-delete.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js";

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
        const videoURL = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
        // option_menu_container
        const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");
        // Download video
        const download_file = basic.createSection(option_menu_container, "button", "button option-two", undefined, "Download Locally");
        download_file.title = "Download Locally"; 
        download_file.onclick = function(e){
          e.preventDefault();  
          const download_video_link = document.createElement("a");
          download_video_link.href = videoSrc;
          download_video_link.setAttribute("download", video_name);
          download_video_link.click();
          download_video_link.remove(); 
        };
        // copy video link
        const option_menu_copy = basic.createSection(option_menu_container, "button", "button option-one", undefined, "Get shareable link");
        option_menu_copy.title = "Get shareable link";
        option_menu_copy.onclick = function(e){
          e.preventDefault();
          optionMenuCopyURLOnClick(videoURL, option_menu_copy);
        };
        // check if video title is same as dispalyed by ${videoInfo_ID}-title id
        if (video_name !== document.getElementById(`${videoInfo_ID}-title`).textContent) { 
          video_name = document.getElementById(`${videoInfo_ID}-title`).textContent;
        }
        // update ${videoInfo_ID}-title id into input text box
        document.getElementById(`${videoInfo_ID}-title`).remove();
        const inputNewTitle = basic.createInput(document.getElementById(`${videoInfo_ID}-title-container`),"text", video_name, `${videoInfo_ID}-title`, "inputNewTitle");
        document.getElementById(`${videoInfo_ID}-title-container`).removeAttribute("href");
        inputNewTitle.onkeypress = function(e){ // on input new title key press
          if (!e) e = window.event;
          var keyCode = e.code || e.key;
          if (keyCode == "Enter"){ 
            if (video_name !== inputNewTitle.value) {
              video_name = inputNewTitle.value;
              optionTitle.changeVideoTitle(videoInfo_ID, video_name);
            }
            inputNewTitle.blur();
            return false;
          }
        };
        // show video edit info menu
        const option_menu_edit = basic.createSection(option_menu_container, "button", "button option-three", undefined, "Edit");
        option_menu_edit.title = "Edit";
        option_menu_edit.onclick = function(e){
          e.preventDefault();
          optionMenuEditOnClick(videoInfo_ID, video_name, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle);
        };
        // close video edit info menu
        const close_option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-times");
        close_option_menu.title = "Close menu";
        close_option_menu.onclick = function(e){
          e.preventDefault();
          closeOptionMenuOnClick(videoInfo_ID, video_name, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
        }; 
        // Actions to partake in on hover over option menu
        optionMenuHover(videoInfo_ID, video_name, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
        return "optionVideoMenuOnClick";
      }
    } catch (error) { 
      return "optionVideoMenuOnClick didnt work";
    }  
}

// on click folder option menu
export function  optionFolderMenuOnClick(savedVideosThumbnailContainer, folderInfo_ID, folder_name, option_menu, folderContainerLink, folderContainer, folderTitleContainer, videoDetails) { 
    option_menu.title = ""; 
    folderContainerLink.removeAttribute("href");
    option_menu.disabled = true;
    option_menu.classList = "thumbnail-option-menu";
    folderContainerLink.onclick = null;
    folderContainerLink.draggable = false; 
    let folderURL;
    if (document.location.search == "") { 
      folderURL = `${window.location.origin}/saved/videos?=${folderInfo_ID}`;
    } else {
      folderURL = `${window.location.origin}/saved/videos${document.location.search}&${folderInfo_ID}`;
    }
    // option_menu_container
    const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");
    // copy folder link
    const option_menu_copy = basic.createSection(option_menu_container, "button", "button option-play", undefined, "Get shareable link");
    option_menu_copy.title = "Get shareable link";
    option_menu_copy.onclick = function(e){
      e.preventDefault();
      optionMenuCopyURLOnClick(folderURL, option_menu_copy);
    };
    // check if video title is same as dispalyed by ${videoInfo_ID}-title id
    if (folder_name !== document.getElementById(`${folderInfo_ID}-title`).textContent) { 
      folder_name = document.getElementById(`${folderInfo_ID}-title`).textContent;
    }
    // update ${videoInfo_ID}-title id into input text box
    document.getElementById(`${folderInfo_ID}-title`).remove();
    const inputNewTitle = basic.createInput(document.getElementById(`${folderInfo_ID}-title-container`),"text", folder_name, `${folderInfo_ID}-title`, "inputNewTitle");
    document.getElementById(`${folderInfo_ID}-title-container`).removeAttribute("href");
    inputNewTitle.onkeypress = function(e){ // on input new title key press
      if (!e) e = window.event;
      var keyCode = e.code || e.key;
      if (keyCode == "Enter"){ 
        if (folder_name !== inputNewTitle.value) {
          folder_name = inputNewTitle.value;
          optionTitle.changeVideoTitle(folderInfo_ID, folder_name); 
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
      folderTitleContainer.style["text-decoration"] = "none";
      optionMenuEditOnClick(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, close_option_menu, folderContainerLink, inputNewTitle);
    };
    // close video edit info menu
    const close_option_menu = basic.createSection(folderContainer, "button", "thumbnail-option-menu fa fa-times");
    close_option_menu.title = "Close menu";
    close_option_menu.onclick = function(e){
      e.preventDefault();
      closeOptionMenuOnClick(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle);
    };
    // Actions to partake in on hover over option menu
    optionMenuHover(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle, savedVideosThumbnailContainer, videoDetails);
}

// On hover over option menu
export function optionMenuHover(fileID, fileName, URL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle, savedVideosThumbnailContainer, videoDetails) {
  try {
    if (typeof fileID !== "string") {  
      return "videoInfo_ID not string";
    } else if (typeof fileName !== "string") {  
      return "video_name not string";
    } else if (typeof URL !== "string") {  
      return "URL not string";
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
      // if hovered removed over linkContainer, remove option_menu_container, close_option_menu
      const isHover = e => e.parentElement.querySelector(":hover") === e;
      const checkHoverFunction = function checkHover() {
        let hovered = isHover(linkContainer); 
        if (hovered !== checkHover.hovered) { 
          checkHover.hovered = hovered;  
          const checkIfInputActive = setInterval(function(){ 
              if (document.activeElement.id === `${fileID}-title`) {
                hovered = checkHover.hovered; 
                inputNewTitle.onkeypress = function(e){
                  if (!e) e = window.event;
                  var keyCode = e.code || e.key;
                  if (keyCode == "Enter"){
                    if (fileName !== inputNewTitle.value) {
                      fileName = inputNewTitle.value;
                      optionTitle.changeVideoTitle(fileID, fileName);   
                    }
                    if (hovered  === false) {
                      if (document.getElementById(`${fileID}-title`)) {  
                        document.getElementById(`${fileID}-title`).remove();
                        basic.createSection(thumbnailTitleContainer, "h1", undefined, `${fileID}-title`, fileName);
                        document.getElementById(`${fileID}-title-container`).href = URL;  
                      }
                      if (typeof savedVideosThumbnailContainer == "object" && typeof videoDetails == "object") {
                        // display folder contents on click
                        linkContainer.onclick = function(e){
                          e.preventDefault();  
                          showAvailableVideos.folderOnClick(savedVideosThumbnailContainer, videoDetails);
                        };              
                      }
                      option_menu.title = "menu";
                      linkContainer.href = URL;
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
                  closeOptionMenuOnClick(fileID, fileName, URL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
                  document.removeEventListener("mousemove", checkHoverFunction);
                } 
                clearInterval(checkIfInputActive);
            }
          }, 50); 
        }
      };
      document.addEventListener("mousemove", checkHoverFunction);
      return "optionMenuHover";
    }
  } catch (error) {
    return "optionMenuHover didnt work";
  }
}

// on click option menu copy url link
export function optionMenuCopyURLOnClick(URL, option_menu_copy) {
  try {
    const tempCopyLink = document.createElement("textarea");
    document.body.appendChild(tempCopyLink);
    tempCopyLink.value = URL;
    tempCopyLink.select();
    document.execCommand("copy");
    document.body.removeChild(tempCopyLink);
    option_menu_copy.textContent = "Copied";
    notify.message("success","Shareable Link Copied");
    return "optionMenuCopyURLOnClick";
  } catch (error) {
    notify.message("error","Failed To Copy Shareable Link");
    return "optionMenuCopyURLOnClick didnt work";
  }
}

// on click video/folder option menu edit 
export function optionMenuEditOnClick(fileID, fileName, URL, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle) {
  try {
    if (typeof fileID !== "string") {  
      return "fileID not string";
    } else if (typeof fileName !== "string") {  
      return "fileName not string";
    } else if (typeof URL !== "string") {  
      return "URL not string";
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

      let fileType = "video";
      if (fileID.includes("folder-")) fileType = "folder";

      if(document.getElementById("download-status-container"))  { 
        document.getElementById("download-status-container").remove(); 
        currentVideoDownloads.stopAvailableVideoDownloadDetails();  
      }
      if (fileName !== inputNewTitle.value) {
        fileName = inputNewTitle.value;
          optionTitle.changeVideoTitle(fileID, fileName); 
      }
      linkContainer.href = URL;
      option_menu.classList = "thumbnail-option-menu fa fa-bars";
      option_menu_container.remove();
      close_option_menu.remove();
      document.body.style.overflow ="hidden";
      const edit_container = basic.createSection(document.body, "section", "video_edit_container", "video_edit_container");
      // click anywhere but edit body to close edit_container
      const close_on_click = basic.createSection(edit_container, "section", "click_to_close");
      close_on_click.onmouseover = function(e){
        e.preventDefault();  
        close_on_click.onclick = function(e){
          e.preventDefault();
          // remove container
          document.body.style.removeProperty("overflow");
          edit_container.remove();  
          const close_on_move = basic.createSection(document.body, "section", "click_to_close"); 
          close_on_move.onmousemove = function(e){
            e.preventDefault();  
            close_on_move.remove(); 
          }; 
          close_on_move.onclick = function(e){
            e.preventDefault();  
            close_on_move.remove();  
            document.elementFromPoint(e.clientX, e.clientY).click();
          }; 
        };
      };
      const edit_body = basic.createSection(edit_container, "section", "video-edit-body");
      edit_body.style.zIndex = "1";
      backToViewAvailableVideoButton(edit_body, edit_container, option_menu, option_menu_container,close_option_menu);
      const edit_article = basic.createSection(edit_body, "article", "video-edit-article");
      const edit_form = basic.createSection(edit_article, "form");
    
      const edit_form_title = basic.createSection(edit_form, "section");
      basic.createSection(edit_form_title, "h2", "video-edit-form-title", undefined, "Edit mode");
    
      // File title 
      const title_edit_settings_container = basic.createSection(edit_form_title, "section");
      const title_edit_settings_ul = basic.createSection(title_edit_settings_container, "ul");
      const title_edit_settings_li = basic.createSection(title_edit_settings_ul, "li", "videoTitleEditContainer");
    
      const title_edit_content_container = basic.createSection(title_edit_settings_li, "section");
      basic.createSection(title_edit_content_container, "strong", undefined, undefined, `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} Title`);
      const title_edit_content_input = basic.inputType(title_edit_content_container, "text", undefined, "videoTitleEditInput", false);
      title_edit_content_input.placeholder = fileName;
      title_edit_content_input.focus();
      const title_edit_button_container = basic.createSection(title_edit_settings_li, "section", "videoTitleEditButtonContainer");
      const titleEditButton = basic.createSection(title_edit_button_container, "button", "videoTitleEditButton", undefined, `Change ${fileType} title`);
    
      titleEditButton.onclick = function(e){
          e.preventDefault();  
          document.body.style.removeProperty("overflow");
          edit_container.remove();
          if (document.getElementById(`${fileID}-title`)) { 
            fileName = title_edit_content_input.value;
            optionTitle.changeVideoTitle(fileID, fileName); 
          } else {
            notify.message("error",`ID ${fileID}-title is Missing`); 
          }
      };
    
      // Danger zone setting 
      const dangerZone_title_container = basic.createSection(edit_form, "section");
      basic.createSection(dangerZone_title_container, "h2", "dangerZone-title", undefined, "Danger Zone");
    
      const dangerZone_settingsContainer = basic.createSection(edit_form, "section", "dangerZone-settingsContainer");
      const dangerZone_settings_ul = basic.createSection(dangerZone_settingsContainer, "ul");
      const dangerZone_settings_li = basic.createSection(dangerZone_settings_ul, "li", "deleteVideoContainer");
    
      // Delete file
      const deleteContentContainer = basic.createSection(dangerZone_settings_li, "section");
      basic.createSection(deleteContentContainer, "strong", undefined, undefined, `Delete this ${fileType}`);
      basic.createSection(deleteContentContainer, "p", undefined, undefined, `Once you delete a ${fileType}, there is no going back. Please be certain.`);
    
      const deleteButtonContainer = basic.createSection(dangerZone_settings_li, "section", "deleteVideoButtonContainer");
      const deleteButton = basic.createSection(deleteButtonContainer, "button", "deleteVideoButton", undefined, `Delete this ${fileType}`);
      deleteButton.onclick = function(e){
        e.preventDefault();
        deleteButton.remove();
        const confirmationButton = basic.createSection(deleteButtonContainer, "button", "deleteVideoButton2", undefined, "Confirm Deletion");
        confirmationButton.onclick = function(e){
          e.preventDefault();
          // remove container
          document.body.style.removeProperty("overflow");
          edit_container.remove();
          //delete data permanently
          optionDelete.deleteVideoDataPermanently(fileID);
        };
      };
      return "optionMenuEditOnClick";
    }
  } catch (error) {
    return "optionMenuEditOnClick didnt work";
  }
}

// close edit menu button 
export function closeOptionMenuOnClick(fileID, fileName, URL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle) {
  try {
    if (typeof fileID !== "string") {  
      return "videoInfo_ID not string";
    } else if (typeof fileName !== "string") {  
      return "video_name not string";
    } else if (typeof URL !== "string") {  
      return "URL not string";
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
      if (fileName !== inputNewTitle.value) {
        fileName = inputNewTitle.value;
        optionTitle.changeVideoTitle(fileID, fileName); 
      }
    
      if (document.getElementById(`${fileID}-title`)) {  
          document.getElementById(`${fileID}-title`).remove();
          document.getElementById(`${fileID}-title-container`).href = URL;
          basic.createSection(thumbnailTitleContainer, "h1", undefined, `${fileID}-title`, fileName);
      } 
      
      option_menu.title = "menu";
      linkContainer.href = URL;
      option_menu.classList = "thumbnail-option-menu fa fa-bars"; 
      linkContainer.draggable = true;
      option_menu.disabled = false;
      option_menu_container.remove();
      close_option_menu.remove(); 
      return "closeOptionMenuOnClick"; 
    }
  } catch (error) {
    return "closeOptionMenuOnClick didnt work";
  }
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