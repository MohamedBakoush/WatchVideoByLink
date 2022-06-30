import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";
import * as optionTitle from "../scripts/option-title.js";
import * as optionDelete from "../scripts/option-delete.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js";

// on click video option menu
export function optionMenuOnClick(fileID, fileName, option_menu, linkContainer, thumbnailContainer, thumbnailTitleContainer, videoSrc, videoType) {
  try {
   if (typeof fileID !== "string") {  
      return "fileID not string";
    } else if (typeof fileName !== "string") {  
      return "fileName not string";
    } else if (option_menu === undefined) {  
      return "option_menu undefined";
    } else if (linkContainer === undefined) {  
      return "linkContainer undefined";
    } else if (thumbnailContainer === undefined) {  
      return "thumbnailContainer undefined";
    } else if (thumbnailTitleContainer === undefined) {  
      return "thumbnailTitleContainer undefined";
    } else if (typeof videoSrc !== "string") {  
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {  
      return "videoType not string";
    } else {  
      option_menu.title = "";
      linkContainer.removeAttribute("href");
      option_menu.disabled = true;
      option_menu.classList = "thumbnail-option-menu";
      linkContainer.draggable = false;
      const videoURL = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
      // check if video title is same as dispalyed by ${videoInfo_ID}-title id
      if (fileName !== document.getElementById(`${fileID}-title`).textContent) { 
        fileName = document.getElementById(`${fileID}-title`).textContent;
      }
      const inputNewTitle = inputNewFileTitle(fileID, fileName);
      // option_menu_container
      const option_menu_container = basic.createElement(option_menu, "section", {
        classList : "thumbnail-options-container"
      });
      // close video edit info menu
      const close_option_menu = closeOptionMenu(fileID, fileName, videoURL, option_menu, option_menu_container, linkContainer, thumbnailContainer, thumbnailTitleContainer, inputNewTitle);
      // copy video link
      optionMenuSharableLink(option_menu_container, fileID, videoURL);
      // Download video
      optionMenuDownload(option_menu_container, fileName, `${window.location.origin}${videoSrc}`);
      // show video edit info menu 
      optionMenuEdit(fileID, fileName, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
      // Actions to partake in on hover over option menu
      optionMenuHover(fileID, fileName, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
      return "optionMenuOnClick";
    }
  } catch (error) { 
    return "optionMenuOnClick didnt work";
  }  
}

// on click folder option menu
export function optionFolderMenuOnClick(folderInfo_ID, folder_name, option_menu, folderContainerLink, folderContainer, folderTitleContainer, videoDetails, savedVideosThumbnailContainer) { 
  try {
    if (typeof folderInfo_ID !== "string") {  
      return "fileID not string";
    } else if (typeof folder_name !== "string") {  
      return "folder_name not string";
    } else if (option_menu === undefined) {  
      return "option_menu undefined";
    } else if (folderContainerLink === undefined) {  
      return "folderContainerLink undefined";
    } else if (folderContainer === undefined) {  
      return "folderContainer undefined";
    } else if (folderTitleContainer === undefined) {  
      return "thumbnailTitleContainer undefined";
    } else if (typeof videoDetails !== "object") {  
      return "videoDetails not object";
    } else if (typeof savedVideosThumbnailContainer === undefined) {  
      return "savedVideosThumbnailContainer undefined";
    }  else {
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
      // check if video title is same as dispalyed by ${videoInfo_ID}-title id
      if (folder_name !== document.getElementById(`${folderInfo_ID}-title`).textContent) { 
        folder_name = document.getElementById(`${folderInfo_ID}-title`).textContent;
      }
      const inputNewTitle = inputNewFileTitle(folderInfo_ID, folder_name);
      // option_menu_container
      const option_menu_container = basic.createElement(option_menu, "section", {
        classList : "thumbnail-options-container"
      });
      // close folder edit info menu
      const close_option_menu = closeOptionMenu(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, folderContainerLink, folderContainer, folderTitleContainer, inputNewTitle);
      // copy video link
      optionMenuSharableLink(option_menu_container, folderInfo_ID, folderURL);
      // show video edit info menu
      optionMenuEdit(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle);
      // Actions to partake in on hover over option menu
      optionMenuHover(folderInfo_ID, folder_name, folderURL, option_menu, option_menu_container, close_option_menu, folderContainerLink, folderTitleContainer, inputNewTitle, savedVideosThumbnailContainer, videoDetails);
    }
    return "optionFolderMenuOnClick";
  } catch (error) {
    return "optionFolderMenuOnClick didnt work";
  }  
}

// alter file title text box
function inputNewFileTitle(fileID, fileName) {
  document.getElementById(`${fileID}-title`).remove();
  const file_title_container = document.getElementById(`${fileID}-title-container`);
  const inputNewTitle = basic.createElement(file_title_container, "input", { 
    type : "text",
    value: fileName,
    id : `${fileID}-title`,
    classList : "inputNewTitle"
  });
  file_title_container.removeAttribute("href");
  inputNewTitle.onkeypress = function(e){ // on input new title key press
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode == "Enter"){ 
      if (fileName !== inputNewTitle.value) {
        fileName = inputNewTitle.value;
        optionTitle.changeVideoTitle(fileID, fileName);
      }
      inputNewTitle.blur();
      return false;
    }
  };
  return inputNewTitle;
}

// close option menu
export function closeOptionMenu(fileID, fileName, videoURL, option_menu, option_menu_container, linkContainer, thumbnailContainer, thumbnailTitleContainer, inputNewTitle) {
  const close_option_menu = basic.createElement(thumbnailContainer, "button", {
    classList : "thumbnail-option-menu fa fa-times",
    title : "Close menu"
  });
  close_option_menu.onclick = function(e){
    e.preventDefault();
    closeOptionMenuOnClick(fileID, fileName, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
  }; 
  return close_option_menu;
}

// copy video link
export function optionMenuSharableLink(option_menu_container, fileID, URL) { 
  let option_menu_copy_css = "option-menu-one";
  if (fileID.includes("folder-")) option_menu_copy_css = "option-menu-one-folder"; 
  const option_menu_copy = basic.createElement(option_menu_container, "button", {
    classList :  `button ${option_menu_copy_css}`,
    textContent : "Get shareable link",
    title : "Get shareable link"
  });
  option_menu_copy.onclick = function(e){
    e.preventDefault();
    optionMenuCopyURLOnClick(URL, option_menu_copy);
  };
  return option_menu_copy;
}

// Download video
export function optionMenuDownload(option_menu_container, fileName, URL) {
  let download_file_css = "option-menu-two"; 
  const download_file = basic.createElement(option_menu_container, "button", {
    classList :  `button ${download_file_css}`,
    textContent : "Download Locally",
    title : "Download Locally"
  });
  download_file.onclick = function(e){
    e.preventDefault();  
    const download_video_link = document.createElement("a");
    download_video_link.href = URL;
    download_video_link.setAttribute("download", fileName);
    download_video_link.click();
    download_video_link.remove(); 
  };
  return download_file;
}

// show video edit info menu 
export function optionMenuEdit(fileID, fileName, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle) {
  let edioption_menu_edit_css = "option-menu-three";
  if (fileID.includes("folder-")) edioption_menu_edit_css = "option-menu-two-folder"; 
  const option_menu_edit = basic.createElement(option_menu_container, "button", {
    classList :  `button ${edioption_menu_edit_css}`,
    textContent : "Edit",
    title : "Edit"
  });
  option_menu_edit.onclick = function(e){
    e.preventDefault();
    thumbnailTitleContainer.style["text-decoration"] = "none";
    optionMenuEditOnClick(fileID, fileName, videoURL, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle);
  };
  return option_menu_edit;
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
                        basic.createElement(thumbnailTitleContainer, "h1", {
                          id :  `${fileID}-title`,
                          textContent : fileName
                        });
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
      const edit_container = basic.createElement(document.body, "section", {
        classList : "video_edit_container",
        id : "video_edit_container"
      });
      // click anywhere but edit body to close edit_container
      const close_on_click = basic.createElement(edit_container, "section", {
        classList : "click_to_close"
      });
      close_on_click.onmouseover = function(e){
        e.preventDefault();  
        close_on_click.onclick = function(e){
          e.preventDefault();
          // remove container
          document.body.style.removeProperty("overflow");
          edit_container.remove();  
          const close_on_move = basic.createElement(document.body, "section", {
            classList : "click_to_close"
          });
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
      const edit_body = basic.createElement(edit_container, "section", {
        classList : "video-edit-body",
        style : "z-index: 1;"
      });
      backToViewAvailableVideoButton(edit_body, edit_container, option_menu, option_menu_container,close_option_menu);
      const edit_article = basic.createElement(edit_body, "article", {
        classList : "video-edit-article"
      });
      const edit_form = basic.createElement(edit_article, "form");
      const edit_form_title = basic.createElement(edit_form, "section");
      basic.createElement(edit_form_title, "h2", {
        classList : "video-edit-form-title",
        textContent : "Edit mode"
      });
      // File title 
      const title_edit_settings_container = basic.createElement(edit_form_title, "section");
      const title_edit_settings_ul = basic.createElement(title_edit_settings_container, "ul");
      const title_edit_settings_li = basic.createElement(title_edit_settings_ul, "li", {
        classList : "videoTitleEditContainer"
      });
    
      const title_edit_content_container = basic.createElement(title_edit_settings_li, "section");
      basic.createElement(title_edit_content_container, "strong", {
        textContent : `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} Title`
      });
      const title_edit_content_input = basic.createElement(title_edit_content_container, "input", {
        type : "text",
        classList : "videoTitleEditInput",
        placeholder : fileName,
        required : false
      });
      title_edit_content_input.focus();
      const title_edit_button_container = basic.createElement(title_edit_settings_li, "section", {
        classList : "videoTitleEditButtonContainer"
      });
      const titleEditButton = basic.createElement(title_edit_button_container, "button", {
        classList : "videoTitleEditButton",
        textContent : `Change ${fileType} title`
      }); 
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
      const dangerZone_title_container = basic.createElement(edit_form, "section");
      basic.createElement(dangerZone_title_container, "h2", {
        classList : "dangerZone-title",
        textContent : "Danger Zone"
      }); 
      const dangerZone_settingsContainer = basic.createElement(edit_form, "section", {
        classList : "dangerZone-settingsContainer"
      }); 
      const dangerZone_settings_ul = basic.createElement(dangerZone_settingsContainer, "ul");
      const dangerZone_settings_li = basic.createElement(dangerZone_settings_ul, "li", {
        classList : "deleteVideoContainer"
      }); 
    
      // Delete file
      const deleteContentContainer = basic.createElement(dangerZone_settings_li, "section");
      basic.createElement(deleteContentContainer, "strong", {
        textContent : `Delete this ${fileType}`
      }); 
      basic.createElement(deleteContentContainer, "p", {
        textContent : `Once you delete a ${fileType}, there is no going back. Please be certain.`
      }); 
    
      const deleteButtonContainer = basic.createElement(dangerZone_settings_li, "section", {
        classList : "deleteVideoButtonContainer"
      }); 
      const deleteButton = basic.createElement(deleteButtonContainer, "button", {
        classList : "deleteVideoButton",
        textContent : `Delete this ${fileType}`
      }); 
      deleteButton.onclick = function(e){
        e.preventDefault();
        deleteButton.remove();
        const confirmationButton = basic.createElement(deleteButtonContainer, "button", {
          classList : "deleteVideoButton2",
          textContent : "Confirm Deletion"
        }); 
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
          basic.createElement(thumbnailTitleContainer, "h1", {
            id : `${fileID}-title`,
            textContent : fileName
          }); 
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