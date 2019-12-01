const express = require('express')
const http = require('http')
const io = require('socket.io')(http)

const app = express()
const server = http.createServer(app)

server.listen(3000, () => {
  console.log('WebSockets running on http://localhost:3000/')
})

module.exports = io