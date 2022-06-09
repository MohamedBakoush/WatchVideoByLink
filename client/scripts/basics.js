export let availablevideoDetails;

// get available video details
export function getAvailablevideoDetails() {
  return availablevideoDetails;
}

// set new FolderID path
export function setNewAvailablevideoDetails(newAvailablevideoDetails) {  
  availablevideoDetails = newAvailablevideoDetails;
  return availablevideoDetails;
} 

// return websiteContentContainer
export function websiteContentContainer() {
  return document.getElementById("websiteContentContainer");
}

// create a input element
// with optional input type, id, classList and if input type is required or not
export function inputType(container, type, idHere, classHere, required){
  try {
    const inputType = document.createElement("input");
    if (type != undefined) { // assign type to inputType
      inputType.type = type;
    }
    if (idHere != undefined) { // assign id to inputType
      inputType.id = idHere;
    }
    if (classHere != undefined) { // assign class to input
      inputType.classList = classHere;
    }
    if (required != undefined) { // assign required to inputType
      inputType.required = required;
    }
    container.appendChild(inputType); // append inputType inside container
    return inputType; // return inputType
  } catch (e) { // return fail
      return "inputType didnt work";
  }
}

// create a label element
// with optional textContent
export function createLabel(container, string){ // label maker
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
// with optional input type, value, id and classlist
export function createInput(container, type, value, idHere, classHere) {
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
// with optional value and textContent
export function createOption(container, value, textContent){
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
// with optional classList, id and textContent
export function createSection(container, dataType, classHere, idHere, string){
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

// create an a element
// with optional href, classList, id and textContent
export function createLink(container, herf, idHere, classHere, textContent) {
  try {  // if inputs are valid
    const linkContainer = document.createElement("a"); // create element
    if (herf != undefined) {
      linkContainer.href = herf; // create herf to linkContainer
    }
    if (idHere != undefined) {
      linkContainer.id = idHere; // create id to linkContainer
    }
    if (classHere != undefined) {
      linkContainer.classList = classHere; // create class to linkContainer
    }
    if (textContent != undefined) {  // assign string to linkContainer
      linkContainer.textContent = textContent;
    }
    container.appendChild(linkContainer); // append linkContainer in container
    return linkContainer; // return linkContainer
  } catch (e) { // return fail
    return "createLink didnt work";
  }
}

// append image to container with features as, src, onload, onerror and optional  height, width
export function appendImg(container, src, width, height, idHere, classHere, videoInfo_ID) {
  try {
    const image = document.createElement("img"); // create image element
    if (height != undefined) { // assign height
      image.height = height;
    }
    if (width != undefined) { // assign height
      image.width = width;
    }
    if (idHere != undefined) { // assign id
      image.id = idHere;
    }
    if (classHere != undefined) { // assign class
      image.classList = classHere;
    }   
    if (src != undefined) { // assign src
      image.src = src;
    }    
    image.onload = function () { 
     container.appendChild(image); // append image in container
    };
    image.onerror = function () {
      if (document.getElementById(videoInfo_ID)) { // remove image container
        document.getElementById(videoInfo_ID).remove(); 
      }
    };
    return image;
  } catch (e) { // when an error occurs
    return "appendImg didnt work";
  }
}

// check for percent encoding
export function checkForPercentEncoding(string){ 
  // reserved characters after percent-encoding
  // gen-delims
  const str1 = percent_encoding_to_reserved_character(string, "%3A", ":");
  const str2 = percent_encoding_to_reserved_character(str1, "%2F", "/");
  const str3 = percent_encoding_to_reserved_character(str2, "%3F", "?");
  const str4 = percent_encoding_to_reserved_character(str3, "%23", "#");
  const str5 = percent_encoding_to_reserved_character(str4, "%5B", "[");
  const str6 = percent_encoding_to_reserved_character(str5, "%5D", "]");
  const str7 = percent_encoding_to_reserved_character(str6, "%40", "@");

  // sub-delims  
  const str8 = percent_encoding_to_reserved_character(str7, "%21", "!");
  const str9 = percent_encoding_to_reserved_character(str8, "%24", "$");
  const str10 = percent_encoding_to_reserved_character(str9, "%26", "&");
  const str11 = percent_encoding_to_reserved_character(str10, "%27", "'");
  const str12 = percent_encoding_to_reserved_character(str11, "%28", "(");
  const str13 = percent_encoding_to_reserved_character(str12, "%29", ")");
  const str14 = percent_encoding_to_reserved_character(str13, "%2A", "*");
  const str15 = percent_encoding_to_reserved_character(str14, "%2B", "+");
  const str16 = percent_encoding_to_reserved_character(str15, "%2C", ",");
  const str17 = percent_encoding_to_reserved_character(str16, "%3B", ";");
  const str18 = percent_encoding_to_reserved_character(str17, "%3D", "=");

  return str18;
}

export function percent_encoding_to_reserved_character(string, checkFor, replaceby){
  try {
    const array = string.split(checkFor); 
    const newarray = [];
    for(var x = 0; x < array.length; x++){ 
      if(x == (array.length - 1)){ 
        newarray.push(array[x]);
      } else{
        newarray.push(array[x]+replaceby);
      }
    }
    const str = newarray.join(""); 
    return str;
  } catch (error) {
    return "Encoding Failed";
  }
}
 
// converts seconds to hours:min:sec
export function secondsToHms(sec, showHMS) { 
  if (isNaN(sec)) {
    return "Sec Invalid";
  } else {
    let hours = Math.floor(sec/3600);
    (hours >= 1) ? sec = sec - (hours*3600) : hours = "00";
    let min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = "00";
    (sec < 1) ? sec="00" : void 0;
  
    (min.toString().length == 1) ? min = "0"+min : void 0;
    (sec.toString().length == 1) ? sec = "0"+sec : void 0;
  
  
    if (typeof showHMS !== "boolean") {
      showHMS = false;
    }
    
    if (hours !== "00" || showHMS == true) {
      return hours+":"+min+":"+sec; 
    } else if (min !== "00") {
      return +min+":"+sec; 
    } else {
      return "0:"+sec;
    }
  }
}