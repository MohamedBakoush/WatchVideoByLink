"use strict";

// identify elements from html
const videoID = document.getElementById("video");
const videoLink = document.getElementById("videoLinkContainer");

function showVideoFromUrl(url) {
    // split url to get video and video type
    const hostname_typeVideo = url.split("?t=");
    const type_video = hostname_typeVideo[1].split( "?v=");
    const type = type_video[0];
    const video = type_video[1];
    // put video src and type in video player
    showVideo(video, type);
}
// load details into html using video and videoLink id
function showDetails() {
  // create form
  const videoLinkForm = createSection(videoLink, "form");
  videoLinkForm.onsubmit = function(){
    return false;
  };
  // video src
  createLabel(videoLinkForm, "Video Link: ");
  const videoLinkInput = inputType(videoLinkForm, "text", "videoLink", true);
  videoLinkInput.placeholder = "Enter Video Link";
  // video type
  createLabel(videoLinkForm, "Video Type: ");
  const videoTypeSelect = createSection(videoLinkForm, "select", undefined, "select");
  // all the diffrent types of video that can be choosen
  createOption(videoTypeSelect, "option", "video/mp4", "mp4");
  createOption(videoTypeSelect, "option", "application/x-mpegURL", "x-mpegURL");
  // submit video button
  createInput(videoLinkForm, "submit", "Watch Video", undefined , "watchVideoButton");
  // once sumbitVideo button is clicked
  videoLinkForm.onsubmit = function(){
    // puts video type and video file in url
    history.pushState(null, "", `?t=${videoTypeSelect.value}?v=${videoLinkInput.value}`);
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
  if (videoType == "application/x-mpegURL") {
    const videoID = document.getElementById("video");
    var player = videojs(videoID, {  // eslint-disable-line
      controls: true,
      autoplay: true,
      preload: "auto"
      });
    player.play(); // play video on load
    // player.muted(true); // mute video on load
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
    // hide time from live video player
    const style = document.createElement("style");
    style.innerHTML = `
      .video-js .vjs-time-control{display:none;}
      .video-js .vjs-remaining-time{display: none;}
    `;
    document.head.appendChild(style);
  } else {
    const videoID = document.getElementById("video");
    var player = videojs(videoID, {  // eslint-disable-line
      "playbackRates":[0.25,0.5, 1, 1.25, 1.5, 2],
      controls: true,
      techOrder: [ "chromecast", "html5" ],
      plugins: {
        chromecast: {},
        seekButtons: {
          forward: 30,
          back: 10
        }
      }
    });
    player.play(); // play video on load
    player.src({  // video type and src
      type: videoType,
      src: videoSrc
    });
  }

}

// create a input element
// with type, id
function inputType(container, type, idHere, required){
  try {
    const inputType = document.createElement("input");
    if (type != undefined) { // assign type to inputType
      inputType.type = type;
    }
    if (idHere != undefined) { // assign id to inputType
      inputType.id = idHere;
    }
    if (required != undefined) { // assign accept to inputType
      inputType.required = required;
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
    const url = window.location.href;
    if (url.includes("?t=") && url.includes("?v=")) {
      // remove videoLink from client
      videoLink.remove();
      // video styleing
      videoID.style.width = "100vw";
      videoID.style.height = "100vh";
      showVideoFromUrl(url);
    } else {
      showDetails();
    }
 }

// load pageLoaded when html page loads
addEventListener("load", pageLoaded);
