var fs = require('fs');
var keyPath = './ssl/webkey.pem';
var cerPath = './ssl/webcert.pem';
var hskey = fs.readFileSync(keyPath);
var hscer = fs.readFileSync(cerPath);

var options = {
	key : hskey,
	cert : hscer
}
var ssl = {};
ssl.options = options;
module.exports = ssl;
