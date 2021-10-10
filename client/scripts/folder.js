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
