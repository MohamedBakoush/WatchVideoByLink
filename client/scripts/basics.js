export const favicon = document.getElementById("favicon");
export let searchableVideoDataArray = []; 

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

export function notify(type,message){
  // create notification_area if not available
  let notification_area;
  if(!document.getElementById("notification-area")){
    notification_area = createSection(websiteContentContainer(), "section" , undefined, "notification-area");
  } else{
    notification_area = document.getElementById("notification-area");
  }

  // clear what was their before, only only one notification at a time 
  notification_area.innerHTML = "";

  // create new notification
  const id = Math.random().toString(36).substr(2,10); 
  createSection(notification_area, "section", `notification ${type}`, id, message);

  // if user is not focued on webpage
  if(!document.hasFocus()){
    // change favicon
    addFaviconNotificationBadge();
  }
  
  // after a certin number of time, remove notifications
  const timer = new Timer(()=>{
    const notifications = notification_area.getElementsByClassName("notification");
    for(let i=0;i<notifications.length;i++){
      if(notifications[i].getAttribute("id") == id){
        notifications[i].remove();
      }
    } 
  },5000);

  //check if user is focued on webpage, if not repeate time for timer
  const checkIfHasFocus = setInterval(function(){  
    if(document.hasFocus()){
      // change favicon
      originalFavicon();
      // clear checkIfHasFocus
      clearInterval(checkIfHasFocus);
    }else{
      timer.change(5000); // change time to five seconds
    }
  }, 1000); 
}

// create a timer
export function Timer(callback, time) {
  this.setTimeout(callback, time);
}

// set setTimeout
Timer.prototype.setTimeout = function(callback, time) {
  var self = this;
  if(this.timer) {
      clearTimeout(this.timer);
  }
  this.finished = false;
  this.callback = callback;
  this.time = time;
  this.timer = setTimeout(function() {
      self.finished = true;
      callback();
  }, time);
  this.start = Date.now();
};

// change setTimeout time
Timer.prototype.change = function(time) {
  if(!this.finished) {
      this.setTimeout(this.callback, time);
  }
};

// replace favicon with original favicon
export function originalFavicon() { 
  favicon.href = "../favicon.ico";
}

// change favicon with a red circle bottom at left of favicon
export function addFaviconNotificationBadge() {  
  const faviconSize = 32; 

  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;

  const context = canvas.getContext("2d");
  const img = document.createElement("img");
  img.src = favicon.href;

  img.onload = () => {
    // Draw Original Favicon as Background
    context.drawImage(img, 0, 0, faviconSize, faviconSize);

    // Draw Notification Circle
    context.beginPath();
    context.arc( canvas.width - faviconSize / 4 , canvas.height - faviconSize / 4, faviconSize / 4, 0, 2*Math.PI);
    context.fillStyle = "#e84545";
    context.fill();

    // Replace favicon
    favicon.href = canvas.toDataURL("image/png");
  };
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

 function percent_encoding_to_reserved_character(string, checkFor, replaceby){
  var array = string.split(checkFor); 
  var newarray = [];
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
 
