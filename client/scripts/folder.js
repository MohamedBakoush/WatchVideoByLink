import * as basic from "./basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";
import * as showAvailableVideos from "./show-available-videos.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js";

export let folderIDPath = [];  

// get current FolderID path
export function getFolderIDPath() { 
    return folderIDPath;
}

// push new FolderID path or get current FolderID path
export function pushNewFolderIDToFolderIDPath(newInsiderFolderID) { 
    // push newInsiderFolderID to history
    if (document.location.search == "") { 
        history.pushState(null, "", `/saved/videos?=${newInsiderFolderID}`);
    } else {
        history.pushState(null, "", `/saved/videos${document.location.search}&${newInsiderFolderID}`);
    }
    // push newInsiderFolderID to folderIDPath
    folderIDPath.push(newInsiderFolderID); 
    return folderIDPath;
}

// reset FolderID path to its inital state
export function resetInsideFolderID() {  
    if (folderIDPath.length !== 0) {
        // url herf and pathname
        const url_search = window.location.search;
        const url_pathname = window.location.pathname;
        // push /saved/videos to history
        if (url_pathname === "/saved/videos" && url_search !== "") { 
            history.pushState(null, "", "/saved/videos");
        }
        // reset folderIDPath
        folderIDPath = []; 
    } 
    return folderIDPath;
}

// set new FolderID path
export function newfolderIDPath(newfolderIDPath) {   
    // push newfolderIDPath to history
    let newfolderIDPathString = "";
    for (let i = 0; i < newfolderIDPath.length; i++) {  
        if (i === 0) {
            newfolderIDPathString = newfolderIDPathString.concat("?=",newfolderIDPath[i]);
        } else {
            newfolderIDPathString = newfolderIDPathString.concat("&",newfolderIDPath[i]);
        } 
    }  
    // push folder path to history
    if (`${window.location.pathname}${window.location.search}` !== `/saved/videos${newfolderIDPathString}`) {
        history.pushState(null, "", `/saved/videos${newfolderIDPathString}`);
    }
    // set newfolderIDPath as new folderIDPath
    folderIDPath = newfolderIDPath;
    return folderIDPath;
} 

// get available video details by folder path
export function getAvailableVideoDetailsByFolderPath(folderPath) {
    try {
        let folderPathString = "";
        for (let i = 0; i < folderPath.length; i++) {  
            if (i === 0) {
                folderPathString = folderPathString.concat("basic.getAvailablevideoDetails()[\"",folderPath[i],"\"].content");
            } else {
                folderPathString = folderPathString.concat("[\"",folderPath[i],"\"].content");
            } 
        }  
        return eval(folderPathString);  
    } catch (error) {
        return undefined;
    }
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
    basic.createSection(create_folder_form_title, "h2", "create-folder-form-title", undefined, "Create Folder");

    const create_folder_title_edit_settings_container = basic.createSection(create_folder_form, "section");
    const create_folder_title_edit_settings_ul = basic.createSection(create_folder_title_edit_settings_container, "ul");
    const create_folder_title_edit_settings_li = basic.createSection(create_folder_title_edit_settings_ul, "li", "createFolderTitleEditContainer"); 

    const create_folder_title_edit_content_container = basic.createSection(create_folder_title_edit_settings_li, "section");
    basic.createSection(create_folder_title_edit_content_container, "strong", undefined, undefined, "Name");
    const create_folder_title_edit_content_input = basic.inputType(create_folder_title_edit_content_container, "text", undefined, "createFolderTitleEditInput", false);
    create_folder_title_edit_content_input.placeholder = "Folder Name"; 
    create_folder_title_edit_content_input.focus();

    const create_folder_buttons_container = basic.createSection(create_folder_title_edit_settings_container, "section", "createFolderButtonsContainer");
    const create = basic.createSection(create_folder_buttons_container, "button", "button createFolderButton", undefined, "Create");  
    create.onclick = function(){   
        createFolder(document.getElementById("savedVideosThumbnailContainer"), create_folder_title_edit_content_input.value);
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
    const cancelCreateFolder = basic.createSection(create_folder_buttons_container, "button", "button cancelCreateFolderButton", undefined, "Cancel");
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
            search.removeNoSearchableVideoData();
            const availablevideoDetails = requestResponse.availableVideos; 
            notify.message("success", `Created Folder: ${folderTitle}`);     
            basic.setNewAvailablevideoDetails(availablevideoDetails);
            let showDetails;  
            if (folderIDPath.length  === 0 || folderIDPath === undefined) { 
                search.unshiftDataToSearchableVideoDataArray(availablevideoDetails[requestResponse.folderID]);
                showDetails = showAvailableVideos.showFolderDetails(savedVideosThumbnailContainer, requestResponse.folderID, availablevideoDetails[requestResponse.folderID]);  
            } else { 
                const availableVideosFolderIDPath = getAvailableVideoDetailsByFolderPath(folderIDPath); 
                search.unshiftDataToSearchableVideoDataArray(availableVideosFolderIDPath[requestResponse.folderID]);
                showDetails = showAvailableVideos.showFolderDetails(savedVideosThumbnailContainer, requestResponse.folderID, availableVideosFolderIDPath[requestResponse.folderID]);  
            }     
            if (showDetails == "showFolderDetails") {  
                savedVideosThumbnailContainer.insertBefore(document.getElementById(requestResponse.folderID), [...savedVideosThumbnailContainer.children][0]); 
            }       
        } else { 
            notify.message("error", "Failed: Create Folder");  
        }  
    } else { 
        notify.message("error","Failed Fetch: Create Folder");
        return "Failed to Complete Request";
    } 
}

