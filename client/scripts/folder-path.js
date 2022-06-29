import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as folderData from "../scripts/folder-data.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";

// display / between folder paths 
export function breakPath(pathContainer, id) { 
    basic.createElement(pathContainer, "section", {
        classList : "path",
        id : `path-break-${id}`,
        textContent : "/"
    }); 
}

// display homepage folder path by ... 
export function homepagePath(pathContainer) {
    const path = basic.createElement(pathContainer, "section", {
        classList : "path pathClick",
        id : "path-folder-main",
        textContent : "..."
    }); 
    document.title = "saved videos - WatchVideoByLink";
    path.onclick  = function(e){
        e.preventDefault();      
        path.classList.remove("pathClick");   
        path.classList.remove("dragging-target"); 
        path.classList.add("pathClickLast");  
        if (folderData.getFolderIDPath().length !== 0) { 
        folderData.resetInsideFolderID();  
        basic.websiteContentContainer().innerHTML = "";
        document.body.classList = "saved-videos-body";
        basic.websiteContentContainer().classList = "saved-videos-websiteContentContainer";
        showAvailableVideos.pageLoaded(); 
        }     
    }; 
    path.onmouseenter = function(e){   
        e.preventDefault();      
        if (folderData.getFolderIDPath().length === 0) {  
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
    breakPath(pathContainer, fodlerID);
    const path = basic.createElement(pathContainer, "section", {
        classList : "path pathClick", 
        id : `path-${fodlerID}`,
        textContent : folderTitle
    }); 
    document.title = `${folderTitle} - WatchVideoByLink`;
    path.onmouseenter = function(e){   
        e.preventDefault();    
        if (folderData.getFolderIDPath()[folderData.getFolderIDPath().length - 1] !== fodlerID) { 
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
        showAvailableVideos.removeNoAvailableVideosDetails();
        search.removeNoSearchableVideoData();
        search.resetSearchBarValue();
        path.classList.remove("pathClick");   
        path.classList.remove("dragging-target"); 
        path.classList.add("pathClickLast");  
        const folderIDPath = folderData.getFolderIDPath();
        const fodlerIDIndex = folderIDPath.indexOf(fodlerID);   
        if (folderIDPath.length !== fodlerIDIndex + 1) { 
            const dataToRemove = folderData.getFolderIDPath().splice(fodlerIDIndex+1, 9e9); 
            folderIDPath.length = fodlerIDIndex+1;  
            folderData.newfolderIDPath(folderIDPath);   
            for (let i = 0; i < dataToRemove.length; i++) {
                document.getElementById(`path-break-${dataToRemove[i]}`).remove();
                document.getElementById(`path-${dataToRemove[i]}`).remove();  
            }  
            document.title = `${folderTitle} - WatchVideoByLink`;
            if (folderIDPath === undefined || folderIDPath.length == 0) {    
                console.log("availablevideoDetails");
            }else {  
                const availableVideosFolderIDPath = folderData.getAvailableVideoDetailsByFolderPath(folderIDPath);  
                document.getElementById("savedVideosThumbnailContainer").remove();
                savedVideosThumbnailContainer = basic.createElement(basic.websiteContentContainer(), "section", {
                    classList : "dragDropContainer savedVideosThumbnailContainer", 
                    id : "savedVideosThumbnailContainer"
                });
                showAvailableVideos.dragDropAvailableVideoDetails(savedVideosThumbnailContainer); 
                showAvailableVideos.displayVideoDetails(savedVideosThumbnailContainer, availableVideosFolderIDPath);
            }
        } 
    };
}