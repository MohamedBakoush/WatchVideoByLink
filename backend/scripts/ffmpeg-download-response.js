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

module.exports = { // export modules   
    getDownloadResponse
};