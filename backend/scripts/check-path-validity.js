"use strict"; 
const path = require("path");
const FileSystem = require("fs"); 

// check validity of json path
function update_json_path_validity(newPath) {
    if (FileSystem.existsSync(newPath)) {
        try {
            if (path.extname(newPath) === ".json") { 
                return "valid path";
            } else {
                return "input path not json"; 
            }
        } catch (error) {
            return error;
        }
    } else {
        return "invalid path";
    }
}

module.exports = { // export modules 
    update_json_path_validity
};