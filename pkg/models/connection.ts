export enum SocketChannel {
  ServerSend = "server-send",
  RequestConnectionState = "request-connection-state",
  RequestGameState = "request-game-state",
  Disconnect = "disconnect",
  UpdateConnectionState = "update-connection-state",
  UpdateGameState = "update-game-state",
  Console = "console",
}

export enum ConnectionState {
  Connected = "connected",
  LoggedIn = "logged-in",
}
