"use strict";

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
export function createOption(container, dataType, value, textContent){
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
