var sjcl = require('./sjcl');
var fs = require('fs');
var prompt = require('prompt');
var colors = require('colors/safe');
var base64url = require('base64-url');

sjcl.json.defaults.ks = 256;

var config = {
  outputSuffix: '.encrypted',
  outputExtension: '.json',
}

prompt.message = '';
prompt.delimiter = ' >>';
prompt.start();

var schema = {
  properties: {
    filepath: {
      description: colors.cyan('Input file path'),
    },
    password: {
      hidden: true,
      description: colors.red('Password'),
    },
  },
};

prompt.get(schema, function (err, result) {
  if (err) { return console.error(err) }
  loadFile(result.password, result.filepath);
}); 


function loadFile(password, filepath) {
  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) { return console.error(err) }
    var cipherData = JSON.parse(encryptText(password, data));
    cipherData.salt = base64url.escape(cipherData.salt)
    save(filepath + config.outputSuffix + config.outputExtension, JSON.stringify(cipherData));
  });
}

function encryptText (password, text) {
  var cipherData = sjcl.encrypt(password, text)
  return cipherData;
}

function save (filepath, text) {
  fs.writeFile(filepath, text, function (err) {
    if (err) throw err;
    console.log('Saved to ' + filepath)
  })
}
