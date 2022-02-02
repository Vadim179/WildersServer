const fs = require('fs')
const path = require('path')

const KEY_PATH = path.resolve(__dirname, 'key.pem')
const CERT_PATH = path.resolve(__dirname, 'cert.pem')

const ServerConfig = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
}

const CorsConfig = require('./Cors.Config')
module.exports = { CorsConfig, ServerConfig }
