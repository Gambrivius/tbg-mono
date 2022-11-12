const { ipcRenderer, contextBridge, remote} = require("electron");

contextBridge.exposeInMainWorld('api', {
    // Invoke Methods
    testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
    // Send Methods
    testSend: (msg) => ipcRenderer.send('test-send', msg),
    serverSend: (msg) => ipcRenderer.send('server-send', msg),
    serverAuthenticate: (data) => ipcRenderer.send('server-authenticate', data),
    notifyReady: () => ipcRenderer.send('react-ready'),
    requestConnectionState: () => ipcRenderer.send('request-connection-state'),
    requestGameState: () => ipcRenderer.send('request-game-state'),

    // Receive Methods
    onUpdateGameState: (callback) => ipcRenderer.on('update-game-state', (event, data) => { callback(data) }),
    onUpdateConnectionState: (callback) => ipcRenderer.on('update-connection-state', (event, state) => { callback(state) }),
    onUpdateMOTD: (callback) => ipcRenderer.on('update-motd', (event, state) => { callback(state) }),
  }
  );

