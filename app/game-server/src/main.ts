import Server from 'socket.io'
// import exit from 'process';

import connectMongo from './monogodb'
import User from '@mono/models/user'
import * as dotenv from 'dotenv'
import Express from 'express'
import asyncHandler from 'express-async-handler'
import http from 'http'
import https from 'https'
import * as fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import * as room from 'room'
import * as conn from 'connection'
import * as mob from 'mob'
import * as spawner from 'spawner'
import * as s from 'server'

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string
  }
}

dotenv.config()
const app = Express()
let server = null
if (process.env.USE_TLS?.toLowerCase() === 'true') {
  console.log('Starting in HTTPS mode')
  server = https.createServer(
    {
      cert: fs.readFileSync(process.env.CRT_FILE_PATH ?? ''),
      key: fs.readFileSync(process.env.KEY_FILE_PATH ?? '')
    },
    app
  )
} else {
  console.log('Starting in HTTP mode')
  server = http.createServer(app)
}

const io = new Server.Server(server)
const gameServer = new s.GameServer()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

/*
const passwordValidation = (pass: string): boolean => {
  // at least 7 characters
  if (pass.length < 7) return false
  // contains a number
  if (!/\d/.test(pass)) return false
  // contains a letter
  if (!/[A-Z]/.test(pass)) return false
  if (!/[a-z]/.test(pass)) return false
  return true
}
*/

const createAccessToken = (userid: string): string => {
  return jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET ?? '', {
    expiresIn: '1h'
  })
}
app.get('/api/motd', (req: Express.Request, res: Express.Response) => {
  res.send(gameServer.motd)
})
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

*/
app.post(
  '/api/login',
  asyncHandler(async (req: Express.Request, res: Express.Response) => {
    const { username, password } = req.body
    await connectMongo()
    try {
      const user = await User.findOne({
        username
      })
      if (user !== undefined) {
        const result = await bcrypt.compare(password, user.hash)
        if (result) {
          const token = createAccessToken(user.username)
          res.status(200).send({ accesstoken: token, username: user.username })
        } else throw new Error('Invalid credentials.')
      } else throw new Error('Invalid credentials.')
    } catch (err) {
      let message = 'Unknown Error'
      if (err instanceof Error) message = err.message
      res.send({ error: `${message}` })
    }
  })
)

// Build room structure
const tavern = new room.Room(
  'Goblin Breath Tavern',
  "The tavern wreaks of spoiled ale and sweaty ogres.  A goblin behind the bar eyes you up and down, perhaps to offer you a drink, or perhaps to chew your face off.  You're not sure.  There is a door leading outside to the West."
)
const ssRoad = new room.Room(
  'South Shire Road',
  'You are on a cobblestone road that leads North and South.  Oak barrels are stacked outside the building to the East; a dilapidated timber building with a sign that reads, "Goblin Breath Tavern". '
)
const square = new room.Room(
  'Town Square',
  'Village folk bustle about the busy town square.  Horse-drawn carriages precariously cross the intersection as pedestrians shout obscenities.  You notice a statue in the center of the intersection.'
)
const nsRoad = new room.Room(
  'North Shire Road',
  'A few blocks are missing from the cobblestone road here and there but the sight is impressive none-the-less.  The road continues North and South.'
)
const nGate = new room.Room(
  'North Gate',
  "You are at the town's Northern gate.  Unfortunately for you, nothing has been implemented past this point."
)
const sGate = new room.Room(
  'South Gate',
  "You are at the town's Southern gate.  The country road stretches out before you."
)
const eGate = new room.Room(
  'East Gate',
  "You are at the town's Eastern gate.  Unfortunately for you, nothing has been implemented past this point."
)
const wGate = new room.Room(
  'West Gate',
  "You are at the town's Western gate.  Unfortunately for you, nothing has been implemented past this point."
)
const evRoad = new room.Room(
  'East Village Road',
  'The sun shines brightly in your eyes as you gaze at the church steeples to the North.  The sound of a busy town square rumbles from the West.'
)
const wvRoad = new room.Room(
  'West Village Road',
  "A large pothole is filled with water from this morning's shower.  You can't help but to notice your reflection in it; you need to shave.  The road continues East and West."
)
const church = new room.Room(
  'Shire Church',
  'theres a preying mantis or something.  idk i dont go to church.'
)
const ctryRoad = new room.Room(
  'South Country Road',
  "The dirt road looks well-travelled.  A sign pointing North says, 'Welcome to Shire Village'."
)
// connnect rooms
tavern.add_exit(room.directions.WEST, ssRoad)
square.add_exit(room.directions.SOUTH, ssRoad)
square.add_exit(room.directions.NORTH, nsRoad)
square.add_exit(room.directions.EAST, evRoad)
square.add_exit(room.directions.WEST, wvRoad)
ssRoad.add_exit(room.directions.SOUTH, sGate)
nsRoad.add_exit(room.directions.NORTH, nGate)
evRoad.add_exit(room.directions.EAST, eGate)
wvRoad.add_exit(room.directions.WEST, wGate)
evRoad.add_exit(room.directions.NORTH, church)
sGate.add_exit(room.directions.SOUTH, ctryRoad)

// add mobs
const s1 = new spawner.Spawner(10000, tavern, () => {
  return new mob.Mob('Goblin Bartender', 30, 1)
})
const s2 = new spawner.Spawner(10000, tavern, () => {
  return new mob.Mob('Patron', 30, 1)
})
const s3 = new spawner.Spawner(10000, ctryRoad, () => {
  return new mob.Mob('Bandit', 70, 2)
})
gameServer.register_heartbeat(s1)
gameServer.register_heartbeat(s2)
gameServer.register_heartbeat(s3)

io.use(function (socket: any, next: any) {
  const token = socket.handshake.query.token
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? '')
    const decodedToken = decoded as jwt.JwtPayload

    console.log('token valid for user', decodedToken.userid)
    socket.connectedUser = decodedToken.userid
    console.log(decodedToken)
    socket.access_token = token
    next()
  } catch (err) {
    console.log(err)
    next(new Error('not valid token'))
    socket.disconnect()
  }
})

io.on('connection', function (socket: any) {
  const newConnection = new conn.Connection(socket, gameServer)
  newConnection.onLogin = (player: any) => {
    player.move(tavern)
    gameServer.register_heartbeat(player)
  }
  newConnection.login()
  gameServer.connections.push(newConnection)
})

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT ?? ''}`)
})
