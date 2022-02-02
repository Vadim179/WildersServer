require('colors')
require('dotenv/config')

const https = require('https')
const { CorsConfig, ServerConfig } = require('./Config')

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors(CorsConfig))

app.get('/', (_, res) => {
  res.send('<h1>Hello there!</h1>')
})

const httpsServer = new https.Server(ServerConfig, app)
const io = require('socket.io')(httpsServer, {
  cors: CorsConfig,
})

const Room = require('./Components/Room')
const Player = require('./Components/Player')

const rooms = {
  'EU-1': new Room('EU-1', 'EU-1'),
  'EU-2': new Room('EU-2', 'EU-2'),
  'EU-3': new Room('EU-3', 'EU-3'),
}

io.on('connection', socket => {
  socket.on('getRooms', () => {
    // prettier-ignore
    const roomsArray = Object
      .values(rooms)
      .map(({ ID, name }) => ({ ID, name }))

    socket.emit('rooms', roomsArray)
  })

  socket.on('JoinRoom', ({ roomID, username }) => {
    socket.join(roomID)

    const room = rooms[roomID]
    socket.emit('GameData', { players: room.PLAYERS })

    const player = new Player(socket.id, username)
    room.setPlayer(socket.id, player)

    io.to(roomID).except(socket.id).emit('NewPlayer', {
      ID: socket.id,
      player,
    })
  })

  socket.on('Movement', ({ roomID, position }) => {
    rooms[roomID].PLAYERS[socket.id].setPosition(position)
    io.to(roomID).except(socket.id).emit('PlayerMovement', {
      ID: socket.id,
      position,
    })
  })

  socket.on('Rotation', ({ roomID, angle }) => {
    rooms[roomID].PLAYERS[socket.id].setAngle(angle)
    io.to(roomID).except(socket.id).emit('PlayerRotation', {
      ID: socket.id,
      angle,
    })
  })
})

httpsServer.listen(443)
