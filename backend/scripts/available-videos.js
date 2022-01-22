"use strict";
const FileSystem = require("fs"); 
const { v4: uuidv4 } = require("uuid");
const checkPathValidity = require("./check-path-validity");

let available_videos_path = "data/available-videos.json";
const available_videos  = FileSystem.readFileSync(available_videos_path);
let availableVideos = JSON.parse(available_videos);

// updated available videos path
function update_available_videos_path(newPath){ 
  const checkJsonValidity = checkPathValidity.update_json_path_validity(newPath);
  if (checkJsonValidity == "valid path") {
      const available_videos  = FileSystem.readFileSync(newPath);
      availableVideos = JSON.parse(available_videos);  
      available_videos_path = newPath; 
      return "availableVideos updated";
  } else {
    return checkJsonValidity;
  }
} 

// returns availableVideos data
function getAvailableVideos(path_array){
  if (Array.isArray(path_array)) {
    if (path_array.length !== 0) {
      let dataPath = "availableVideos";
      for (let i = 0; i < path_array.length; i++) { 
        if (i == path_array.length - 1) { 
          try {
            if (eval(dataPath)[path_array[i]]) {
              return eval(dataPath)[path_array[i]];
            } else {
              return "invalid array path";
            }
          } catch (error) {
            return "invalid array path";
          }
        } else  { 
          dataPath += `[path_array[${i}]]`;
        }
      } 
    } else {
      return "invalid array path";
    }
  } else  { 
    return availableVideos;
  } 
}

// return available Videos to its inital state
function resetAvailableVideos(){
  try {
    availableVideos = {}; 
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo);
    return "resetAvailableVideos";
  } catch (error) {
    return error;
  }
}

function updateAvailableVideoData(path_array, data) { 
  if (Array.isArray(path_array) && path_array.length !== 0) {
    if (data !== undefined) {
      let dataPath = "availableVideos";
      for (let i = 0; i < path_array.length; i++) { 
        if (i == path_array.length - 1) { 
          eval(dataPath)[path_array[i]] = data;
        } else  { 
          dataPath += `[path_array[${i}]]`;
        }
      } 
      const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
      FileSystem.writeFileSync(available_videos_path, newAvailableVideo);
      return "updateAvailableVideoData";
    } else {
      return "invalid data";
    }
  } else {
    return "invalid path_array";
  }
} 

// get available video details by folder path by string
function availableVideosfolderPath_String(folderIDPath) {
  if (Array.isArray(folderIDPath)) {
    if (folderIDPath.length !== 0) {
      let folderPathString = "";
      for (let i = 0; i < folderIDPath.length; i++) {  
        if (i === 0) {
          folderPathString = folderPathString.concat("availableVideos[\"",folderIDPath[i],"\"].content");
        } else {
          folderPathString = folderPathString.concat("[\"",folderIDPath[i],"\"].content");
        } 
      }  
      return folderPathString;      
    } else {
      return "folderIDPath array input empty";
    }
  } else {
    return "invalid folderIDPath";
  }
}

// get available video details by folder path by array
function availableVideosfolderPath_Array(folderIDPath) {
  if (Array.isArray(folderIDPath)) {
    if (folderIDPath.length !== 0) {
      let folderPathString = [];
      for (let i = 0; i < folderIDPath.length; i++) {  
        folderPathString.push(folderIDPath[i], "content");
      }  
      return folderPathString;
    } else {
      return "folderIDPath array input empty";
    }
  } else {
    return "invalid folderIDPath";
  }
}

