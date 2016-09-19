var sjcl = require('./sjcl');
var fs = require('fs');
var prompt = require('prompt');
var colors = require('colors/safe');
var base64url = require('base64-url');

function loadFile(password, filename) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) { return console.error(err) }
    var cipherdata = JSON.parse(data)
    cipherdata.salt = base64url.unescape(cipherdata.salt)
    decryptText(password, JSON.stringify(cipherdata));
  });
}

function decryptText (password, text) {
  var plaintext = sjcl.decrypt(password, text)
  console.log(plaintext);
}

prompt.message = '';
prompt.delimiter = ' >>';
prompt.start();

var schema = {
  properties: {
    filename: {
      description: colors.cyan('Encrypted file path'),
    },
    password: {
      hidden: true,
      description: colors.red('Password'),
    },
  },
};

prompt.get(schema, function (err, result) {
  if (err) { return console.error(err) }
  loadFile(result.password, result.filename);
}); 