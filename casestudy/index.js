//https://raw.githubusercontent.com/molnarg/node-http2/master/example/server.js

var fs = require("fs")
var path = require("path")
var spdy = require("spdy")
var express = require("express")
var mime = require("mime-types")
var etag = require("etag")

var assetsArray = require("./assets")

const app = express()

//var indexContent = fs.readFileSync("public/index.html")
//var closeupContent = fs.readFileSync("public/closeup.html")

app.enable("etag")
app.set("etag", "strong")

function sendAssetsArray(req, res) {
	assetsArray.assetsArray.forEach(asset => {
		((path, content) => {
			var mimetype = mime.lookup(path)

			res.push(path, {
				response: {
					"ETag": etag(content),
					"Cache-Control": "public, max-age=2628000",
					"content-type": mimetype
				}
			}, (err, stream) => {
				if (err)
					return

				stream.end(content)
			})
		})(asset.path, asset.content)
	});
}

app.get("/", (req, res) => {
	sendAssetsArray(req, res)
	res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/index.html", (req, res) => {
	sendAssetsArray(req, res)
	res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/closeup.html", (req, res) => {
	sendAssetsArray(req, res)
	res.sendFile(path.join(__dirname, "public/closeup.html"))
})

app.get("/images.json", (req, res) => {
	res.setHeader("Cache-Control", "public, max-age=2628000")
	res.sendFile(path.join(__dirname, "public/images.json"))
})

app.get("/thumbnails.json", (req, res) => {
	res.setHeader("Cache-Control", "public, max-age=2628000")
	res.sendFile(path.join(__dirname, "public/thumbnails.json"))
})


app.get("/cookie_statement.html", (req, res) => {
	//sendAssetsArray(req, res)
	res.sendFile(path.join(__dirname, "public/cookie_statement.html"))
})

app.use("/images", express.static("public/images", {
	maxAge: "365d"
}))

app.use("/assets", express.static("public/assets", {
	maxAge: "30d"
}))

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