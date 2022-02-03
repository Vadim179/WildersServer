require('colors')
require('dotenv/config')
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
  socket.userData = { username: '', x: 0, y: 0, a: 0 }

  socket.on('get rooms', () => {
    socket.emit('rooms', Rooms)
  })

  socket.on('join room', ({ roomID, username }) => {
    socket.userData.username = username
    socket.join(roomID)
  })

  socket.on('update', ({ x, y, a }) => {
    socket.userData.x = x
    socket.userData.y = y
    socket.userData.a = a
  })
})

setInterval(() => {
  console.log(io)
}, 1000 / 1)

server.listen(8000, () => {
  console.log('LISTENING ON PORT: 8000'.green)
})
