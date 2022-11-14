import { ESocketChannel, EConnectionState } from '@mono/models/connection';
import Server from 'socket.io';
import { GameServer } from './gameServer';

class Connection {
  connState: EConnectionState;
  socket: Server.Socket;
  name: string;
  server: GameServer;

  constructor(socket: Server.Socket, server: GameServer) {
    this.connState = EConnectionState.Connected;
    this.socket = socket;
    this.server = server;
    this.name = 'new user';
    this.socket.on(ESocketChannel.ServerSend, this.onReceiveData);
    this.socket.on(
      ESocketChannel.RequestConnectionState,
      this.onRequestConnectionState
    );
    this.socket.on(ESocketChannel.RequestGameState, this.onRequestGameState);
    this.socket.on(ESocketChannel.Disconnect, this.onDisconnect);
    //this.player = null;
    this.onLogin = null;
    this.send_conn_state();
  }
  login = () => {
    this.name = this.socket.connectedUser;
    this.echo(`Welcome aboard matey!`);
    //this.player = new player.Player(this, this.name);
    if (this.onLogin != null) this.onLogin(this.player);
    this.connState = EConnectionState.LoggedIn;
    this.send_conn_state();
  };
  send_conn_state = () => {
    this.socket.emit(ESocketChannel.UpdateConnectionState, this.connState);
  };
  send_game_state = () => {
    console.log('sending game state');
    if (this.player != null) {
      console.log('player');
      /*
      if (this.player.room != null) {
        console.log('room');
        let room_data = this.player.room.get_data();
        let player_data = this.player.get_data();
        let data = Object.assign({}, room_data, player_data);
        console.log(data);
        this.socket.emit('update-game-state', data);
      }
      */
    }
  };
  send = (data) => {
    this.socket.emit(ESocketChannel.UpdateGameState, data);
  };
  echo = (
    message: string,
    channel: ESocketChannel = ESocketChannel.Console
  ) => {
    if (channel == ESocketChannel.Console) this.send({ console: message });
  };
  onReceiveData = (data) => {
    if (this.connState == EConnectionState.LoggedIn) {
      this.handle_input(data);
    }
  };

  onDisconnect = () => {
    console.log(`${this.name} has been disconnected`);
    if (this.player && this.player.room) {
      this.player.room.broadcast(`${this.name} disappears in a poof of smoke.`);
      this.player.room.removeInhabitant(this.player);
      this.server.unregister_heartbeat(this.player);
    }
  };
  onRequestConnectionState = (data) => {
    this.send_conn_state();
  };
  onRequestGameState = (data) => {
    this.send_game_state();
  };
  handle_input = (input) => {
    const delim = input.indexOf(' ');
    let command = '';
    let arg = '';
    if (delim != -1) {
      command = input.substring(0, delim).toLowerCase();
      arg = input.substring(delim + 1);
    } else {
      command = input.toLowerCase();
    }
    switch (command) {
      case 'say':
        this.player.handle_command_say(arg);
        break;
      case 'target':
        this.player.handle_command_target(arg);
        break;
      case 'shout':
        this.player.handle_command_shout(arg);
        break;
      case 'north':
        this.player.handle_command_north();
        break;
      case 'kill':
        this.player.handle_command_attack();
        break;
      case 'south':
        this.player.handle_command_south();
        break;
      case 'east':
        this.player.handle_command_east();
        break;
      case 'west':
        this.player.handle_command_west();
        break;
      case 'ouch':
        this.player.handle_command_ouch();
        break;
      case 'heal':
        this.player.handle_command_heal();
        break;
      default:
        this.echo('Huh?');
    }
  };
}
module.exports = { Connection };