// change title of video  
async function changeTitle(changeTitleID, newVideoTitle, folderIDPath) { 
  if (folderIDPath === undefined || folderIDPath.length === 0) { 
    // check if videoid is valid
    const videoDetails = await getAvailableVideos([changeTitleID]);
    // if video dosent exist redirect to home page
    if (videoDetails !== "invalid array path" && 
      newVideoTitle !== undefined &&
      typeof newVideoTitle == "string") { 
        try { 
          availableVideos[changeTitleID]["info"]["title"] = newVideoTitle;  
          const newAvailableVideos = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideos);  
          return {
            "message": "video-title-changed",
            "availableVideos": availableVideos
          };
        } catch (e) { 
          return {
            "message": "failed-to-change-video-title"
          };  
        }
    } else  { 
      return {
        "message": "failed-to-change-video-title"
      };  
    }
  } else {  
    // Get folder path in string form
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);
    // if folderIDPath or changeTitleID invalid, send error msg
    if (availableVideosFolderIDPath !== "folderIDPath array input empty"  && 
      availableVideosFolderIDPath !== "invalid folderIDPath"  && 
      newVideoTitle !== undefined &&
      typeof newVideoTitle == "string") {
        try { 
          eval(availableVideosFolderIDPath)[changeTitleID]["info"]["title"] = newVideoTitle;  
          const newAvailableVideos = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideos);   
          return {
            "message": "video-title-changed",
            "availableVideos": availableVideos
          };
        } catch (error) {
          return {
            "message": "failed-to-change-video-title"
          };  
        }
    } else {
      return {
        "message": "failed-to-change-video-title"
      };  
    }
  } 
}

// create Folder at availableVideos
function createFolder(folderIDPath, folderTitle) { 
  try {
    const newfolderID = `folder-${uuidv4()}`;  
    if (folderIDPath === undefined || folderIDPath.length == 0) { 
      availableVideos[newfolderID] = {
        "info": {
          "title": folderTitle, 
          "inside-folder": "folder-main"
        },
        "content": {}
      };    
    }else { 
      const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);  
      eval(availableVideosFolderIDPath)[newfolderID] = {
        "info": {
          "title": folderTitle, 
          "inside-folder": folderIDPath[[folderIDPath.length - 1] ]
        },
        "content": {}
      }; 
    }  
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
    return {
      "message": "folder-created",
      "folderID": newfolderID,
      "availableVideos": availableVideos
    };  
  } catch (error) {
    return error;
  }
}

// input selected element id out of folder element at availableVideos
function inputSelectedIDOutOfFolderID(selectedID, folderID, folderIDPath) {  
  if (Array.isArray(folderIDPath)) {
    const fromFolderID = [...folderIDPath];
    const tooFolderID = [...folderIDPath];
    if (folderID == "folder-main") {
      tooFolderID.length = 0;
    } else {
      const fodlerIDIndex = tooFolderID.indexOf(folderID); 
      tooFolderID.splice(fodlerIDIndex+1, 9e9);  
      tooFolderID.length = fodlerIDIndex+1; 
    }  
    if (tooFolderID === undefined || tooFolderID.length == 0) {  
      const availableVideosFromFolderIDPath = availableVideosfolderPath_String(fromFolderID); 
      try {
        if ( availableVideosFromFolderIDPath !== "folderIDPath array input empty"
        && availableVideosFromFolderIDPath !== "invalid folderIDPath"  
        && eval(availableVideosFromFolderIDPath)
        && eval(availableVideosFromFolderIDPath)[selectedID]) {   
          availableVideos[selectedID] = eval(availableVideosFromFolderIDPath)[selectedID]; 
          delete eval(availableVideosFromFolderIDPath)[selectedID]; 
          if (selectedID.includes("folder-")) { 
            availableVideos[selectedID].info["inside-folder"] = folderID; 
          }   
          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
          return {
            "message": "successfully-inputed-selected-out-of-folder",
            "availableVideos": availableVideos
          }; 
        } else {
          return {
            "message": "failed-to-inputed-selected-out-of-folder"
          }; 
        } 
      } catch (error) {
        return {
          "message": "failed-to-inputed-selected-out-of-folder"
        }; 
      }  
    } else {     
      const availableVideosFromFolderIDPath = availableVideosfolderPath_String(fromFolderID); 
      const availableVideosTooFolderIDPath = availableVideosfolderPath_String(tooFolderID); 
      try {
        if ( availableVideosFromFolderIDPath !== "folderIDPath array input empty"
        && availableVideosFromFolderIDPath !== "invalid folderIDPath"  
        && availableVideosTooFolderIDPath !== "folderIDPath array input empty"
        && availableVideosTooFolderIDPath !== "invalid folderIDPath" 
        && eval(availableVideosFromFolderIDPath) 
        && eval(availableVideosFromFolderIDPath)[selectedID]) { 
          eval(availableVideosTooFolderIDPath)[selectedID] = eval(availableVideosFromFolderIDPath)[selectedID]; 
          delete eval(availableVideosFromFolderIDPath)[selectedID]; 
          if (selectedID.includes("folder-")) { 
            eval(availableVideosTooFolderIDPath)[selectedID].info["inside-folder"] = folderID; 
          } 
          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
          return {
            "message": "successfully-inputed-selected-out-of-folder",
            "availableVideos": availableVideos
          }; 
        } else {
          return {
            "message": "failed-to-inputed-selected-out-of-folder"
          }; 
        }      
      } catch (error) {
        return {
          "message": "failed-to-inputed-selected-out-of-folder"
        }; 
      }   
    }
  } else {
    return {
      "message": "failed-to-inputed-selected-out-of-folder"
    }; 
  }
}

