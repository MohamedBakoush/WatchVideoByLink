import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";

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