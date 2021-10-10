import * as basic from "./basics.js";
import * as folder from "./folder.js";
import * as showAvailableVideos from "./showAvailableVideos.js";

// display / between folder paths 
export function breakPath(pathContainer, id) { 
    basic.createSection(pathContainer, "section", "path", `path-break-${id}`, "/");
}

// display homepage folder path by ... 
export function homepagePath(pathContainer) {
    const path = basic.createSection(pathContainer, "section", "path pathClick", "path-folder-main", "...");
    path.onclick  = function(e){
        e.preventDefault();      
        path.classList.remove("pathClick");   
        path.classList.remove("dragging-target"); 
        path.classList.add("pathClickLast");  
        if (folder.getFolderIDPath().length !== 0) { 
        folder.resetInsideFolderID();  
        basic.websiteContentContainer().innerHTML = "";
        document.body.classList = "saved-videos-body";
        basic.websiteContentContainer().classList = "saved-videos-websiteContentContainer";
        showAvailableVideos.pageLoaded(); 
        }     
    }; 
    path.onmouseenter = function(e){   
        e.preventDefault();      
        if (folder.getFolderIDPath().length === 0) {  
        path.classList.remove("pathClick");  
        path.classList.add("pathClickLast");   
        } else{ 
        path.classList.add("pathClick");  
        path.classList.remove("pathClickLast"); 
        path.classList.add("dragging-target");  
        }
    };
    path.onmouseleave = function(e){ 
        e.preventDefault();      
        path.classList.remove("dragging-target"); 
    }; 
}

// display folder path by name 
export function folderPath(savedVideosThumbnailContainer, pathContainer, fodlerID, folderTitle) {
    const path = basic.createSection(pathContainer, "section", "path pathClick", `path-${fodlerID}`, folderTitle);
    path.onmouseenter = function(e){   
        e.preventDefault();    
        if (folder.getFolderIDPath()[folder.getFolderIDPath().length - 1] !== fodlerID) { 
        path.classList.add("pathClick");  
        path.classList.remove("pathClickLast"); 
        path.classList.add("dragging-target");  
        } else{ 
        path.classList.remove("pathClick");  
        path.classList.add("pathClickLast");  
        }
    };
    path.onmouseleave = function(e){ 
        e.preventDefault();    
        path.classList.remove("dragging-target"); 
    };
    path.onclick = function(e){
        e.preventDefault();    
        path.classList.remove("pathClick");   
        path.classList.remove("dragging-target"); 
        path.classList.add("pathClickLast");  
        const folderIDPath = folder.getFolderIDPath();
        const fodlerIDIndex = folderIDPath.indexOf(fodlerID);   
        if (folderIDPath.length !== fodlerIDIndex + 1) { 
            const dataToRemove = folder.getFolderIDPath().splice(fodlerIDIndex+1, 9e9); 
            folderIDPath.length = fodlerIDIndex+1;  
            folder.newfolderIDPath(folderIDPath);   
            for (let i = 0; i < dataToRemove.length; i++) {
                document.getElementById(`path-break-${dataToRemove[i]}`).remove();
                document.getElementById(`path-${dataToRemove[i]}`).remove();  
            }  
            if (folderIDPath === undefined || folderIDPath.length == 0) {    
                console.log("availablevideoDetails");
            }else {  
                const availableVideosFolderIDPath = folder.getAvailableVideoDetailsByFolderPath(folderIDPath);  
                document.getElementById("savedVideosThumbnailContainer").remove();
                savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
                showAvailableVideos.dragDropAvailableVideoDetails(savedVideosThumbnailContainer); 
                showAvailableVideos.displayVideoDetails(savedVideosThumbnailContainer, availableVideosFolderIDPath);
            }
        } 
    };
}