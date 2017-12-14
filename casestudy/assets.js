var fs = require('fs')

var prefix = "dist/"
var assetsPrefix = "assets/"
var cssPrefix = assetsPrefix + "css/"
var fontsPrefix = assetsPrefix + "fonts/"
var jsPrefix = assetsPrefix + "js/"
var htmlPrefix = ""
var assetsArray = []

// CSS
// addAsset(assetsArray, prefix, cssPrefix + "font-awesome.css")
// addAsset(assetsArray, prefix, cssPrefix + "main_v1.css")
// addAsset(assetsArray, prefix, cssPrefix + "sketchFont.css")
addAsset(assetsArray, prefix, cssPrefix + "style.min.css")

// FONTS
addAsset(assetsArray, prefix, fontsPrefix + "fontawesome-webfont.eot")
addAsset(assetsArray, prefix, fontsPrefix + "fontawesome-webfont.svg")
addAsset(assetsArray, prefix, fontsPrefix + "fontawesome-webfont.ttf")
addAsset(assetsArray, prefix, fontsPrefix + "fontawesome-webfont.woff")
addAsset(assetsArray, prefix, fontsPrefix + "fontawesome-webfont.woff2")

// addAsset(assetsArray, prefix, jsPrefix + "jquery.poptrox.js")
// addAsset(assetsArray, prefix, jsPrefix + "jquery.scrollex.js")
// addAsset(assetsArray, prefix, jsPrefix + "jquery.scrolly.min.js")
// addAsset(assetsArray, prefix, jsPrefix + "skel.js")
// addAsset(assetsArray, prefix, jsPrefix + "util.js")
// addAsset(assetsArray, prefix, jsPrefix + "main_v1.js")
addAsset(assetsArray, prefix, jsPrefix + "vendor.min.js")
addAsset(assetsArray, prefix, jsPrefix + "main.min.js")
addAsset(assetsArray, prefix, jsPrefix + "kaboodle.js")

// HTML
addAsset(assetsArray, prefix, htmlPrefix + "cookie_statement.html")

// JSON
addAsset(assetsArray, prefix, "images.json")
addAsset(assetsArray, prefix, "thumbnails.json")

// IMAGES
//addAsset(assetsArray, prefix, "images/portfolio/01.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/02.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/03.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/04.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/07.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/08.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/09.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/10.jpg")
//addAsset(assetsArray, prefix, "images/portfolio/11.jpg")

function addAsset(array, prefix, path) {
	var newAsset = {
		path: "/" + path,
		content: fs.readFileSync(prefix + path)
	}

	array.push(newAsset)
	return array
}

module.exports = {
	assetsArray: assetsArray
}