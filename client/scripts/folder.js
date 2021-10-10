import * as basic from "./basics.js";
export let folderIDPath = [];  

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
