const createJsonData = require("./create-json-data");
const setupUntrunc = require("./setup-untrunc");

// JSON Database
createJsonData.create_available_videos();
createJsonData.create_current_download_videos();
createJsonData.create_data_videos();
createJsonData.create_user_settings();

// Untrunc
setupUntrunc.download_working_videos_for_untrunc();