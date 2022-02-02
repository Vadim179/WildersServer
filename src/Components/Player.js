const validate = require('aproba')
const Position = require('./Position')

class Player {
  /**
   * @param {String} ID
   * @param {String} username
   */
  constructor(ID, username) {
    validate('SS', arguments)
    this.ID = ID
    this.username = username
    this.angle = 0
    this.position = new Position()
  }

  /**
   * @param {Position} position
   * @returns {Player}
   */
  setPosition(position) {
    validate('O', arguments)
    this.position = position
    return this
  }

  /**
   * @param {Number} angle
   * @returns {Player}
   */
  setAngle(angle) {
    validate('N', arguments)
    this.angle = angle
    return this
  }
}

module.exports = Player
