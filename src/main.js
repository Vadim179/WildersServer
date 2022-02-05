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
  socket.userData = {
    username: '',
    roomID: '',
    x: 0,
    y: 0,
    a: 0,
  }

  socket.on('get rooms', () => {
    socket.emit('rooms', Rooms)
  })

  socket.on('join room', ({ roomID, username }) => {
    socket.userData.roomID = roomID
    socket.userData.username = username
    socket.join(roomID)
  })

  socket.on('update', ({ x, y, a }) => {
    socket.userData.x = x
    socket.userData.y = y
    socket.userData.a = a
  })

  socket.on('user left', () => {
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
      if (socket.userData?.username === '') return
      pack[socketID] = { ...socket.userData }
    })

    io.in(roomID).emit('room update', pack)
  })
}, 1000 / 60)

server.listen(8000, () => {
  console.log('LISTENING ON PORT: 8000'.green)
})
