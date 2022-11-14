export enum ESocketChannel {
  ServerSend = "server-send",
  RequestConnectionState = "request-connection-state",
  RequestGameState = "request-game-state",
  Disconnect = "disconnect",
  UpdateConnectionState = "update-connection-state",
  UpdateGameState = "update-game-state",
  Console = "console",
}

export enum EConnectionState {
  Connected = "connected",
  LoggedIn = "logged-in",
}
