var mob = require("./mob.js")
const { directions } = require("./room");

class Player extends mob.Mob {
    constructor(connection, name)
    {
        super (name, 50, 1);

        this.connection = connection
        this.name = name;
        this.room = null;
        this.max_health = 50;
        this.health = this.max_health;
        this.level = 1;
        this.max_damage = 12;
        this.xp = 0;
        this.portrait_css = 'portrait-human-male-1'
        
    }

    handle_command_target = (t_name) => {
        
        if (this.room != null) {
            this.room.inhabitants.forEach(mob => {
                if (mob.name == t_name) {
                    if (this.target) {
                        this.target.watchers.splice(this.target.watchers.indexOf(this),1);
                    }
                    this.target = mob;
                    this.target.watchers.push(this);
                }
              });
        }
        this.connection.send(this.get_data());
    };
    handle_command_attack = () => {
        if (this.target) {
            this.attacking = true;
            
        } else {
            this.connection.echo(`You aren't targeting anybody.`);
        }
        
    }
    handle_command_ouch = () => {
        let damage = Math.round(Math.random() * 10);
        this.connection.echo(`You hit yourself for ${damage} damage!`);
        this.take_damage(damage);
    }
    handle_command_heal = () => {
        let heal = Math.round(Math.random() * 10);
        this.connection.echo(`You heal yourself for ${heal} health!`);
        this.take_damage(heal*-1);
    }
    handle_command_say = (message) => {
        const msg = `${this.name} says, '${message}'`
        if (this.room != null) {
            this.room.inhabitants.forEach(player => {
                if (player.connection) {
                    player.connection.echo(msg);
                }
              });
        }
    };

    handle_command_shout = (message) => {
        const msg = `${this.name} shouts, '${message}'`
        this.connection.server.connections.forEach(con => {
           con.echo(msg);
            });
    };
    handle_command_north = () => {
        let moved = false;
        if (this.room != null) {
            this.room.exits.forEach(exit => {
                if (exit.direction == directions.NORTH) {
                    this.connection.echo("You go North.");
                    moved = true;
                    this.move (exit.destination);
                }
              });
        }
        if (!moved) this.connection.echo("You can't go that way.");
    };
    handle_command_south = () => {
        let moved = false;
        if (this.room != null) {
            this.room.exits.forEach(exit => {
                if (exit.direction == directions.SOUTH) {
                    this.connection.echo("You go South.");
                    moved = true;
                    this.move (exit.destination);
                }
              });
        }
        if (!moved) this.connection.echo("You can't go that way.");
    };
    handle_command_east = () => {
        let moved = false;
        if (this.room != null) {
            this.room.exits.forEach(exit => {
                if (exit.direction == directions.EAST) {
                    this.connection.echo("You go East.");
                    moved = true;
                    this.move (exit.destination);
                }
              });
        }
        if (!moved) this.connection.echo("You can't go that way.");
    };
    handle_command_west = () => {
        let moved = false;
        if (this.room != null) {
            this.room.exits.forEach(exit => {
                if (exit.direction == directions.WEST) {
                    this.connection.echo("You go West.");
                    moved = true;
                    this.move (exit.destination);
                }
              });
        }
        if (!moved) this.connection.echo("You can't go that way.");
    };

}

module.exports = {Player};