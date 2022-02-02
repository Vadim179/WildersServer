const validate = require('aproba')
const Player = require('./Player')

class Room {
  /**
   * @param {String} ID
   * @param {String} name
   */
  constructor(ID, name) {
    validate('SS', arguments)
    this.ID = ID
    this.name = name
    this.PLAYERS = {}
  }

  /**
   * @param {String} ID
   * @param {Player} player
   * @returns {Room}
   */
  setPlayer(ID, player) {
    validate('SO', arguments)
    this.PLAYERS[ID] = player
    return this
  }
}

module.exports = Room
