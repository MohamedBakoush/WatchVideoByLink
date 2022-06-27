export let availablevideoDetails;

// get available video details
export function getAvailablevideoDetails() {
  return availablevideoDetails;
}

// set new FolderID path
export function setNewAvailablevideoDetails(newAvailablevideoDetails) {
  return availablevideoDetails = newAvailablevideoDetails;
} 

// return websiteContentContainer
export function websiteContentContainer() {
  return document.getElementById("websiteContentContainer");
}

// check if input value is an element
export function isElement(input) {  
  return input !== undefined && input !== null && input.tagName !== undefined;
}

// create a input element
export function inputType(container, type, id, classList, required){ 
  if (!isElement(container)) return "inputType didnt work";
  const inputType = document.createElement("input");  
  Object.assign(inputType,
    type === undefined ? null : {type},
    id === undefined ? null : {id},
    classList === undefined ? null : {classList},
    required === undefined ? null : {required},
  );
  container.appendChild(inputType);  
  return inputType;
}

// create a label element
export function createLabel(container, textContent){  
  if (!isElement(container)) return "createLabel didnt work"; 
  const label = document.createElement("label");
  Object.assign(label,
    textContent === undefined ? null : {textContent}, 
  );
  container.appendChild(label); 
  return label;
}

// create a input element
export function createInput(container, type, value, id, classList) { 
  if (!isElement(container)) return "createInput didnt work";
  const input = document.createElement("input");  
  Object.assign(input,
    type === undefined ? null : {type}, 
    value === undefined ? null : {value}, 
    id === undefined ? null : {id}, 
    classList === undefined ? null : {classList}, 
  );
  container.appendChild(input);
  return input; 
}

// create a option element
export function createOption(container, value, textContent){ 
  if (!isElement(container)) return "createOption didnt work";
  const option = document.createElement("option"); 
  Object.assign(option,
    value === undefined ? null : {value}, 
    textContent === undefined ? null : {textContent}, 
  );
  container.appendChild(option);
  return option; 
}

// create a section element
export function createSection(container, dataType, classList, id, textContent){ 
  if (!isElement(container)) return "createSection didnt work";
  const section = document.createElement(dataType); 
  Object.assign(section,
    classList === undefined ? null : {classList}, 
    id === undefined ? null : {id}, 
    textContent === undefined ? null : {textContent}, 
  );
  container.appendChild(section);
  return section; 
}

// create an a element
export function createLink(container, href, id, classList, textContent) {
  if (!isElement(container)) return "createLink didnt work";
  const linkContainer = document.createElement("a"); 
  Object.assign(linkContainer,
    href === undefined ? null : {href}, 
    id === undefined ? null : {id}, 
    classList === undefined ? null : {classList}, 
    textContent === undefined ? null : {textContent},  
  );
  container.appendChild(linkContainer);
  return linkContainer; 
}

// append image to container
export function appendImg(container, src, width, height, id, classList, videoID) {
  if (!isElement(container)) return "appendImg didnt work"; 
  const image = document.createElement("img"); 
  Object.assign(image,
    height === undefined ? null : {height}, 
    width === undefined ? null : {width}, 
    id === undefined ? null : {id}, 
    classList === undefined ? null : {classList}, 
    src === undefined ? null : {src}, 
  );
  image.onload = container.appendChild(image);
  image.onerror = function () {
    const video_container = document.getElementById(videoID);
    if (video_container) video_container.remove(); 
  };
  return image; 
}

// Gather reserved characters after percent-encoding
export function checkForPercentEncoding(string){ 
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
  if (typeof string !== "string") return "Encoding Failed";
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
}
 
// HMS = Hours Minutes Seconds
export function secondsToHms(sec, HMS_bool) { 
  if (isNaN(sec)) return "Sec Invalid";
  if (typeof HMS_bool !== "boolean") HMS_bool = false;

  let hours = Math.floor(sec/3600);
  (hours >= 1) ? sec = sec - (hours*3600) : hours = "00";
  let min = Math.floor(sec/60);
  (min >= 1) ? sec = sec - (min*60) : min = "00";
  (sec < 1) ? sec="00" : void 0;

  (min.toString().length == 1) ? min = "0"+min : void 0;
  (sec.toString().length == 1) ? sec = "0"+sec : void 0;
  
  return hours !== "00" || HMS_bool == true ? hours+":"+min+":"+sec 
        : min !== "00" ? +min+":"+sec 
        : "0:"+sec; 
}