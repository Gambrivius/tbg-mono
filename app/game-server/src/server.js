const fs = require('fs')

class GameServer {
    constructor()
    {
        this.connections = [];
        this.living_things = [];   // a list of all objects with a heart beat
        this.heartbeat = setInterval(this.heartbeat, 100);
        this.motd = "Test"
        fs.readFile('motd.txt', (err, data) => {
            if (err) throw err;
          
            this.motd = data.toString();
        })
    }
    heartbeat = () => {
        const time = Date.now();
        this.living_things.forEach(o => {
            if (typeof o.heartbeat === 'function')
                if (o.dead) {
                    this.unregister_heartbeat(o);
                }
                else {
                    o.heartbeat(time);
                }
            });
    }
    register_heartbeat = (obj) => {
        this.living_things.push(obj);
        obj.server = this;        
    }
    unregister_heartbeat = (obj) => {
        this.living_things.splice(this.living_things.indexOf(obj),1);
    }
}

module.exports = {GameServer};