// input selected element into folder element at availableVideos
function inputSelectedIDIntoFolderID(selectedID, folderID, folderIDPath) {   
  if (folderIDPath === undefined || folderIDPath.length == 0) { 
    if (availableVideos[selectedID] && availableVideos[folderID]) {
      try {
        availableVideos[folderID].content[`${selectedID}`] = availableVideos[selectedID];
        delete availableVideos[selectedID]; 
        if (selectedID.includes("folder-")) {
          availableVideos[folderID].content[`${selectedID}`].info["inside-folder"] = folderID;
        }    
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
        return {
          "message": "successfully-inputed-selected-into-folder",
          "availableVideos": availableVideos
        };  
      } catch (error) {
        return {
          "message": "failed-to-inputed-selected-into-folder"
        };  
      }
    } else { 
      return {
        "message": "failed-to-inputed-selected-into-folder"
      };  
    }
  } else {  
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);
    try {
      if (availableVideosFolderIDPath !== "invalid folderIDPath"
      && availableVideosFolderIDPath !== "folderIDPath array input empty"
      && eval(availableVideosFolderIDPath)[folderID] 
      && eval(availableVideosFolderIDPath)[selectedID]) {
        eval(availableVideosFolderIDPath)[folderID].content[selectedID] = eval(availableVideosFolderIDPath)[selectedID]; 
        delete eval(availableVideosFolderIDPath)[selectedID]; 
        if (selectedID.includes("folder-")) {
          eval(availableVideosFolderIDPath)[folderID].content[selectedID].info["inside-folder"] = folderID;
        }  
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
        return {
          "message": "successfully-inputed-selected-into-folder",
          "availableVideos": availableVideos
        };    
      } else {
        return {
          "message": "failed-to-inputed-selected-into-folder"
        };  
      }
    } catch (error) {
      return {
        "message": "failed-to-inputed-selected-into-folder"
      };  
    }
  } 
}

