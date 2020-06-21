# WatchVideoByLink 
  
<p align="center">
  <img src="/client/images/logo.png">
</p>

WatchVideoByLink takes a public video/mp4, application/x-mpegURL or application/dash+xml URL Link and displays the video in a video player that has features which makes watching the provided video an enjoyable process.


## Reason For Creation 

When working with various types of video files for personal projects, the process of creating a new video element to test if a video files works keeps occurring, to speed up the process of testing the creation of this repository was created by allowing an individual to view .mp4, .m3u8 or .mpd files from a simple URL link.

## Features 
- Shareable Link Gets provided in URL when video is viewable.
- Video Type: MP4 Supports:
  - .mp4 files
  - playbackRates
  - seek-buttons
  - chromecast
- Video Type: HLS Supports:
  - .m3u8 files
- Video Type: MPEG-DASH Supports:
  - .mpd files
   
 
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

  [MIT](LICENSE)
