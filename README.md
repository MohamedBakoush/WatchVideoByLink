<h1 align="center">Welcome to WatchVideoByLink</h1>

<p align="center">
  <img src="/client/images/favicon/favicon.png" alt="WatchVideoByLink">
</p>

<p>
  <b>WatchVideoByLink</b> takes a public video/mp4, application/x-mpegURL or application/dash+xml URL Link and displays the video in a video player that has features which makes watching the provided video an enjoyable process.
</p>

## Reason For Creation

When working with various types of video files for personal projects, the process of creating a new video element to test if a video files works keeps occurring, to speed up the process of testing the creation of this repository was created by allowing an individual to view .mp4, .m3u8 or .mpd files from a simple URL link.

## WatchVideoByLink BREAKDOWN STRUCTURE (Still Under Construction)
Spreadsheet: [WatchVideoByLink BREAKDOWN STRUCTURE](https://docs.google.com/spreadsheets/d/1dR5ptZmkQISnky_iB1gta190fLzKpL84u4xgNpXJ2_M/edit#gid=0)

Document: [HLS streaming server with NGINX on a Ubuntu (Linux) Virtual Machine](https://docs.google.com/document/d/1tX_mrZiXoogILrApajvrsbWbkt3BEla8LAA3CHZl3Po/edit#)
 
## Features
- Shareable link gets provided in the address bar when video is viewable.
- When a video has finished recording or completed its downloaded, video becomes playable from /video/:id 
- using /?t=videoType?v=videoSrc can be used to play specified videoSrc if the videoType is supported
- video players
  - Video Type: MP4 Supports:
    - .mp4 files
    - playbackRates
    - seek-buttons
    - chromecast
    - download full video or by specified start and end times
  - Video Type: HLS Supports:
    - .m3u8 files
    - record stream
  - Video Type: MPEG-DASH Supports:
    - .mpd files
  - Video Type: Automatic:
    - takes a URL link and tries to find the videoSrc and videoType if successful it will be shown in the correct video player
    - using /?auto=URL will also activate the search
- /saved/videos
  - shows all available videos by their thumbnails and video id as the title 
    - if the thumbnail is hovered over a series of images from the video will be displayed to show what the video is about
    - if the thumbnail is clicked it will redirect the user to the specified video
  - menu button is available on the top right corner of each available thumbnail which if clicked shows
    - Get sharable link button
      - if clicked the video URL link will be copied for ease of shareability
    - Edit button
      - if clicked Edit mode will be shown with such features as 
        - Delete this video which once clicked deletes the video plus all its data permanently from the system 
 
## Restoration: when a video goes bad/corrupt
I would recommend trying <b>untrunc</b> - Restore a damaged (truncated) mp4, m4v, mov, 3gp video. Provided you have a similar not broken video.\
Original Repo: [ponchio/untrunc](https://github.com/ponchio/untrunc).\
Improved version of ponchio/untrunc: [anthwlock/untrunc](https://github.com/anthwlock/untrunc).

## Requirements to run WatchVideoByLink
  - [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
    1. [Download Node.js from https://nodejs.org/en/](https://nodejs.org/en/) 
    2. To check if node.js has been downloaded open command prompt for windows or terminal for macOS/Linux and enter `node -v` this will tell you what version of Node.js has been installed.
  - [FFmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video.
    1. [Download FFmpeg from https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) 
    2. Once FFmpeg has been downloaded drop ffmpeg.exe and ffprobe.exe files (which could be found in ffmpeg\bin folder) in WatchVideoByLink folder.
  
## Installation
You can clone the repository to a local destination using git:
```
git clone https://github.com/MohamedBakoush/WatchVideoByLink.git
cd WatchVideoByLink
npm install
```

Alternatively you may download and unpack the [zip](https://github.com/MohamedBakoush/WatchVideoByLink/archive/master.zip)

## Start Server
Run Server by:

```
npm start
```

Then open `http://localhost:8080` in your preferred browser.

## License

  [Apache License 2.0](LICENSE)
