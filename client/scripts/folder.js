import * as basic from "./basics.js";
export let folderIDPath = [];  
import * as showAvailableVideos from "./showAvailableVideos.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js";

// get current FolderID path
export function getFolderIDPath() { 
    return folderIDPath;
}

// push new FolderID path or get current FolderID path
export function pushNewFolderIDToFolderIDPath(newInsiderFolderID) { 
    folderIDPath.push(newInsiderFolderID); 
    return folderIDPath;
}

// reset FolderID path to its inital state
export function resetInsideFolderID() { 
    folderIDPath = []; 
    return folderIDPath;
}

// set new FolderID path
export function newfolderIDPath(newfolderIDPath) {  
    folderIDPath = newfolderIDPath;
    return folderIDPath;
} 

// get available video details by folder path
export function getAvailableVideoDetailsByFolderPath(folderPath) {
    let folderPathString = "";
    for (let i = 0; i < folderPath.length; i++) {  
        if (i === 0) {
            folderPathString = folderPathString.concat("basic.getAvailablevideoDetails()[\"",folderPath[i],"\"].content");
        } else {
            folderPathString = folderPathString.concat("[\"",folderPath[i],"\"].content");
        } 
    }  
    return eval(folderPathString);
}

// display create folder container
export function createFolderOnClick() {
    document.body.style.overflow ="hidden";
 
    if(document.getElementById("download-status-container"))  { 
      document.getElementById("download-status-container").remove(); 
      currentVideoDownloads.stopAvailableVideoDownloadDetails();  
    }

    const create_folder_container = basic.createSection(document.body, "section", "create_folder_container", "create_folder_container");
    const create_folder_body = basic.createSection(create_folder_container, "section", "create_folder_body"); 

    const backButton = basic.createSection(create_folder_body, "button", "backToViewAvailableVideoButton fa fa-times"); 
    backButton.title = "Close Create Folder"; 
    backButton.onclick = function(){
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    }; 

    const create_folder_article = basic.createSection(create_folder_body, "article", "create_folder_article"); 
    const create_folder_form = basic.createSection(create_folder_article, "form");

    const create_folder_form_title = basic.createSection(create_folder_form, "section");
    basic.createSection(create_folder_form_title, "h2", "create-folder-form-title", undefined, "Create folder");

    const create_folder_title_edit_settings_container = basic.createSection(create_folder_form, "section");
    const create_folder_title_edit_settings_ul = basic.createSection(create_folder_title_edit_settings_container, "ul");
    const create_folder_title_edit_settings_li = basic.createSection(create_folder_title_edit_settings_ul, "li", "createFolderTitleEditContainer"); 

    const create_folder_title_edit_content_container = basic.createSection(create_folder_title_edit_settings_li, "section");
    basic.createSection(create_folder_title_edit_content_container, "strong", undefined, undefined, "Name");
    const create_folder_title_edit_content_input = basic.inputType(create_folder_title_edit_content_container, "text", undefined, "createFolderTitleEditInput", false);
    create_folder_title_edit_content_input.placeholder = "Folder Name";

    const create_folder_title_edit_button_container = basic.createSection(create_folder_title_edit_settings_container, "section", "createFolderTitleEditButtonsContainer");
    const cancelCreateFolder = basic.createSection(create_folder_title_edit_button_container, "button", "createFolderTitleEditButton", undefined, "Cancel");
    cancelCreateFolder.onclick = function(){
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
    const create = basic.createSection(create_folder_title_edit_button_container, "button", "createFolderTitleEditButton", undefined, "Create");  
    create.onclick = function(){   
        createFolder(document.getElementById("savedVideosThumbnailContainer"), create_folder_title_edit_content_input.value);
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
}

