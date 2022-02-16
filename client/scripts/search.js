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
  