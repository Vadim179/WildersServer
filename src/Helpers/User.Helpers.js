function handleUserDisconnect(socket) {
  const roomID = socket.data.roomID
  socket.to(roomID).emit('player left', { ID: socket.id })
}

module.exports = {
  handleUserDisconnect,
}
