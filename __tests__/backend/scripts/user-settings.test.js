const userSettings = require("../../../backend/scripts/user-settings");
const userSettings_json_path = "__tests__/data/user-settings.test.json";

beforeAll(() => {    
    userSettings.update_user_settings_path(userSettings_json_path); 
});

describe("update_user_settings_path", () =>  {  
    afterAll(() => { 
        userSettings.update_user_settings_path(userSettings_json_path);
    });

    it("invalid path", () =>  {
        const updated = userSettings.update_user_settings_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = userSettings.update_user_settings_path("__tests__/backend/scripts/user-settings.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("availableVideos updated", () =>  {
        const updated = userSettings.update_user_settings_path(userSettings_json_path);
        expect(updated).toBe("userSettings updated");  
    }); 
}); 