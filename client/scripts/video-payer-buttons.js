let fileNameID;

// update file name ID variable
export function updateFileNameID(updateFileNameID) {
  if(updateFileNameID === null) { 
    fileNameID = undefined;
    return fileNameID;
  } else if (typeof updateFileNameID !== "string" || updateFileNameID === undefined) {
    return fileNameID;
  } else {
    fileNameID = updateFileNameID;
    return fileNameID;
  }
}

// get download confirmation status
export async function getDownloadConfirmation() {
  const response = await fetch("../getDownloadConfirmation");
  let userConfirmationSettings;
  if (response.ok) {
    userConfirmationSettings = await response.json(); 
    if (userConfirmationSettings == "userConfirmationSettings unavailable") {
      userConfirmationSettings = {
        "downloadVideoStream": false,
        "trimVideo": false,
        "downloadVideo": false
      }; 
      return userConfirmationSettings;
    } else {
      return userConfirmationSettings;
    }
  } else {
    userConfirmationSettings = {
      "downloadVideoStream": false,
      "trimVideo": false,
      "downloadVideo": false
    }; 
    return userConfirmationSettings;
  }
}

// update download confirmation by id & bool
export async function updateDownloadConfirmation(id, bool) {
  const payload = {  // data sending in fetch request
    updateID : id,
    updateBool : bool
  };
  const response = await fetch("../updateDownloadConfirmation",{ 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }); 
  if (response.ok) {  
    const updateConfirmation = await response.json();  
    if (updateConfirmation == "bool updated") { 
      return "Updated confirmation";
    } else {
      return "Failed to update confirmation";
    }
  }else { 
    return "Failed to update confirmation";
  }
}

// controlBar at the top of the video player
export function topPageControlBarContainer(player) {
  const topPageControlBarContainer =  document.createElement("div");
  topPageControlBarContainer.className = "vjs-control-bar backToHomePageContainer";
  player.el().appendChild(topPageControlBarContainer);
  return topPageControlBarContainer;
}

// close video player button, go back to homepage/ previous page
export function backToHomePageButton(container, videoLinkFromUrl) {
  if (container === undefined) {
     return "container undefined";
  } else {
    const backToHomePage = document.createElement("button");
    backToHomePage.title = "Close Player";
    backToHomePage.className =  "backToHomePageButton fa fa-times vjs-control vjs-button";
    backToHomePage.onclick = function() {
      backToHomePageOnClick(videoLinkFromUrl);
    };
    container.appendChild(backToHomePage);
    return "backToHomePageButton";
  }
}

export function backToHomePageOnClick(videoLinkFromUrl) {  
  if (videoLinkFromUrl == "Automatic") {
    window.location = "/";
    return "load home page";
  } else if (document.referrer.indexOf(window.location.host) !== -1) { 
    // history.length: page loaded in a new tab returns 1
    if(history.length == 1){ 
      window.location = "/";
      return "load home page";
    } else{ 
      history.back();
      return "load previous URL from history list";
    }
   } else { 
      window.location = "/";
      return "load home page";
   } 
}