require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
var fs = require("fs");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

let conn = require("./connection.js");
let room = require("./room.js");
let mob = require("./mob.js");
let spawner = require("./spawner.js");
let s = require("./server.js");
//let data = require("./database.js");
import connectMongo from "./monogodb";
import User from "@mono/models/user";

console.log("TEST2");

let server = null;
if (process.env.USE_TLS?.toLowerCase() == "true") {
  console.log("Starting in HTTPS mode");
  server = https.createServer(
    {
      cert: fs.readFileSync(process.env.CRT_FILE_PATH),
      key: fs.readFileSync(process.env.KEY_FILE_PATH),
    },
    app
  );
} else {
  console.log("Starting in HTTP mode");
  server = http.createServer(app);
}
const { Server } = require("socket.io");
const { exit } = require("process");
const io = new Server(server);
let game_server = new s.GameServer();
//let game_data = new data.GameData();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const password_validation = (pass: any) => {
  // at least 7 characters
  if (pass.legnth < 7) return false;
  // contains a number
  if (!/\d/.test(pass)) return false;
  // contains a letter
  if (!/[A-Z]/.test(pass)) return false;
  if (!/[a-z]/.test(pass)) return false;
  return true;
};

const createAccessToken = (userid: any) => {
  return jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};
app.get("/api/motd", async (req: any, res: any) => {
  res.send(game_server.motd);
});
/*
app.post("/api/register", async (req: any, res: any) => {
  const { username, password } = req.body;
  if (!password_validation(password)) {
    res.send({ error: `weak password` });
    return;
  }
  const hashedPassword = await hash(password, 5);
  try {
    const sql = `SELECT * FROM user_accounts WHERE username='${username}'`;
    game_data.con.query(sql, (error: any, rows: any, fields: any) => {
      try {
        if (error) throw error;
        if (rows.length > 0) throw new Error("User already exists.");
        else {
          const sql_insert = `INSERT INTO user_accounts (username, password) VALUES ('${username}', '${hashedPassword}')`;
          game_data.con.query(
            sql_insert,
            (error: any, results: any, fields: any) => {
              if (error) {
                res.send({ error: `${error.message}` });
              } else {
                res.send("User created successfully");
              }
            }
          );
        }
      } catch (err) {
        let message = "Unknown Error";
        if (err instanceof Error) message = err.message;
        res.send({ error: `${message}` });
      }
    });
  } catch (err) {
    let message = "Unknown Error";
    if (err instanceof Error) message = err.message;
    res.send({ error: `${message}` });
  }
});
*/
/*
app.post("/api/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const sql = `SELECT * FROM user_accounts WHERE username='${username}'`;
    game_data.con.query(sql, (error: Error, rows: any, fields: any) => {
      try {
        if (error) throw error;
        if (rows.length <= 0) throw new Error("User does not exist");
        let user = rows[0];
        console.log(user);

        compare(password, user.password, (err: Error, match: any) => {
          try {
            if (match) {
              const token = createAccessToken(user.username);
              res
                .status(200)
                .send({ accesstoken: token, username: user.username });
            } else throw new Error("Invalid credentials.");
          } catch (err) {
            let message = "Unknown Error";
            if (err instanceof Error) message = err.message;
            res.status(401).send({ error: `${message}` });
          }
        });
      } catch (err) {
        let message = "Unknown Error";
        if (err instanceof Error) message = err.message;
        res.status(401).send({ error: `${message}` });
      }
    });
  } catch (err) {
    let message = "Unknown Error";
    if (err instanceof Error) message = err.message;
    res.send({ error: `${message}` });
  }
});
*/
app.post("/api/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  console.log(username, password);
  await connectMongo();
  try {
    let user = await User.findOne({
      username: username,
    });
    console.log(username);
    if (user) {
      console.log(user);
      const result = await compare(password, user.hash);
      if (result) {
        const token = createAccessToken(user.username);
        res.status(200).send({ accesstoken: token, username: user.username });
      } else throw new Error("Invalid credentials.");
    } else throw new Error("Invalid credentials.");
  } catch (err) {
    let message = "Unknown Error";
    if (err instanceof Error) message = err.message;
    res.send({ error: `${message}` });
  }
});

