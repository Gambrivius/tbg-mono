const gState = {
  CONNECTED: 'connected',
  GET_USERNAME: 'get-username',
  GET_PASSWORD: 'get-password',
  LOGGED_IN: 'logged-in'
}

const directions = {
  NORTH: 'North',
  SOUTH: 'South',
  EAST: 'East',
  WEST: 'West'
}

function reverseDirection(direction) {
  switch (direction) {
    case directions.NORTH:
      return directions.SOUTH
    case directions.SOUTH:
      return directions.NORTH
    case directions.EAST:
      return directions.WEST
    case directions.WEST:
      return directions.EAST
  }
}
class Room {
  constructor(name, description, exits = []) {
    this.name = name
    this.description = description
    this.exits = exits
    this.inhabitants = []
  }
  add_exit = (direction, room) => {
    const to_dir = direction
    const from_dir = reverse_direction(direction)
    this.exits.push({ direction: to_dir, destination: room })
    room.exits.push({ direction: from_dir, destination: this })
  }
  get_data = () => {
    const data = {
      room_data: {
        name: this.name,
        description: this.description,
        exits: this.exits.map((exit) => {
          return exit.direction
        }),
        inhabitants: this.inhabitants.map((inhabitant) => {
          return inhabitant.name
        })
      }
    }
    return data
  }
  broadcast = (message) => {
    this.inhabitants.forEach((player) => {
      if (player.connection) {
        player.connection.echo(message)
      }
    })
  }
  echo = (actor, target, msg_actor, msg_target, msg_room) => {
    // sends a personalized message to the following people:
    //      actor:  person performing the act
    //      target: person being acted upon
    //      room:  everybody in the room who is not the actor or target
    if (actor.connection) actor.connection.echo(msg_actor)
    if (target && target.connection) target.connection.echo(msg_target)
    this.inhabitants.forEach((player) => {
      if (player != actor && player != target) {
        if (player.connection) {
          player.connection.echo(msg_room)
        }
      }
    })
  }
  onEnter = (person) => {
    const msg = `${person.name} enters.`
    this.inhabitants.push(person)
    this.inhabitants.forEach((player) => {
      if (player.connection) {
        if (player != person) player.connection.echo(msg)
        player.connection.send_game_state()
      }
    })
  }
  removeInhabitant = (person) => {
    let n = this.inhabitants.indexOf(person)
    if (n >= 0) {
      this.inhabitants.splice(this.inhabitants.indexOf(person), 1)
    }
  }
  onExit = (person) => {
    this.removeInhabitant(person)
    const msg = `${person.name} exits.`
    this.inhabitants.forEach((player) => {
      if (player.connection) {
        player.connection.echo(msg)
      }
    })
  }
}

module.exports = { Room, directions, reverse_direction }
