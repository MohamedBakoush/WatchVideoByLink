import * as search from "../scripts/search.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";

// send request to server to delete video and all video data permently from the system
export async function deleteVideoDataPermanently(videoID) {
    try { 
      const payload = {
        id: videoID,
        folderIDPath: folderData.getFolderIDPath()
      };  
      const response = await fetch("../delete-video-data-permanently", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }); 
      let deleteVideoStatus;
      if (response.ok) { 
        deleteVideoStatus = await response.json();
        if (deleteVideoStatus ==  `deleted-${videoID}-permanently`) {
          //remove video from /saved/videos
          document.getElementById(videoID).remove();
          // delete searchable array item 
          search.deleteIDFromSearchableVideoDataArray(videoID);
          // display either noAvailableVideosDetails or noSearchableVideoData depending on the senario
          search.noAvailableOrSearchableVideoMessage();
          notify.message("success",`Deleted: ${videoID}`);
          return `video-id-${videoID}-data-permanently-deleted`;
        } else {
          notify.message("error",`Failed Delete: ${videoID}`);
          return `video-id-${videoID}-data-failed-to-permanently-deleted`;
        }  
      } else { 
        notify.message("error","Failed Fetch: Video Deletion");
        return "Failed to Complete Request";
      } 
    } catch (error) {  
      notify.message("error","Failed Fetch: Video Deletion");
      return error;
    }
}