// move selected id data to before target id data at available video details
function moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(selectedID, targetID, folderIDPath) {
  if (folderIDPath === undefined || folderIDPath.length == 0) { 
    try {
      const selectedIDIndex = Object.keys(availableVideos).indexOf(selectedID); 
      let targetIDIndex = Object.keys(availableVideos).indexOf(targetID);
      if (selectedIDIndex >= 0 && targetIDIndex >= 0) {
        if (selectedIDIndex > targetIDIndex) { 
          targetIDIndex = targetIDIndex + 1;
        }
        // turn availableVideos into an array
        const availableVideosArray = Object.entries(availableVideos);    
        // remove `selectedIDIndex` item and store it
        const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
        // insert stored item into position `targetIDIndex`
        availableVideosArray.splice(targetIDIndex, 0, removedItem);
        // turn availableVideosArray back into an object
        availableVideos = Object.fromEntries(availableVideosArray);  
  
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
        return {
          "message": "successfully-moved-selected-before-target",
          "availableVideos": availableVideos
        };
      } else if (selectedIDIndex >= 0 && targetIDIndex < 0){
        return {
          "message": `${selectedID} unavailable at availableVideos`
        };
      } else if (selectedIDIndex < 0 && targetIDIndex >= 0){
        return {
          "message": `${targetID} unavailable at availableVideos`
        };
      } else {
        return {
          "message": `${selectedID} && ${targetID} unavailable at availableVideos`
        };
      }
    } catch (error) {
      return {
        "message": "failed-to-moved-selected-before-target"
      };
    } 
  } else { 
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath); 
    try {
      if (eval(availableVideosFolderIDPath)) {
        const selectedIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(selectedID); 
        let targetIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(targetID); 
        if (selectedIDIndex >= 0 && targetIDIndex >= 0) {
          if (selectedIDIndex > targetIDIndex) { 
            targetIDIndex = targetIDIndex + 1;
          }
          // turn availableVideos into an array
          const availableVideosArray = Object.entries(eval(availableVideosFolderIDPath));    
          // remove `selectedIDIndex` item and store it
          const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
          // insert stored item into position `targetIDIndex`
          availableVideosArray.splice(targetIDIndex, 0, removedItem);
          // turn availableVideosArray back into an object  
          eval(availableVideosFolderIDPath.slice(0, -8)).content = Object.fromEntries(availableVideosArray);
          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
          return {
            "message": "successfully-moved-selected-before-target",
            "availableVideos": availableVideos
          };
        } else if (selectedIDIndex >= 0 && targetIDIndex < 0){
          return {
            "message": `${selectedID} unavailable at availableVideos`
          };
        } else if (selectedIDIndex < 0 && targetIDIndex >= 0){
          return {
            "message": `${targetID} unavailable at availableVideos`
          };
        } else {
          return {
            "message": `${selectedID} && ${targetID} unavailable at availableVideos`
          };
        }
      } else {
        return {
          "message": "invalid folderIDPath"
        };
      } 
    } catch (error) {
      return {
        "message": "failed-to-moved-selected-before-target"
      };
    } 
  }
}

