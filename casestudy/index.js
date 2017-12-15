//https://raw.githubusercontent.com/molnarg/node-http2/master/example/server.js

var fs = require("fs")
var path = require("path")
var spdy = require("spdy")
var express = require("express")
var mime = require("mime-types")
var etag = require("etag")
var compression = require('compression')


var assetsArray = require("./assets")


const app = express()

//var indexContent = fs.readFileSync("public/index.html")
//var closeupContent = fs.readFileSync("public/closeup.html")

app.enable("etag")
app.set("etag", "strong")


app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		// don't compress responses with this request header
		return false
	}

	// fallback to standard filter function
	return compression.filter(req, res)
}

function sendAssetsArray(req, res) {
	var encodingHeader = req.headers["accept-encoding"]
	var useEncoding = encodingHeader.indexOf("gzip") !== -1

	assetsArray.assetsArray.forEach(asset => {
		((asset, useEncoding) => {
			try {
				var mimetype = mime.lookup(asset.path)
				var content = asset.originalContent
				var responseObject = {
					"ETag": asset.etag,
					"Cache-Control": "public, max-age=2628000",
					"Content-Type": mimetype,
				}
				
				if(useEncoding) {
					responseObject["content-encoding"] = asset.encoding
					content = asset.content
				}

				var stream = res.push(asset.path, {
					response: responseObject
				})
				stream.on("error", function(error) {
					console.log(error)
				})
				stream.end(content)
			}
			catch(e) {
				console.log(e)
			}
		})(asset, useEncoding)
	});
}

function trySendResponse(res, filepath) {
	try {
		res.sendFile(path.join(__dirname, filepath))
	}
	catch (e) {
		console.log(e)
	}
}

function trySendAssetsArray(req, res) {
	try {
		sendAssetsArray(req, res)
	}
	catch (e) {
		console.log(e)
	}
}

app.get("/", (req, res) => {
	trySendAssetsArray(req, res)
	trySendResponse(res, "dist/index.html")
})

app.get("/index.html", (req, res) => {
	trySendAssetsArray(req, res)
	trySendResponse(res, "dist/index.html")
})

app.get("/closeup.html", (req, res) => {
	trySendAssetsArray(req, res)
	trySendResponse(res, "dist/closeup.html")
})

app.get("/images.json", (req, res) => {
	res.setHeader("Cache-Control", "public, max-age=2628000")
	trySendResponse(res, "dist/images.json")
})

app.get("/thumbnails.json", (req, res) => {
	res.setHeader("Cache-Control", "public, max-age=2628000")
	trySendResponse(res, "dist/thumbnails.json")
})


app.get("/cookie_statement.html", (req, res) => {
	//sendAssetsArray(req, res)
	trySendResponse(res, "dist/cookie_statement.html")
})

app.use("/images", express.static("dist/images", {
	maxAge: "365d"
}))

app.use("/assets", express.static("dist/assets", {
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

var port = process.env.HTTP2_PORT || 8080
var server = spdy.createServer(options, app)

console.log("Starting server on port: " + port)
server.listen(port);