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

// check if input value undefined
export function isUndefined(input) {
  if (input === undefined) return true;
  return false;
}

// create a input element
export function inputType(container, type, idHere, classHere, required){
  try {
    const inputType = document.createElement("input");
    if (!isUndefined(type)) inputType.type = type;
    if (!isUndefined(idHere)) inputType.id = idHere;
    if (!isUndefined(classHere)) inputType.classList = classHere;
    if (!isUndefined(required)) inputType.required = required;
    container.appendChild(inputType);
    return inputType;
  } catch (e) { // return fail
      return "inputType didnt work";
  }
}

// create a label element
export function createLabel(container, string){  
 try {
   const label = document.createElement("label");
   if (!isUndefined(string)) label.textContent = string;
   container.appendChild(label); 
   return label;
 } catch (e) { // return fail
   return "createLabel didnt work";
 }
}

// create a input element
export function createInput(container, type, value, idHere, classHere) {
  try {
    const input = document.createElement("input"); 
    if (!isUndefined(type)) input.type = type; 
    if (!isUndefined(value)) input.value = value; 
    if (!isUndefined(idHere)) input.id = idHere;
    if (!isUndefined(classHere)) input.classList = classHere;
    container.appendChild(input);
    return input;
  } catch (e) { // return fail
    return "createInput didnt work";
  }
}

// create a option element
export function createOption(container, value, textContent){
  try {
    const option = document.createElement("option");
    if (!isUndefined(value)) option.value = value; 
    if (!isUndefined(textContent)) option.textContent = textContent; 
    container.appendChild(option);
    return option;
  } catch (e) { // return fail
    return "createOption didnt work";
  }
}

// create a section element
export function createSection(container, dataType, classHere, idHere, string){
  try {
    const section = document.createElement(dataType);
    if (!isUndefined(classHere)) section.classList = classHere; 
    if (!isUndefined(idHere)) section.id = idHere; 
    if (!isUndefined(string)) section.textContent = string; 
    container.appendChild(section);
    return section;
  } catch (e) { // return fail
    return "createSection didnt work";
  }
}

// create an a element
export function createLink(container, href, idHere, classHere, textContent) {
  try {
    const linkContainer = document.createElement("a");
    if (!isUndefined(href)) linkContainer.href = href;
    if (!isUndefined(idHere)) linkContainer.id = idHere;
    if (!isUndefined(classHere)) linkContainer.classList = classHere;
    if (!isUndefined(textContent)) linkContainer.textContent = textContent;
    container.appendChild(linkContainer);
    return linkContainer;
  } catch (e) { // return fail
    return "createLink didnt work";
  }
}

// append image to container
export function appendImg(container, src, width, height, idHere, classHere, videoInfo_ID) {
  try {
    const image = document.createElement("img");
    if (!isUndefined(height)) image.height = height;
    if (!isUndefined(width)) image.width = width;
    if (!isUndefined(idHere)) image.id = idHere;
    if (!isUndefined(classHere)) image.classList = classHere;
    if (!isUndefined(src)) image.src = src;
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