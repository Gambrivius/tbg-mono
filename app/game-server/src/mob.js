const { directions } = require("./room");

class Mob {
    constructor(name, health, level)
    {
        this.name = name;
        this.room = null;
        this.max_health = health;
        this.health = this.max_health;
        this.level = level;
        this.watchers = [];
        this.target = null;
        this.attacking = false;
        this.connection = null;
        this.swing_time = 2000;
        this.max_damage = 5;
        this.dead = false;
        this.connection = null;
        this.portrait_css = 'portrait-monster-imp-1'
        this.gender = 'male'
        this._last_swing = null;

    }
    heartbeat = (time) => {
        if (this.target && this.attacking) {
            if (time > this._last_swing + this.swing_time) {
                this._last_swing = time;
                this.swing();
            }
        }
        if (this.attacking && !this.target) {
            this.attacking = false;
        }
    }
    move = (room) => {
        if (this.room) {
            this.room.onExit(this);
        }
        if (this.target) {
            this.target.setTarget (null);
            this.setTarget (null);
        }
        // todo: make sure room is defined and handle nulls
        this.room = room;
        this.room.onEnter(this);
        if (this.connection) this.connection.send_game_state();
        //this.connection.send(this.room.get_data());
        
    }
    take_damage = (damage) => {
        this.health = Math.min(Math.max(0, this.health - damage), this.max_health);
        if (this.health == 0) {
            this.die()
        } else {
            if (this.connection) this.connection.send_game_state();
            this.update_watchers()
        }
        
    }
    update_watchers = () => {
        this.watchers.forEach(player => {
            if (player.connection) {
                player.connection.send_game_state();
            }
          });
    }
    addWatcher = (m) => {
        this.watchers.push(m);
    }
    removeWatcher = (m) => {
        let n = this.watchers.indexOf(m);
        if (n>= 0) {
            this.watchers.splice(n,1);
        }
    }
    setTarget = (m) => {
        if (this.target) {
            this.target.removeWatcher(this);
        }
        this.target  = m;
        if (this.target) this.target.addWatcher(this);
    }
    swing = () => {
        if (this.target && this.attacking) {
            let damage = Math.round(Math.random() * this.max_damage);
            this.room.echo(this, this.target, 
                `You hit ${this.target.name} for ${damage} damage!`,
                `${this.name} hits you for ${damage} damage!`,
                `${this.name} hits ${this.target.name} for ${damage} damage!`
                )
            this.target.setTarget (this);
            this.target.attacking = true;
            this.target.take_damage(damage);
        } else {
            this.attacking = false;
            this.setTarget(null);
        }
    }
    die = () => {
        // TODO:  Dying removes heart beat, but player can still navigate rooms and try to attack.
        // Attacking will do nothing because the player's heartbeat is dead.
        this.dead = true;
        this.room.echo (this, null, "You died.", null, `${this.name} dies.`);
        let r = this.room;
        r.removeInhabitant(this);
        //this.room.inhabitants.splice(this.room.inhabitants.indexOf(this),1);
        this.watchers.forEach(player => {
            if (player.target == this) {
                player.setTarget(null);
                if (player.connection) {
                    player.connection.send_game_state();
                }
            }
          });
          r.inhabitants.forEach(player => {
            if (player.connection) {
                player.connection.send_game_state();
            }
          });
    }
    
    get_data = (recurse = 2) => {
        let data = {player_data: {
            name: this.name,
            health: this.health / this.max_health,
            mana: 1,
            level: this.level,
            attacking: this.attacking,
            portrait_css: this.portrait_css
        }}
        if (recurse > 0) {
            if (this.target) {
                data.player_data.target = this.target.get_data(recurse = recurse - 1);
            }
        }
        return data;
    }
}

module.exports = {Mob};