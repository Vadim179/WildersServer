require('colors')
require('dotenv/config')

const { UserHelpers } = require('./Helpers')
const { CorsConfig, Rooms } = require('./Config')

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors(CorsConfig))

app.get('/', (_, res) => {
  res.send('<h1>Hello there!</h1>')
})

const http = require('http')
const server = new http.Server(app)
const io = require('socket.io')(server, {
  cors: CorsConfig,
})

io.on('connection', socket => {
  socket.data = {
    username: '',
    roomID: '',
    rotation: 0,
    posX: 0,
    posY: 0,
    x: 0,
    y: 0,
  }

  socket.on('get rooms', () => {
    socket.emit('rooms', Rooms)
  })

  socket.on('join room', ({ roomID, username }) => {
    socket.data.roomID = roomID
    socket.data.username = username
    socket.join(roomID)
  })

  socket.on('update rotation', ({ rotation }) => {
    socket.data.rotation = rotation
  })

  socket.on('update position', ({ posX, posY }) => {
    socket.data.posX = posX
    socket.data.posY = posY
  })

  socket.on('update movement', ({ x, y }) => {
    socket.data.x = x
    socket.data.y = y
  })

  socket.on('leave room', () => {
    UserHelpers.handleUserDisconnect(socket)
  })

  socket.on('disconnect', () => {
    UserHelpers.handleUserDisconnect(socket)
  })
})

setInterval(() => {
  const namespace = io.of('/')

  Rooms.forEach(roomID => {
    const socketIDs = io.sockets.adapter.rooms.get(roomID)
    if (socketIDs === undefined) return

    const pack = {}
    socketIDs.forEach(socketID => {
      const socket = namespace.sockets.get(socketID)
      if (socket.data.username === '') return
      pack[socketID] = socket.data
    })

    io.in(roomID).emit('room update', pack)
  })
}, 1000 / 60)

server.listen(8080, () => {
  console.log('LISTENING ON PORT: 8080'.green)
})
