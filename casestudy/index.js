//https://raw.githubusercontent.com/molnarg/node-http2/master/example/server.js

var fs = require('fs');
var path = require('path');
var spdy = require("spdy")
var express = require('express')

const app = express()
app.use(express.static("public"))

// Creating the server in plain or TLS mode (TLS mode is the default)
var certInfo = {
	key: fs.readFileSync('client-key.pem'),
	cert: fs.readFileSync('client-cert.pem')
}

var options = {
	key: certInfo.key,
	cert: certInfo.cert,
	spdy: {
		protocols: ["h2", "spdy/3.1", "http/1.1"],
		plain: (process.env.HTTP2_PLAIN)
	}
}

var server = spdy.createServer(options, app)
server.listen(process.env.HTTP2_PORT || 8080);