import * as basic from "../scripts/basics.js";
import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";

// request to change video title
export async function changeVideoTitle(videoID, newVideoTitle) { 
    try {
      const payload = {
        videoID: videoID,
        newVideoTitle: newVideoTitle,
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
          // find array id of searchableVideoDataArray by videoID
          const searchableArrayItemId = search.getSearchableVideoDataArray().findIndex(x => x.info.id === videoID);
          if (searchableArrayItemId !== -1) {// change video title from old to new
            document.getElementById(`${videoID}-title`).innerHTML = newVideoTitle;
            search.searchableVideoDataArray[searchableArrayItemId].info.title = newVideoTitle;
            notify.message("success",`Video Title Changed: ${newVideoTitle}`);
            return "Video Title Changed";
          } else {
            notify.message("error", "Video Data ID Unavailable");
            return "searchable video data array id unavailable";
          }
        } else {
          notify.message("error","Failed to Change Video Title"); 
          return "Failed to Change Video Title";
        }
      } else {
        notify.message("error","Failed to Change Video Title"); 
        return "Failed to Change Video Title";
      } 
    } catch (error) {
      notify.message("error","Failed fetch: Change Video Title");  
      return error;
    }
  }
  