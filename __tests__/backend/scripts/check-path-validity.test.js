const checkPathValidity = require("../../../backend/scripts/check-path-validity");
const valid_json_path = "__tests__/data/available-videos.test.json";

describe("update_json_path_validity", () =>  {  
    it("invalid path", () =>  {
        const updated = checkPathValidity.update_json_path_validity();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = checkPathValidity.update_json_path_validity("__tests__/backend/scripts/available-videos.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("valid path", () =>  {
        const updated = checkPathValidity.update_json_path_validity(valid_json_path);
        expect(updated).toBe("valid path");  
    }); 
}); 