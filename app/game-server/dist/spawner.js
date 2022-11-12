const e = require("express");

class Spawner {
    constructor(time_delay, room, server, spawn_func)
    {
        this.spawn_func = spawn_func
        this.time_delay = time_delay;
        this.server = server;
        this.room = room;
        server.register_heartbeat(this);
        this.last_check = null;
        this.time_delay = time_delay;
        this.spawned_obj = null;
    }
    heartbeat = (time) => {
        if (this.spawned_obj && this.spawned_obj.dead) {
            this.spawned_obj = null;
        }
        if (time > this.last_check + this.time_delay) {
            this.last_check = time
            if (!this.spawned_obj || this.spawned_obj.dead) {
                this.spawned_obj = this.spawn_func();
                this.spawned_obj.move(this.room);
                this.server.register_heartbeat(this.spawned_obj);
            }
        } 
        
    }
}

module.exports = {Spawner};