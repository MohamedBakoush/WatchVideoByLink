import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js";

// display create folder container
export function createFolderOnClick() {
    document.body.style.overflow ="hidden";
 
    if(document.getElementById("download-status-container"))  { 
      document.getElementById("download-status-container").remove(); 
      currentVideoDownloads.stopAvailableVideoDownloadDetails();  
    }

    const create_folder_container = basic.createElement(document.body, "section", {
        classList : "create_folder_container",
        id : "create_folder_container"
    });
    const create_folder_body = basic.createElement(create_folder_container, "section", {
        classList : "create_folder_body"
    });

    const backButton = basic.createElement(create_folder_body, "button", {
        classList : "backToViewAvailableVideoButton fa fa-times",
        title : "Close Create Folder"
    });
    backButton.onclick = function(){
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    }; 

    const create_folder_article = basic.createElement(create_folder_body, "article", {
        classList : "create_folder_article"
    });
    const create_folder_form = basic.createElement(create_folder_article, "form");

    const create_folder_form_title = basic.createElement(create_folder_form, "section");
    basic.createElement(create_folder_form_title, "h2", {
        classList : "create-folder-form-title",
        textContent : "Create Folder"
    });

    const create_folder_title_edit_settings_container = basic.createElement(create_folder_form, "section");
    const create_folder_title_edit_settings_ul = basic.createElement(create_folder_title_edit_settings_container, "ul");
    const create_folder_title_edit_settings_li = basic.createElement(create_folder_title_edit_settings_ul, "li", {
        classList : "createFolderTitleEditContainer"
    });

    const create_folder_title_edit_content_container = basic.createElement(create_folder_title_edit_settings_li, "section");
    basic.createElement(create_folder_title_edit_content_container, "strong", {
        textContent : "Name"
    });
    const create_folder_title_edit_content_input =  basic.createElement(create_folder_title_edit_content_container, "input", {
        type : "text",
        classList : "createFolderTitleEditInput",
        placeholder : "Folder Name",
        required : false
    });
    create_folder_title_edit_content_input.focus();
    const create_folder_buttons_container = basic.createElement(create_folder_title_edit_settings_container, "section", {
        classList : "createFolderButtonsContainer"
    });
    const create = basic.createElement(create_folder_buttons_container, "button", {
        classList : "button createFolderButton",
        textContent : "Create"
    });  
    create.onclick = function(){   
        createFolder(document.getElementById("savedVideosThumbnailContainer"), create_folder_title_edit_content_input.value);
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
    const cancelCreateFolder = basic.createElement(create_folder_buttons_container, "button", {
        classList : "button cancelCreateFolderButton",
        textContent : "Cancel"
    });  
    cancelCreateFolder.onclick = function(){
        document.body.style.removeProperty("overflow");
        create_folder_container.remove();
    };
}

// create folder
export async function createFolder(savedVideosThumbnailContainer, folderTitle) {
    const folderIDPath = folderData.getFolderIDPath();
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
                const availableVideosFolderIDPath = folderData.getAvailableVideoDetailsByFolderPath(folderIDPath); 
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