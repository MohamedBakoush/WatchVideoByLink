<p align="center">
  <big><strong>WatchVideoByLink</strong></big>
</p>
<hr/>

<p align="center">
  <img src="./media/demo.gif" alt="WatchVideoByLink"/>
</p> 

WatchVideoByLink takes a public video URL and display it in a video player which has features that make the watching experience an enjoyable process with the ability to Download and Organize MP4/WebM/HLS/MPEG-DASH video types

## Table of Contents
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
