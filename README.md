<h1 align="center">Welcome to WatchVideoByLink</h1>

<p align="center">
  <img src="/client/images/favicon/favicon.png" alt="WatchVideoByLink">
</p>

<p>
  <b>WatchVideoByLink</b> takes a public video/mp4, application/x-mpegURL or application/dash+xml URL Link and displays the video in a video player that has features which makes watching the provided video an enjoyable process.
</p>

## Table of Contents
* [Reason For Creation](#reason-for-creation)
* [How WatchVideoByLink Works](#how-watchvideobylink-works)
* [Features](#features)
* [WatchVideoByLink BREAKDOWN STRUCTURE (Under Construction)](#watchvideobylink-breakdown-structure-under-construction)
* [Installation](#installation)  
* [Help/Support](#helpsupport)
* [License](#license)

## Reason For Creation

When working with various types of video files for personal projects, the process of creating a new video element to test if a video files works keeps occurring, to speed up the process of testing the creation of this repository was created by allowing an individual to view .mp4, .m3u8 or .mpd files from a simple URL link.

## How WatchVideoByLink Works

WatchVideoByLink takes a public video URL link and display the video in a custom video player depending on the video type, WatchVideoByLink currently supports video/mp4 (MP4), application/x-mpegURL (HLS) or application/dash+xml (MPEG-DASH) URL Links, Automatic video type is also available but works a little bit differently as the system will try to get a video type and video link from the provided URL link.

Inside each video player there are diffrent features which makes the watching experience an enjoyable process but what video/mp4 (MP4) and application/x-mpegURL (HLS) have in common is the ability to download/record the provided video for as long of a video duration that the user wants provided by how long the original video is.

After the downloaded/recorded video has finish downloading, snapshots of the video in different locations will be taken (create thumbnails) and once everything is done the video will be found available in /saved/videos with features to make it easy to identify which video is which (sorted from newest to oldest).

## Features 
- Shareable link gets provided in the address bar when video is viewable.
- When a video has finished recording or completed its downloaded, video becomes playable from /video/:id 
- Using /?t=videoType?v=videoSrc can be used to play specified videoSrc if the videoType is supported
- All current video/thubnail downloads is viewable from homepage, top right conrner
- Video players
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
  - Shows all available videos by their thumbnails and video id as the title 
    - if the thumbnail is hovered over a series of images from the video will be displayed to show what the video is about
    - if the thumbnail is clicked it will redirect the user to the specified video
  - Menu button is available on the top right corner of each available thumbnail which if clicked shows
    - Get sharable link button
      - if clicked the video URL link will be copied for ease of shareability
    - Edit button
      - if clicked Edit mode will be shown with such features as 
        - Delete this video which once clicked deletes the video plus all its data permanently from the system 

## WatchVideoByLink BREAKDOWN STRUCTURE (Under Construction)

Spreadsheet: [WatchVideoByLink BREAKDOWN STRUCTURE](https://docs.google.com/spreadsheets/d/16rSYlLbNQtZzAzoa6HURpE8C5gtYVG4WVPpvIGOPHjo/edit#gid=0) 

## Installation

### Requirements to run WatchVideoByLink
  - [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
    1. [Download Node.js from https://nodejs.org/en/](https://nodejs.org/en/) 
    2. To check if node.js has been downloaded open command prompt for windows or terminal for macOS/Linux and enter `node -v` this will tell you what version of Node.js has been installed.
  - [Git](https://git-scm.com/) - Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.
    1. [Download Git from https://git-scm.com/](https://git-scm.com/) 
    2. To check if Git has been downloaded open command prompt for windows or terminal for macOS/Linux and enter `git --version` this will tell you what version of Git has been installed.
### Requirements to unlock additional features
  - [FFmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video.
    1. [Download FFmpeg from https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) 
    2. Once FFmpeg has been downloaded drop ffmpeg.exe and ffprobe.exe files (which could be found in ffmpeg\bin folder) in WatchVideoByLink folder.
  - [Untrunc](https://github.com/anthwlock/untrunc) - Restore a damaged (truncated) mp4, m4v, mov, 3gp video. Provided you have a similar not broken video. And some luck.
    1. [Download Untrunc from https://github.com/anthwlock/untrunc](https://github.com/anthwlock/untrunc) 
    2. Once Untrunc has been downloaded drop all Untrunc files in WatchVideoByLink folder. 
  
### Clone Repository
You can clone the repository to a local destination using git:
```
git clone https://github.com/MohamedBakoush/WatchVideoByLink.git
cd WatchVideoByLink
```

Alternatively you may download and unpack the [zip](https://github.com/MohamedBakoush/WatchVideoByLink/archive/master.zip)

### Install Dependencies
Install dependencies by:

```
npm install
```

### Download Working Videos For Unturnc
Download working videos for untrunc by:

```
npm run-script download-working-videos-for-unturnc 
```

### Start Server
Run Server by:

```
npm start
```

Then open `http://localhost:8080` in your preferred browser.

## Help/Support
WatchVideoByLink has not been forgotten but i [MohamedBakoush](https://github.com/MohamedBakoush) am busy for the next few months due to school meaning i wont be able to add new features to WatchVideoByLink on a weekly/monthly basis if you would like to contribute in any way possible please dont hesitate.

## License

WatchVideoByLink is [licensed](LICENSE) under the Apache License, Version 2.0.