// input selected element by id into folder by id 
export async function inputSelectedIDIntoFolderID(selectedID, folderID) { 
    const fileNames = getInputSelectedIDIntoFolderIDFileNames(selectedID, folderID);
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
            search.deleteIDFromSearchableVideoDataArray(selectedID);   
            basic.setNewAvailablevideoDetails(requestResponse.availableVideos);
            // display either noAvailableVideosDetails or noSearchableVideoData depending on the senario
            search.noAvailableOrSearchableVideoMessage();
            notify.message("success", `Moved: ${fileNames.selectedIDTitle} Into ${fileNames.folderIDTitle}`); 
        } else {
            notify.message("error", `Failed Moved: ${fileNames.selectedIDTitle} Into ${fileNames.folderIDTitle}`);    
        }
    } else { 
        notify.message("error",`Failed Fetch: Input ${fileNames.selectedIDTitle} Into ${fileNames.folderIDTitle}`);
        return "Failed to Complete Request";
    } 
}
  
// get selected and folder file names 
function getInputSelectedIDIntoFolderIDFileNames(selectedID, folderID) {
    let selectedIDTitle, folderIDTitle;
    try {  
        if (getFolderIDPath().length == 0) { 
            const availableVideosPath = basic.getAvailablevideoDetails();
            selectedIDTitle = availableVideosPath[selectedID].info.title; 
            folderIDTitle = availableVideosPath[folderID].info.title;  
        } else {
            const availableVideosFolderIDPath = getAvailableVideoDetailsByFolderPath(getFolderIDPath()); 
            selectedIDTitle = availableVideosFolderIDPath[selectedID].info.title; 
            folderIDTitle = availableVideosFolderIDPath[folderID].info.title;  
        }   
        return  {
            selectedIDTitle: selectedIDTitle,
            folderIDTitle: folderIDTitle
        }; 
    } catch (error) {
        return  {
            selectedIDTitle: selectedID,
            folderIDTitle: folderID
        };  
    }
}

// input selected element by id out of folder by id 
export async function inputSelectedIDOutOfFolderID(selectedID, folderID) {  
    const fileNames = getInputSelectedIDOutOfFolderIDFileNames(selectedID, folderID);
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
            search.deleteIDFromSearchableVideoDataArray(selectedID);
            basic.setNewAvailablevideoDetails(requestResponse.availableVideos);
            // display either noAvailableVideosDetails or noSearchableVideoData depending on the senario
            search.noAvailableOrSearchableVideoMessage();
            notify.message("success", `Moved: ${fileNames.selectedIDTitle} To ${fileNames.folderIDTitle}`);    
        } else {
            notify.message("error", `Failed Moved: ${fileNames.selectedIDTitle} To ${fileNames.folderIDTitle}`);    
        } 
    } else { 
        notify.message("error",`Failed Fetch: Input ${fileNames.selectedIDTitle} To ${fileNames.folderIDTitle}`);
        return "Failed to Complete Request";
    } 
}

// get selected and folder file names
function getInputSelectedIDOutOfFolderIDFileNames(selectedID, folderID) {
    try {
        const availableVideosPath = basic.getAvailablevideoDetails();
        let selectedIDTitle, folderIDTitle;
        // get title selectedID 
        const availableVideosFolderIDPath = getAvailableVideoDetailsByFolderPath(getFolderIDPath()); 
        selectedIDTitle = availableVideosFolderIDPath[selectedID].info.title;  
        // get title folderID 
        let folderPath = [];  
        folderPath.push(...getFolderIDPath()); 
        const fodlerIDIndex = folderPath.indexOf(folderID);     
        if (folderID == "folder-main") {  
            folderIDTitle = "Main Folder";
        } else if (fodlerIDIndex == 0) { 
            folderIDTitle = availableVideosPath[folderID].info.title;   
        } else {    
            folderPath.length = fodlerIDIndex;    
            const availableVideosFolderIDPath2 = getAvailableVideoDetailsByFolderPath(folderPath); 
            folderIDTitle = availableVideosFolderIDPath2[folderID].info.title; 
        }    
        return  {
            selectedIDTitle: selectedIDTitle,
            folderIDTitle: folderIDTitle
        };  
    } catch (error) { 
        return  {
            selectedIDTitle: selectedID,
            folderIDTitle: folderID
        };  
    }
}