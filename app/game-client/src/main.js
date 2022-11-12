const { time } = require('console');
const jwt = require('jsonwebtoken');
const { app, BrowserWindow, ipcMain, Menu} = require('electron');
const path = require('path');
const { io } = require("socket.io-client");
const axios = require('axios');
const host = "https://laponsie.info:3070";
//const socket = io("http://54.152.202.137:3070", {autoConnect: false, reconnect: true})  // aws
let socket = null; 
let jwt_token = null;
//const socket = io("http://tbgserver.a2hosted.com", {autoConnect: false, reconnect: true})  /a2



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the react entry point
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

Menu.setApplicationMenu(false);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// custom event handlers
var react_app;

function update_game_state(data) {
  if (react_app != null) {
    data.timestamp = Date.now();
    data.guid = generateGUID();
    console.log ("Sending to client:")
    console.log (data)
    react_app.send('update-game-state',  data)
  }
}


ipcMain.on('react-ready', (event, data) => {
  if (!socket || !socket.connected){
    react_app = event.sender
    axios.get(`${host}/api/motd`, data)
    .then((res) => {
      react_app.send("update-motd", res.data);
      });
  }
})




ipcMain.on('server-send', (event, data) => {
  let echo = {};
  echo.timestamp = Date.now();
  echo.guid = generateGUID();
  echo.console = data;
  echo.style = "echo";
  // echo message back to client console.
  socket.emit ('server-send', data)
  react_app.send('update-game-state', echo)
})


ipcMain.on('request-connection-state', (event, data) => {
  react_app = event.sender;
  if (!socket || !socket.connected){
    react_app = event.sender;
    react_app.send('update-connection-state',  'disconnected');
  } else {
    socket.emit ('request-connection-state', data)
  }
})

ipcMain.on('request-game-state', (event, data) => {
  console.log("Requesting game state!");
  socket.emit ('request-game-state', data)
})

ipcMain.on('server-authenticate', (event, data) => {
		axios.post(`${host}/api/login`, data)
    .then((res) => {
		  console.log (`Received access token ${res.data.accesstoken} for user ${res.data.username}`);
      jwt_token = res.data.accesstoken
      socket = io(host, {query: {
        token: jwt_token}
      });
      socket.on("connect", () => {
        update_game_state({console: "Connected!"})
      });
      
      socket.on("disconnect", () => {
        react_app.send('update-connection-state',  'disconnected')
      });
      
      socket.on("update-game-state", (data) => {
        console.log ("Backend received from server:")
        console.log (data)
        update_game_state(data)
      });
      
      socket.on("update-motd", (data) => {
        console.log(data);
        react_app.send("update-motd", data);
      });
      
      socket.on("update-connection-state", (data) => {
        react_app.send('update-connection-state',  data);
      });
    })
    .catch(err => {
      // Handle error
      if (err.response) {
        if (err.response.status == 401) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          // TODO: emit something on ipcMain to update the UI to say "Invalid credentials"
        }
        
      } else if (err.request) {
        console.log(err);
      } else {
        console.log(err);
      }
  });
})

function generateGUID() { 
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}