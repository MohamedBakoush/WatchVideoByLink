"use strict";
const FileSystem = require("fs");
const stream = require("stream");
const data_videos  = FileSystem.readFileSync("data/videos.json");
let videoDetails = JSON.parse(data_videos);

// check all image details in imageDetails (database) for a matching id
function findVideoDetails(id){
    if (videoDetails[id] === undefined) {
      return undefined;
    } else {
     return videoDetails[id];
   }
}

async function streamThumbnail(req, res, fileID, thumbnailID) {
  const videoDetail = await findVideoDetails(fileID);
  if (videoDetail == undefined) {
    res.status(404).redirect("/");
  }else {
    try {
      const path = videoDetails[`${fileID}`]["thumbnailFilePath"][`${thumbnailID}`];
      const file = FileSystem.createReadStream(path); // or any other way to get a readable stream
      const ps = new stream.PassThrough(); // <---- this makes a trick with stream error handling
      stream.pipeline(
       file,
       ps, // <---- this makes a trick with stream error handling
       (err) => {
        if (err) {
          console.log(err); // No such file or any other kind of error
          return res.sendStatus(400);
        }
      });
      ps.pipe(res); // <---- this makes a trick with stream error handling
    } catch (e) {
      res.status(404).redirect("/");
    }
  }
}

module.exports = { // export modules
  streamThumbnail
};
