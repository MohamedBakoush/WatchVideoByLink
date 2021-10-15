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
    create_folder_title_edit_content_input.focus();

    const create_folder_title_edit_button_container = basic.createSection(create_folder_title_edit_settings_container, "section", "createFolderTitleEditButtonsContainer");
    const create = basic.createSection(create_folder_title_edit_button_container, "button", "createFolderTitleEditButton", undefined, "Create");  
    create.onclick = function(){   
        createFolder(document.getElementById("savedVideosThumbnailContainer"), create_folder_title_edit_content_input.value);
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
    const cancelCreateFolder = basic.createSection(create_folder_title_edit_button_container, "button", "createFolderTitleEditButton", undefined, "Cancel");
    cancelCreateFolder.onclick = function(){
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
}

// create folder
export async function createFolder(savedVideosThumbnailContainer, folderTitle) {
    const folderIDPath = getFolderIDPath();
    const payload = { 
        folderIDPath: folderIDPath,
        folderTitle: folderTitle
    };  
    const response = await fetch("../createFolder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    let requestResponse;
    if (response.ok) {  
        requestResponse = await response.json();     
        if (requestResponse.message == "folder-created") {
            showAvailableVideos.removeNoAvailableVideosDetails();
            const availablevideoDetails = requestResponse.availableVideos; 
            basic.notify("success", `Created Folder: ${folderTitle}`);     
            basic.setNewAvailablevideoDetails(availablevideoDetails);
            let showDetails;  
            if (folderIDPath.length  === 0 || folderIDPath === undefined) { 
                basic.pushDataToSearchableVideoDataArray(availablevideoDetails[requestResponse.folderID]);
                showDetails = showAvailableVideos.showFolderDetails(savedVideosThumbnailContainer, requestResponse.folderID, availablevideoDetails[requestResponse.folderID]);  
            } else { 
                const availableVideosFolderIDPath = getAvailableVideoDetailsByFolderPath(folderIDPath); 
                basic.pushDataToSearchableVideoDataArray(availableVideosFolderIDPath[requestResponse.folderID]);
                showDetails = showAvailableVideos.showFolderDetails(savedVideosThumbnailContainer, requestResponse.folderID, availableVideosFolderIDPath[requestResponse.folderID]);  
            }     
            if (showDetails == "showFolderDetails") {  
                savedVideosThumbnailContainer.insertBefore(document.getElementById(requestResponse.folderID), [...savedVideosThumbnailContainer.children][0]); 
            }       
        } else { 
            basic.notify("error", "Failed: Create Folder");  
        }  
    } else { 
        basic.notify("error","Failed Fetch: Create Folder");
        return "Failed to Complete Request";
    } 
}

// input selected element by id into folder by id 
export async function inputSelectedIDIntoFolderID(selectedID, folderID) { 
    const payload = {
        folderIDPath: getFolderIDPath(),
        folderID: folderID,
        selectedID: selectedID
    }; 
    let requestResponse;
    const response = await fetch("../inputSelectedIDIntoFolderID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (response.ok) { 
        requestResponse = await response.json();  
        if (requestResponse.message == "successfully-inputed-selected-into-folder") {
            basic.notify("success", `Moved: ${selectedID} into ${folderID}`);    
            const availablevideoDetails = requestResponse.availableVideos;
            basic.setNewAvailablevideoDetails(availablevideoDetails);
        } else {
            basic.notify("error", `Failed Moved: ${selectedID} into ${folderID}`);    
        }
    } else { 
        basic.notify("error",`Failed Fetch: input ${selectedID} into ${folderID}`);
        return "Failed to Complete Request";
    } 
}
  
// input selected element by id out of folder by id 
export async function inputSelectedIDOutOfFolderID(selectedID, folderID) {  
    const payload = {
        folderIDPath: getFolderIDPath(),
        folderID: folderID,
        selectedID: selectedID
    }; 
    let requestResponse;
    const response = await fetch("../inputSelectedIDOutOfFolderID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (response.ok) { 
        requestResponse = await response.json();  
        if (requestResponse.message == "successfully-inputed-selected-out-of-folder") {
            basic.notify("success", `Moved: ${selectedID} out of ${folderID}`);    
            const availablevideoDetails = requestResponse.availableVideos;
            basic.setNewAvailablevideoDetails(availablevideoDetails);
        } else {
            basic.notify("error", `Failed Moved: ${selectedID} out of ${folderID}`);    
        } 
    } else { 
        basic.notify("error",`Failed Fetch: input ${selectedID} out of ${folderID}`);
        return "Failed to Complete Request";
    } 
}