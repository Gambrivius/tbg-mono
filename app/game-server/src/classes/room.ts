type Exits = {
  [key: string]: Room;
};

// control what data gets sent to the client about this object. allows information hiding
type RoomClientData = {
  name: string;
  description: string;
  exits: string[];
  inhabitants: string[];
};

interface IClientData<T> {
  getClientData: () => T;
}

export class Room implements IClientData<RoomClientData> {
  public id: string;
  public name: string;
  public description: string;
  private exits: Exits;

  constructor(id: string, name: string, description: string, exits: Exits) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.exits = exits;
  }

  public addExit(direction: string, room: Room) {
    this.exits[direction] = room;
  }

  public getExit(direction: string) {
    return this.exits[direction];
  }

  public getExits() {
    return this.exits;
  }

  public getClientData(): RoomClientData {
    return {
      name: this.name,
      description: this.description,
      exits: Object.keys(this.exits),
      inhabitants: []
    };
  }
}
