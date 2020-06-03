"use strict";

// load details into html using video and videoLink id
function showDetails() {
  const videoID = document.getElementById("video");
  const videoLink = document.getElementById("videoLink");
  // create form
  const videoLinkForm = createSection(videoLink, "form");
  videoLinkForm.onsubmit = function(){
    return false;
  };
  // video src
  createLabel(videoLinkForm, "Video Link: ");
  const videoLinkInput = inputType(videoLinkForm, "text", "videoLink");
  videoLinkInput.placeholder = "Enter Video Link";
  // video type
  createLabel(videoLinkForm, "Video Type: ");
  const videoTypeSelect = createSection(videoLinkForm, "select", undefined, "select");
  // all the diffrent types of video that can be choosen
  createOption(videoTypeSelect, "option", "video/mp4", "mp4");
  createOption(videoTypeSelect, "option", "application/x-mpegURL", "x-mpegURL");
  // submit video button
  const sumbitVideo = createInput(videoLinkForm, "submit", "Watch Video", undefined , undefined);
  // once sumbitVideo button is clicked
  sumbitVideo.onclick = function(){
    // remove videoLink from client
    videoLink.remove();
    // video styleing
    videoID.style.width = "100vw";
    videoID.style.height = "100vh";
    // put video src and type in video player
    showVideo(videoLinkInput.value, videoTypeSelect.value);
  };
}

// assign video src and type to video id
function showVideo(videoSrc, videoType) {
  const videoID = document.getElementById("video");
  var player = videojs(videoID);  // eslint-disable-line
  player.play(); // play video on load
  // player.muted(true); // mute video on load
  player.src({  // video type and src
    type: videoType,
    src: videoSrc
  });
}

// create a input element
// with type, id
function inputType(container, type, idHere){
  try {
    const inputType = document.createElement("input");
    if (type != undefined) { // assign type to inputType
      inputType.type = type;
    }
    if (idHere != undefined) { // assign id to inputType
      inputType.id = idHere;
    }
    container.appendChild(inputType);
    return inputType;
  } catch (e) {
      return "inputType didnt work";
  }
}

// create a label element
// with textContent
function createLabel(container, string){ // label maker
 try { // if inputs are valid
   const label = document.createElement("label"); // create input
   if (string != undefined) { // assign textContent to label
      label.textContent = string;
   }
   container.appendChild(label); // append label inside container
   return label; // return label
 } catch (e) { // return fail
   return "createLabel didnt work";
 }
}

// create a input element
// with type, value, id and classlist
function createInput(container, type, value, idHere, classHere) {
  try {
    const input = document.createElement("input");
    input.type = type;
    if (type != undefined) { // assign type to input
      input.type = type;
    }
    if (value != undefined) { // assign value to input
      input.value = value;
    }
    if (idHere != undefined) { // assign id to input
      input.id = idHere;
    }
    if (classHere != undefined) { // assign class to input
      input.classList = classHere;
    }
    container.appendChild(input); // append input in container
    return input; // return input
  } catch (e) { // return fail
    return "createInput didnt work";
  }
}

// create a option element
// with value, textContent
function createOption(container, dataType, value, textContent){
  try {  // if inputs are valid
    const option = document.createElement("option"); // create element
    if (value != undefined) { // assign value to option
      option.value = value;
    }
    if (textContent != undefined) { // assign textContent to option
      option.textContent = textContent;
    }
    container.appendChild(option); // append option in container
    return option; // return option
  } catch (e) { // return fail
    return "createOption didnt work";
  }
}

// create a section element
// with classList, id and textContent
function createSection(container, dataType, classHere, idHere, string){
  try {  // if inputs are valid
    const section = document.createElement(dataType); // create element
    if (classHere != undefined) { // assign classHere to section
      section.classList = classHere;
    }
    if (idHere != undefined) { // assign id to section
      section.id = idHere;
    }
    if (string != undefined) { // assign string to section
      section.textContent = string;
    }
    container.appendChild(section); // append section in container
    return section; // return section
  } catch (e) { // return fail
    return "createSection didnt work";
  }
}

// all the functions that are to load when the page loads
function pageLoaded() {
  showDetails();
 }

// load pageLoaded when html page loads
addEventListener("load", pageLoaded);
