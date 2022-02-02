const fs = require('fs')
const CorsConfig = require('./Cors.Config')

const ServerConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}

module.exports = {
  CorsConfig,
  ServerConfig,
}
