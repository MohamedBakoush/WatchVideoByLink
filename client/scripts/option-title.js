import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";

// request to change video title
export async function changeVideoTitle(fileID, newFileTitle) { 
  // Get file type
  let fileType = "Video";
  if (fileID.includes("folder-")) fileType = "Folder";
  // Change file name
  try {
    const payload = {
      videoID: fileID,
      newVideoTitle: newFileTitle,
      folderIDPath: folderData.getFolderIDPath()
    }; 

    const response = await fetch("../changeVideoTitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let requestResponse;
    if (response.ok) {
      // get json data from response
      requestResponse = await response.json(); 
      if (requestResponse.message == "video-title-changed") { 
        const availablevideoDetails = requestResponse.availableVideos; 
        basic.setNewAvailablevideoDetails(availablevideoDetails);
        // find array id of searchableVideoDataArray by fileID
        const searchableArrayItemId = search.getSearchableVideoDataArray().findIndex(x => x.info.id === fileID);
        if (searchableArrayItemId !== -1) {// change video title from old to new
          document.getElementById(`${fileID}-title`).innerHTML = newFileTitle;
          search.searchableVideoDataArray[searchableArrayItemId].info.title = newFileTitle;
          notify.message("success",`${fileType} Title Changed: ${newFileTitle}`);
          return "File Title Changed";
        } else {
          notify.message("error", `${fileType} Data ID Unavailable`);
          return "searchable file data array id unavailable";
        }
      } else {
        notify.message("error",`Failed to Change ${fileType} Title`); 
        return "Failed to Change File Title";
      }
    } else {
      notify.message("error",`Failed to Change ${fileType} Title`); 
      return "Failed to Change File Title";
    } 
  } catch (error) {
    notify.message("error",`Failed fetch: Change ${fileType} Title`);  
    return error;
  }
}
  