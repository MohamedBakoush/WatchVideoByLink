<p align="center">
  <big><strong>WatchVideoByLink</strong></big>
</p>

<p align="center">
  <img width="200" src="./client/images/favicon/favicon.png" alt="WatchVideoByLink"/>
</p> 

<hr/>

## Overview

WatchVideoByLink takes a public video URL and display it in a video player which has features that make the watching experience an enjoyable process with the ability to Download and Organize MP4/WebM/HLS/MPEG-DASH video types.

## Table of Contents
* [What is WatchVideoByLink](#what-is-watchvideobylink)
* [Features](#features) 
* [Installation](#installation)  
  * [Docker](#docker) 
  * [Requirements to run WatchVideoByLink](#requirements-to-run-watchvideobylink) 
  * [Requirements to unlock additional features](#requirements-to-unlock-additional-features) 
  * [Clone Repository](#clone-repository) 
  * [Install Dependencies](#install-dependencies) 
  * [Build necessary tasks](#build-necessary-tasks) 
  * [Start Server](#start-server) 
* [Contributing](#contributing)  
* [License](#license)

## What is WatchVideoByLink

WatchVideoByLink takes a public video URL link and display the video in a custom video player depending on the video type, WatchVideoByLink currently supports video/mp4 (MP4), video/webm (WebM), application/x-mpegURL (HLS) or application/dash+xml (MPEG-DASH) URL Links, Automatic video type is also available but works a little bit differently as the system will try to get a video type and video link from the provided URL link.

Inside each video player there are diffrent features which makes the watching experience an enjoyable process but what video/mp4 (MP4), video/webm (WebM) and application/x-mpegURL (HLS) have in common is the ability to download/record the provided video for as long of a video duration that the user wants provided by how long the original video is.

After the downloaded/recorded video finishes downloading 
- Thumbnail creation gets taken into action: 8 snapshots of the video gets taken
- (optional) VP9 video compression gets taken into action: video/mp4 -> video/webm

and once everything is done the video will be found available in /saved/videos with features to make it easy to identify which video is which (sorted from newest to oldest).

## Features 
- Shareable link gets provided in the address bar when video is viewable.
- When a video finished recording/completes its downloaded 
  - H.264 video/mp4 becomes playable at /video/:id 
- (optional) When a video completes a VP9 compression
  - VP9 video/webm becomes playable at /compressed/:id 
- Using /?t=videoType?v=videoSrc can be used to play specified videoSrc if the videoType is supported
- View current videos/video compressions/thumbnails downloads from homepage or /saved/videos
  - If video download is unfinished 
    - Option to Restore damaged video using untrunc and some luck.
    - Option to Generate thumbnails
    - Option to Generate video compression
    - Option to Generate thumbnails & video compression
- Upload a video to the system
  - Max 1GB per video file
- Video players
  - Video Type: WebM/MP4 Supports:
    - .mp4 / .webm files
    - playbackRates
    - seek-buttons
    - (optional) chromecast
    - download full video or by specified start and end times
  - Video Type: HLS Supports:
    - .m3u8 files
    - record stream
  - Video Type: MPEG-DASH Supports:
    - .mpd files
  - Video Type: Automatic:
    - Takes a URL link and tries to find the videoSrc and videoType if successful it will be shown in the correct video player
    - using /?auto=URL will also activate the search
- /saved/videos 
  - Video
    - Displayed by Video Thumbnail, Video Title
      - When a video thumbnail gets hovered over a series of images from the video will be displayed to show what the video is about
      - When a video thumbnail gets clicked it will redirect the user to the specified video
  - Folder
    - Create Folder
      - Choose Title
    - Displayed by Folder Icon, selected Folder title
      - When a folder gets clicked it will display folder content
  - Menu: Video/Folder
    - Get sharable link button (only for video)
      - If clicked the video URL link will be copied for ease of shareability
    - Edit button
      - If clicked Edit mode will be shown with such features as 
        - Change video title
        - Deletes video or folder content when clicked plus all its data permanently from the system
    - Change video title
  - Drag Drop Folder/Video
    - When a video/folder gets dragged over target Folder
      - Table layout
        - Top: The video/folder will be placed before the video
        - Middle: The video/folder will be placed inside the folder
        - Buttom: The video/folder will be placed after the video
      - Grid layout
        - Left: The video/folder will be placed before the folder
        - Middle: The video/folder will be placed inside the folder
        - Right: The video/folder will be placed after the folder
    - When a video/folder gets dragged over target video
      - Table layout
        - Top: The video/folder will be placed before the video
        - Buttom: The video/folder will be placed after the video
      - Grid layout
        - Left: The video/folder will be placed before the video
        - Right: The video/folder will be placed after the video
    - When a video/folder gets dragged over target folder path
      - The folder/video gets placed inside the specified folder path
  - Folder Path 
    - Displays current folder path
      - If a folder name is clicked the folder content will load and folder path gets update 
  - Search
    - Searches for available video/folders by their title (local to selected folder)
  
## Installation
 
### Docker
You can use the included Dockerfile to build and execute the package as a container.

	docker build -t watchvideobylink .
	docker run -p 8080:8080 watchvideobylink

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
  - **Warning using Untrunc may not achieve desired results**

**For windows: If youtube-dl/Video Type: Automatic dosent work**
  - It may be due to missing MSVCR100.dll File.
    - This can be solved by installing the [Microsoft Visual C++ 2010 Redistributable Package (x86)/(x64)](https://www.microsoft.com/en-us/download/details.aspx?id=26999) from Microsoft Website.

### Clone Repository
You can clone the repository to a local destination using git:
```
git clone https://github.com/MohamedBakoush/WatchVideoByLink.git
cd WatchVideoByLink
```

Alternatively you may download and unpack the [zip](https://github.com/MohamedBakoush/WatchVideoByLink/archive/master.zip)

### Install Dependencies

```
npm install
```

### Build necessary tasks

```
npm run build
```

### Start Server

```
npm start
```

Then open `http://localhost:8080` in your preferred browser.

## Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

If you have a suggestion that would make WatchVideoByLink better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b new-feature`)
3. Commit your Changes (`git commit -m "a short description of the change"`)
4. Push to the Branch (`git push origin new-feature`)
5. Open a Pull Request
    
[Github - Contributing to projects article](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) 

<hr/>

<p id="user-content-license" align="center">
  <a href="https://github.com/MohamedBakoush/WatchVideoByLink/blob/master/LICENSE"><img src="https://img.shields.io/badge/LICENSE-APACHE--2.0-green?style=for-the-badge" /></a>
</p>
