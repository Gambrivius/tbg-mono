import IClientData from './ClientData';
import IInhabitant from './Inhabitant';

export enum Direction {
  Error = 'Error',
  North = 'North',
  South = 'South',
  East = 'East',
  West = 'West'
}

export function reverseDirection(dir: Direction | string): Direction {
  switch (dir) {
    case Direction.North:
      return Direction.South;
    case Direction.South:
      return Direction.North;
    case Direction.East:
      return Direction.West;
    case Direction.West:
      return Direction.East;
    default:
      return Direction.Error;
  }
}

type Exits = {
  [key: string]: Room;
};

type RoomClientData = {
  name: string;
  description: string;
  exits: string[];
  inhabitants: string[];
};

export class Room implements IClientData<RoomClientData> {
  public id: string;
  public name: string;
  public description: string;
  private exits: Exits;
  private inhabitants: IInhabitant[] = [];

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
      inhabitants: this.inhabitants.map((inhabitant) =>
        inhabitant.visibleName()
      )
    };
  }
}
