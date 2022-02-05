function handleUserDisconnect(socket) {
  const roomID = socket.userData.roomID
  socket.to(roomID).emit('user left', { ID: socket.id })
}

module.exports = {
  handleUserDisconnect,
}
