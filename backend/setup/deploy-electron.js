const { app, BrowserWindow } = require("electron");
const server = require("../../server");
 
let mainWindow = null;

const createWindow = () => { 
    // create web browser
    mainWindow = new BrowserWindow({ 
        minWidth: 400,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
        },
    });
    // load URL for webview
    mainWindow.loadURL(server.url);
    // graceful exiting
    mainWindow.on("close", () => {
        mainWindow = null;
    });
};

// deploy createWindow when Electron has finished initializing
app.on("ready", createWindow);  