// move selected id data to after target id data at available video details
function moveSelectedIdAfterTargetIdAtAvailableVideoDetails(selectedID, targetID, folderIDPath) {
  if (folderIDPath === undefined || folderIDPath.length == 0) {  
    try {
      const selectedIDIndex = Object.keys(availableVideos).indexOf(selectedID); 
      let targetIDIndex = Object.keys(availableVideos).indexOf(targetID);    
      if (selectedIDIndex >= 0 && targetIDIndex >= 0) {
        if (targetIDIndex > selectedIDIndex) { 
          targetIDIndex = targetIDIndex - 1;
        }
        // turn availableVideos into an array
        const availableVideosArray = Object.entries(availableVideos);    
        // remove `selectedIDIndex` item and store it
        const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
        // insert stored item into position `targetIDIndex`
        availableVideosArray.splice(targetIDIndex, 0, removedItem);
        // turn availableVideosArray back into an object
        availableVideos = Object.fromEntries(availableVideosArray);  
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
        return {
          "message": "successfully-moved-selected-after-target",
          "availableVideos": availableVideos
        };  
      } else if (selectedIDIndex >= 0 && targetIDIndex < 0){
        return {
          "message": `${selectedID} unavailable at availableVideos`
        };
      } else if (selectedIDIndex < 0 && targetIDIndex >= 0){
        return {
          "message": `${targetID} unavailable at availableVideos`
        };
      } else {
        return {
          "message": `${selectedID} && ${targetID} unavailable at availableVideos`
        };
      } 
    } catch (error) {
      return {
        "message": "failed-to-moved-selected-after-target"
      };
    } 
  } else { 
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath); 
    try {
      if (eval(availableVideosFolderIDPath)) {
        const selectedIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(selectedID); 
        let targetIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(targetID);  
        if (selectedIDIndex >= 0 && targetIDIndex >= 0) {
          if (targetIDIndex > selectedIDIndex) { 
            targetIDIndex = targetIDIndex - 1;
          }
          // turn availableVideos into an array
          const availableVideosArray = Object.entries(eval(availableVideosFolderIDPath));    
          // remove `selectedIDIndex` item and store it
          const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
          // insert stored item into position `targetIDIndex`
          availableVideosArray.splice(targetIDIndex, 0, removedItem);
          // turn availableVideosArray back into an object  
          eval(availableVideosFolderIDPath.slice(0, -8)).content = Object.fromEntries(availableVideosArray);  
          const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
          FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
          return {
            "message": "successfully-moved-selected-after-target",
            "availableVideos": availableVideos
          };
        } else if (selectedIDIndex >= 0 && targetIDIndex < 0){
          return {
            "message": `${selectedID} unavailable at availableVideos`
          };
        } else if (selectedIDIndex < 0 && targetIDIndex >= 0){
          return {
            "message": `${targetID} unavailable at availableVideos`
          };
        } else {
          return {
            "message": `${selectedID} && ${targetID} unavailable at availableVideos`
          };
        }
      } else {
        return {
          "message": "invalid folderIDPath"
        };
      } 
    } catch (error) {
      return {
        "message": "failed-to-moved-selected-after-target"
      };
    } 
  }
}

// delete availableVideos from server if exist  
function deleteSpecifiedAvailableVideosData(fileName, path_array) {  
  try { 
    if (fileName !== undefined) {
      if (path_array instanceof Array) { 
        if (path_array.length !== 0) {
          return deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, path_array);
        } else {
          return deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
        }
      } else {   
        return deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
      }   
    } else  {
      return "invalid fileName";
    } 
  } catch (error) {
    return error;
  }
}

// delete availableVideos data by fileName from provided path 
function deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, path_array) {
  if (Array.isArray(path_array)) { 
    const fileName_array = getAvailableVideos([...path_array, fileName]);
    if (fileName_array !== "invalid array path" && fileName_array) {
      let dataPath = "availableVideos";
      for (let i = 0; i < path_array.length; i++) { 
          if (i == path_array.length - 1) { 
            try {
              if (eval(dataPath)[path_array[i]][fileName]) {
                delete eval(dataPath)[path_array[i]][fileName];
                const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
                FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
                return `${fileName} deleted`;
              } else {
                return "invalid array path";
              }     
            } catch (error) {
              return "invalid array path";
            }
          } else  { 
            dataPath += `[path_array[${i}]]`;
          }
      } 
    } else {
      return "invalid array path";
    }  
  } else {
    return "invalid array path";
  }
}

// delete availableVideos data by fileName from main directory
function deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName) {
  const fileName_data = getAvailableVideos([fileName]);
  if (fileName_data !== "invalid array path" && fileName_data) { 
    delete availableVideos[fileName]; 
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
    return `${fileName} deleted`;
  } else  {
    return "invalid array path";
  }  
}

module.exports = { // export modules 
    update_available_videos_path,
    getAvailableVideos,
    resetAvailableVideos,
    updateAvailableVideoData,
    availableVideosfolderPath_String,
    availableVideosfolderPath_Array,
    changeTitle,
    createFolder,
    inputSelectedIDOutOfFolderID,
    inputSelectedIDIntoFolderID,
    moveSelectedIdBeforeTargetIdAtAvailableVideoDetails,
    moveSelectedIdAfterTargetIdAtAvailableVideoDetails,
    deleteSpecifiedAvailableVideosData,
    deleteSpecifiedAvailableVideosDataWithProvidedPath,
    deleteSpecifiedAvailableVideosDataWithoutProvidedPath
};