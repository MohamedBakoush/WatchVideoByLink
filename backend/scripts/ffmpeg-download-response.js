"use strict";
let downloadResponse = {}; 

function getDownloadResponse(path_array){
    if (Array.isArray(path_array)) {
        if (path_array.length !== 0) {
        let dataPath = "downloadResponse";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                try {
                if (eval(dataPath)[path_array[i]] !== undefined) {
                    return eval(dataPath)[path_array[i]];
                } else {
                    return undefined;
                }
                } catch (error) {
                return undefined;
                }
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
        } else {
        return undefined;
        }
    } else  { 
        return downloadResponse;
    } 
}

function updateDownloadResponse(path_array, data) {  
    if (Array.isArray(path_array) && path_array.length !== 0) { 
        if (data !== undefined) {
        let dataPath = "downloadResponse";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
            eval(dataPath)[path_array[i]] = data; 
            return "updateDownloadResponse"; 
            } else  { 
            dataPath += `[path_array[${i}]]`;
            }
        } 
        } else {
        return "invalid data";
        }
    } else {
        return "invalid path_array";
    }   
}

function resetDownloadResponse() {
    downloadResponse = {};
    return "reset downloadResponse";
}

module.exports = { // export modules   
    getDownloadResponse,
    updateDownloadResponse,
    resetDownloadResponse
};