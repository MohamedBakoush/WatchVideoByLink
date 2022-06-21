import * as basic from "../scripts/basics.js";
import * as showAvailableVideos from "../scripts/show-available-videos.js";
import * as index from "../scripts/index.js";
import * as currentVideoDownloads from "../scripts/current-video-downloads.js";

// load header details into html using headerContainer id
export function loadNavigationBar(path) {
  const header = document.getElementById("headerContainer");
  const navBar = basic.createSection(header, "nav", "NavigationBar", "navBar");
  const nav = basic.createSection(navBar, "ul", undefined, "headerNav");
  const item = basic.createSection(nav, "li");
  let homeButton, savedVideosPage, currentDownloads;
  if (path == "/saved/videos") {
    document.title = "saved videos - WatchVideoByLink";
    document.body.classList = "saved-videos-body";
    basic.websiteContentContainer().classList = "saved-videos-websiteContentContainer";
    homeButton = basic.createLink(item, "/", undefined, "button category-link", "WatchVideoByLink");
    savedVideosPage = basic.createLink(item, "/saved/videos", undefined, "button savedVideosPageButton is-selected", "/saved/videos");
    currentDownloads = basic.createLink(item, "javascript:;", undefined, "button current-dowloads-nav fa fa-download");
    homeButton.onclick = (e) => {
      e.preventDefault(); 
      onClickHomeButton(homeButton, savedVideosPage);
    };
    savedVideosPage.onclick = (e) => {
      e.preventDefault(); 
      onClickSavedVideosPage(homeButton, savedVideosPage);
    };
    currentDownloads.onclick = (e) => {
      e.preventDefault(); 
      onClickCurrentDownloads();
    };
    return "redirect to /saved/videos";
  } else {
    document.title = "WatchVideoByLink";
    document.body.classList = "index-body";
    basic.websiteContentContainer().classList = "index-websiteContentContainer";
    homeButton = basic.createLink(item, "/", undefined, "button is-selected", "WatchVideoByLink");
    savedVideosPage = basic.createLink(item, "/saved/videos", undefined, "button savedVideosPageButton category-link", "/saved/videos");
    currentDownloads = basic.createLink(item, "javascript:;", undefined, "button current-dowloads-nav fa fa-download");
    homeButton.onclick = (e) => {
      e.preventDefault(); 
      onClickHomeButton(homeButton, savedVideosPage);
    };
    savedVideosPage.onclick = (e) => {
      e.preventDefault(); 
      onClickSavedVideosPage(homeButton, savedVideosPage);
    };
    currentDownloads.onclick = (e) => {
      e.preventDefault(); 
      onClickCurrentDownloads();
    };
    return "redirect to homepage";
  } 
}

export function onClickHomeButton(homeButton, savedVideosPage) { 
  if(document.getElementById("download-status-container"))  {
    document.getElementById("download-status-container").remove(); 
    currentVideoDownloads.stopAvailableVideoDownloadDetails();  
  }
  basic.websiteContentContainer().innerHTML = "";
  homeButton.classList = "button is-selected";
  savedVideosPage.classList = "button savedVideosPageButton category-link";
  if (document.location.pathname !== "/") {
    history.pushState(null, "", "/");
    document.title = "WatchVideoByLink";
  } 
  document.body.classList = "index-body";
  basic.websiteContentContainer().classList = "index-websiteContentContainer";
  index.showDetails();
  return "redirect to homepage";
}

export function onClickSavedVideosPage(homeButton, savedVideosPage) {
  if(document.getElementById("download-status-container"))  { 
    document.getElementById("download-status-container").remove(); 
    currentVideoDownloads.stopAvailableVideoDownloadDetails();  
  }
  basic.websiteContentContainer().innerHTML = "";
  homeButton.classList = "button category-link";
  savedVideosPage.classList = "button savedVideosPageButton is-selected"; 
  if (document.location.pathname === "/saved/videos") {
    if (document.location.search !== "") {
      history.pushState(null, "", "/saved/videos");
      document.title = "saved videos - WatchVideoByLink";
    } 
  } else {
    history.pushState(null, "", "/saved/videos");
    document.title = "saved videos - WatchVideoByLink";
  }
  document.body.classList = "saved-videos-body";
  basic.websiteContentContainer().classList = "saved-videos-websiteContentContainer";
  showAvailableVideos.pageLoaded();
  return "redirect to /saved/videos";
}

export function onClickCurrentDownloads() { 
  if (document.getElementById("download-status-container")){ 
      document.getElementById("download-status-container").remove();
      currentVideoDownloads.stopAvailableVideoDownloadDetails();  
      return "Remove current video downloads";
  } else {
    currentVideoDownloads.loadAvailableVideoDownloadDetails();
    return "Display current video downloads";
  } 
}