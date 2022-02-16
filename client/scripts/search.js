import * as basic from "../scripts/basics.js";
import * as showAvailableVideos from "../scripts/showAvailableVideos.js";

// get searchBarContainer 
export function searchBarContainer() {
    let searchBarContainer = document.getElementById("searchBarContainer");
    if (!searchBarContainer) {
        searchBarContainer = basic.createSection(basic.websiteContentContainer(), "section", "searchBarContainer", "searchBarContainer"); 
    }    
    return searchBarContainer;
}

// reset search bar value
export function resetSearchBarValue() {
    if (document.getElementById("searchBar")) {
        document.getElementById("searchBar").value = ""; 
    }
}

// find video by filtering trough each available video by textinput
export function searchBar(){
    // create search input
    const searchBar = basic.inputType(searchBarContainer(), "text", "searchBar", "searchBar", true);
    searchBar.name = "searchBar";
    searchBar.placeholder="Type to search";
    // filters trough video data by name at every key press
    searchBar.addEventListener("keyup", (e) => { 
        const searchString = e.target.value;
        searchBarKeyUp(searchString);
    });
    return "searchBar";
}
  
// filters trough video data by searchString input
export function searchBarKeyUp(searchString) { 
    if (typeof searchString == "string") {
        const savedVideosThumbnailContainer = document.getElementById("savedVideosThumbnailContainer");
        // check from searchableVideoDataArray if any video data title matches input string
        const filteredsearchableVideoData = getSearchableVideoDataArray().filter((video) => {
            return (
                video.info.title.toLowerCase().includes(searchString.toLowerCase())
            );
        }); 
        // clear savedVideosThumbnailContainer
        savedVideosThumbnailContainer.innerHTML = ""; 
        // check if inputed key phrase available data is avaiable or not to either display data or state the problem
        if (filteredsearchableVideoData.length == 0) {
            noAvailableOrSearchableVideoMessage();
        } else {
            showAvailableVideos.removeNoAvailableVideosDetails();
            removeNoSearchableVideoData();
            // display filterd details to client
            filteredsearchableVideoData.forEach(function(data) {   
                if (data.info.id.includes("folder-")) {
                    showAvailableVideos.showFolderDetails(savedVideosThumbnailContainer, data.info.id, data);
                } else { 
                    showAvailableVideos.showDetails(savedVideosThumbnailContainer, data.info.id, data);
                } 
            });
            return "Display filterd avaiable video data";
        } 
    } else {
        return "searchString not string";
    }
}


// display noSearchableVideoData no if exits
export function noSearchableVideoData() {
    if (!document.getElementById("noSearchableVideoData")) {
        const noSearchableVideoData = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer", "noSearchableVideoData");
        basic.createSection(noSearchableVideoData, "h1", "noAvailableVideosHeader", undefined,  "No results found: Try different keywords");
    }
}

// remove noSearchableVideoData if exits
export function removeNoSearchableVideoData() {
    if (document.getElementById("noSearchableVideoData")) {
        document.getElementById("noSearchableVideoData").remove();
    }
}
  
// if savedVideosThumbnailContainer is empty, display either noAvailableVideosDetails or noSearchableVideoData depending on the senario 
export function noAvailableOrSearchableVideoMessage() {
    if (document.getElementById("savedVideosThumbnailContainer")) {
        if (document.getElementById("savedVideosThumbnailContainer").childElementCount == 0) {  
            if(getSearchableVideoDataArray().length == 0){ 
                showAvailableVideos.noAvailableVideosDetails();
                return "no avaiable video data";
            } else {
                noSearchableVideoData();
                return "key phrase unavailable";
            }
        }
    } 
}
  
export let searchableVideoDataArray = []; 

// push data to SearchableVideoDataArray
export function getSearchableVideoDataArray() { 
    return searchableVideoDataArray;
}

// push data to SearchableVideoDataArray
export function pushDataToSearchableVideoDataArray(data) { 
    if (data === undefined) { 
        return "data undefined";
    }  else { 
        searchableVideoDataArray.push(data);
        return "updated SearchableVideoDataArray";
    } 
} 

// unshift data to SearchableVideoDataArray
export function unshiftDataToSearchableVideoDataArray(data) { 
    if (data === undefined) { 
        return "data undefined";
    }  else {
        searchableVideoDataArray.unshift(data);
        return "updated SearchableVideoDataArray";
    } 
} 

// delete data from SearchableVideoDataArray by id
export function deleteIDFromSearchableVideoDataArray(id) { 
    const searchableArrayItemId = getSearchableVideoDataArray().findIndex(x => x.info.id === id);
    searchableVideoDataArray.splice(searchableArrayItemId, 1);
    return "updated SearchableVideoDataArray";
}
  
// return SearchableVideoDataArray to its inital state
export function resetSearchableVideoDataArray() {
    searchableVideoDataArray = [];
    return "reset SearchableVideoDataArray";
}

// move from id data to before to id data at searchableVideoDataArray
export function searchableVideoDataArray_move_before(from_id, to_id) {
    if (from_id === undefined && to_id === undefined) { 
        return "from_id && to_id undefined";
    } else if (from_id === undefined) {
        return "from_id undefined";
    } else if (to_id === undefined) {
        return "to_id undefined";
    } else { 
        const selectedIDIndex = searchableVideoDataArray.findIndex(x => x.info.id === from_id);
        let targetIDIndex = searchableVideoDataArray.findIndex(x => x.info.id === to_id);
        if (selectedIDIndex === -1 && targetIDIndex === -1) {
        return `${from_id} && ${to_id} index not found`;
        } else if (selectedIDIndex === -1) {
        return `${from_id} index not found`;
        } else if (targetIDIndex === -1) {
        return `${to_id} index not found`;
        } else { 
        if (targetIDIndex > selectedIDIndex) { 
            targetIDIndex = targetIDIndex - 1;
        }
        // remove `selectedIDIndex` item and store it
        const removedItem = searchableVideoDataArray.splice(selectedIDIndex, 1)[0];
        // insert stored item into position `targetIDIndex`
        searchableVideoDataArray.splice(targetIDIndex, 0, removedItem);   
        return "searchableVideoDataArray updated successfully";
        } 
    }
}

// move from id data to after to id data at searchableVideoDataArray
export function searchableVideoDataArray_move_after(from_id, to_id) {
    if (from_id === undefined && to_id === undefined) { 
        return "from_id && to_id undefined";
    } else if (from_id === undefined) {
        return "from_id undefined";
    } else if (to_id === undefined) {
        return "to_id undefined";
    } else { 
        const selectedIDIndex = searchableVideoDataArray.findIndex(x => x.info.id === from_id);
        let targetIDIndex = searchableVideoDataArray.findIndex(x => x.info.id === to_id);
        if (selectedIDIndex === -1 && targetIDIndex === -1) {
            return `${from_id} && ${to_id} index not found`;
        } else if (selectedIDIndex === -1) {
            return `${from_id} index not found`;
        } else if (targetIDIndex === -1) {
            return `${to_id} index not found`;
        } else {        
            if (selectedIDIndex > targetIDIndex) { 
                targetIDIndex = targetIDIndex + 1;
            }
            // remove `selectedIDIndex` item and store it
            const removedItem = searchableVideoDataArray.splice(selectedIDIndex, 1)[0];
            // insert stored item into position `targetIDIndex`
            searchableVideoDataArray.splice(targetIDIndex, 0, removedItem);   
            return "searchableVideoDataArray updated successfully";
        } 
    }
}