// Build room structure
let tavern = new room.Room(
  "Goblin Breath Tavern",
  "The tavern wreaks of spoiled ale and sweaty ogres.  A goblin behind the bar eyes you up and down, perhaps to offer you a drink, or perhaps to chew your face off.  You're not sure.  There is a door leading outside to the West."
);
let ss_road = new room.Room(
  "South Shire Road",
  'You are on a cobblestone road that leads North and South.  Oak barrels are stacked outside the building to the East; a dilapidated timber building with a sign that reads, "Goblin Breath Tavern". '
);
let square = new room.Room(
  "Town Square",
  "Village folk bustle about the busy town square.  Horse-drawn carriages precariously cross the intersection as pedestrians shout obscenities.  You notice a statue in the center of the intersection."
);
let ns_road = new room.Room(
  "North Shire Road",
  "A few blocks are missing from the cobblestone road here and there but the sight is impressive none-the-less.  The road continues North and South."
);
let n_gate = new room.Room(
  "North Gate",
  "You are at the town's Northern gate.  Unfortunately for you, nothing has been implemented past this point."
);
let s_gate = new room.Room(
  "South Gate",
  "You are at the town's Southern gate.  The country road stretches out before you."
);
let e_gate = new room.Room(
  "East Gate",
  "You are at the town's Eastern gate.  Unfortunately for you, nothing has been implemented past this point."
);
let w_gate = new room.Room(
  "West Gate",
  "You are at the town's Western gate.  Unfortunately for you, nothing has been implemented past this point."
);
let ev_road = new room.Room(
  "East Village Road",
  "The sun shines brightly in your eyes as you gaze at the church steeples to the North.  The sound of a busy town square rumbles from the West."
);
let wv_road = new room.Room(
  "West Village Road",
  "A large pothole is filled with water from this morning's shower.  You can't help but to notice your reflection in it; you need to shave.  The road continues East and West."
);
let church = new room.Room(
  "Shire Church",
  "theres a preying mantis or something.  idk i dont go to church."
);
let ctry_road = new room.Room(
  "South Country Road",
  "The dirt road looks well-travelled.  A sign pointing North says, 'Welcome to Shire Village'."
);
// connnect rooms
tavern.add_exit(room.directions.WEST, ss_road);
square.add_exit(room.directions.SOUTH, ss_road);
square.add_exit(room.directions.NORTH, ns_road);
square.add_exit(room.directions.EAST, ev_road);
square.add_exit(room.directions.WEST, wv_road);
ss_road.add_exit(room.directions.SOUTH, s_gate);
ns_road.add_exit(room.directions.NORTH, n_gate);
ev_road.add_exit(room.directions.EAST, e_gate);
wv_road.add_exit(room.directions.WEST, w_gate);
ev_road.add_exit(room.directions.NORTH, church);
s_gate.add_exit(room.directions.SOUTH, ctry_road);

// add mobs
new spawner.Spawner(10000, tavern, game_server, () => {
  return new mob.Mob("Goblin Bartender", 30, 1);
});
new spawner.Spawner(10000, tavern, game_server, () => {
  return new mob.Mob("Patron", 30, 1);
});
new spawner.Spawner(10000, ctry_road, game_server, () => {
  return new mob.Mob("Bandit", 70, 2);
});

io.use(function (socket: any, next: any) {
  let token = socket.handshake.query.token,
    decodedToken;
  console.log(socket);
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("token valid for user", decodedToken.userid);
    socket.connectedUser = decodedToken.userid;
    console.log(decodedToken);
    socket.access_token = token;
    next();
  } catch (err) {
    console.log(err);
    next(new Error("not valid token"));
    socket.disconnect();
  }
});

io.on("connection", function (socket: any) {
  const new_connection = new conn.Connection(socket, game_server);
  new_connection.onLogin = (player: any) => {
    player.move(tavern);
    game_server.register_heartbeat(player);
  };
  new_connection.login();
  game_server.connections.push(new_connection);
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
});
