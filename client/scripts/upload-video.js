import * as basic from "../scripts/basics.js";
import * as notify from "../scripts/notify.js";
import * as folderData from "../scripts/folder-data.js";

// upload video form 
export function uploadVideoDetails(videoLink){  
  if (videoLink === undefined) {
    return "videoLink undefined";
  } else {
    // upload video container
    const uploadVideoForm = basic.createElement(videoLink, "form", {
      classList : "uploadVideoContainer",
      id : "uploadVideoContainer"
    });
    uploadVideoForm.onsubmit = function(){
      return false;
    };
    // submit video button container
    const submitUploadVideoButtonContainer = basic.createElement(uploadVideoForm, "section", {
      classList : "submitUploadVideoButtonContainer"
    });
    // choose video input body
    const chooseVideoInputBody = basic.createElement(submitUploadVideoButtonContainer, "section", {
      classList : "chooseVideoInputBody"
    });
    // choose video input label
    const chooseVideoInputLabel = basic.createElement(chooseVideoInputBody, "label", {
      classList : "chooseVideoInputLabel"
    });
    // select video to input
    const inputUploadVideo = basic.createElement(chooseVideoInputLabel, "input", {
      type : "file",
      accept : "video/*",
      name : "file",
      required : true
    });
    // submit choosen video button container
    const submitChoosenVideoButtonContainer = basic.createElement(submitUploadVideoButtonContainer, "section", {
      classList : "submitChoosenVideoButtonContainer"
    });
    // upload Video button
    basic.createElement(submitChoosenVideoButtonContainer, "input", {
      type : "submit",
      value : "Upload Video",
      classList : "button uploadVideoButton",
    });
    // once upload Video button is clicked
    uploadVideoForm.onsubmit = function(){ 
      const file = inputUploadVideo.files[0]; 
      // file size has to be smaller then 1 GB to be uploaded to server
      if (file.size > (1024 * 1024 * 1024)) {  
        // remove upload Video container 
        uploadVideoForm.remove();
        uploadVideoDetails(videoLink);
        // error msg
        notify.message("error", "Size Error: Unable to upload videos greater then 1 GB");
      } else {
        // remove upload Video container
        uploadVideoForm.remove();  
        // create new upload Video container
        const newUploadVideoForm = basic.createElement(videoLink, "section", {
          classList : "uploadVideoContainer",
          id : "uploadVideoContainer"
        });
        // create new submit Video button container
        basic.createElement(newUploadVideoForm, "section", {
          classList : "submitUploadVideoButtonContainer",
          textContent : `Uploading: ${file.name}`
        });
        // upload video file 
        uploadFile(inputUploadVideo, videoLink, newUploadVideoForm);
      }
    };
    return "uploadVideoDetails"; 
  }
}

export async function uploadFile(data, videoLink, newUploadVideoForm){  
  if (data === undefined) {
    return "data undefined";
  } else if (videoLink === undefined) {
    return "videoLink undefined";
  } else if (newUploadVideoForm === undefined) {
    return "newUploadVideoForm undefined";
  } else { 
    try {
      // notification to user 
      notify.message("success", "Uploading: video to server");
      // gather current foler path 
      let folder_id_path = folderData.getFolderIDPath();
      // if folder_id_path is not an array retun as empty array
      if (Array.isArray(folder_id_path) !== true) {folder_id_path = [];}
      // holds file once its been choosen
      const formData = new FormData(); 
      // sends file + file data to server
      formData.append("file", data.files[0]); 
      formData.append("folder_id_path", JSON.stringify(folder_id_path));  
      const response = await fetch("/uploadVideoFile",{ 
        method: "POST",
        body: formData
      });
      // fetch response
      if (response.ok) {
        const returnedValue = await response.json();
        // reset upload video form
        if(document.getElementById("uploadVideoContainer")){   
          newUploadVideoForm.remove();
          uploadVideoDetails(videoLink);
        } 
        // notification from response
        if(returnedValue == "downloading-uploaded-video") { 
          notify.message("success", "Downloading: uploaded video"); 
          return "downloading-uploaded-video";
        } else if (returnedValue == "video-size-over-size-limit") {  
          notify.message("error","Size Error: Attempted video upload has a size greater then 1 GB");
          return "video-size-over-size-limit";
        } else if (returnedValue == "Cannot-find-ffmpeg-ffprobe") {
          notify.message("error","Encoding Error: Cannot find ffmpeg and ffprobe ");
          return "Cannot-find-ffmpeg-ffprobe";
        } else if (returnedValue == "Cannot-find-ffmpeg") {
          notify.message("error","Encoding Error: Cannot find ffmpeg");
          return "Cannot-find-ffmpeg";
        } else if (returnedValue == "Cannot-find-ffprobe") { 
          notify.message("error","Encoding Error: Cannot find ffprobe");
          return "Cannot-find-ffprobe";
        } else if (returnedValue == "ffmpeg-failed") { 
          notify.message("error","Encoding Error: ffmpeg failed");
          return "ffmpeg-failed";
        }else { 
          notify.message("error", "Encoding Error: " + returnedValue);
          return returnedValue;
        }
      } else { 
        // reset upload video form
        if(document.getElementById("uploadVideoContainer")){   
          newUploadVideoForm.remove();
          uploadVideoDetails(videoLink);
        } 
        // request error msg 
        notify.message("error","Error: Request Error."); 
        return "Failed to upload video file";
      }
    } catch (error) {  // when an error occurs
      // execute function showDetails()  
      if(document.getElementById("uploadVideoContainer")){   
        newUploadVideoForm.remove();
        uploadVideoDetails(videoLink);
      } 
      // error msg 
      notify.message("error","Error: Connection Refused.");
      return error;
    }
  }
}
