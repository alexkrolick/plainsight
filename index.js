var sjcl = window.sjcl;
var config = window.config; // encrypted data

var search = location.search.substring(1);
var urlParams = search === '' ? {} : JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

var key = urlParams.key;
var token = urlParams.token;
var salt = urlParams.salt; 

document.addEventListener("DOMContentLoaded", function() { 
  if (config.hasOwnProperty(key) && key && salt && token) {
    var msg = {
      key: key,
      token: token,
      data: config[key],
    };
    msg.data.salt = base64url_unescape(salt); // base64 salt should be escaped to avoid invalid url chars (/+=)
    msg.datastring = JSON.stringify(msg.data);
    window.setTimeout(setMessage.bind(this, 'Decrypting ...\n\n' + msg.data.ct), 100);
    decrypt(msg)
  } else {
    window.setTimeout(setMessage.bind(this, 'No File Found'), 100);
  }
});

function decrypt(msg) {
  try {
    var plaintext = sjcl.decrypt(msg.token, msg.datastring);
    window.setTimeout(setMessage.bind(this, plaintext), 1500);
  } catch(err) {
    console.error(err);
    if (err.message === 'ccm: tag doesn\'t match') {
      window.setTimeout(setMessage.bind(this, 'Incorrect Passphrase'), 1500);   
    } else {
      window.setTimeout(setMessage.bind(this, 'Unknown Error'), 1500);         
    }
  }
  window.setTimeout(setMessage.bind(this, 'Decrypting ...............\n\n' + msg.data.ct), 250);
  window.setTimeout(setMessage.bind(this, 'Decrypting .................................\n\n' + msg.data.ct), 500);
  window.setTimeout(setMessage.bind(this, 'Decrypting ................................................\n\n' + msg.data.ct), 750);
  window.setTimeout(setMessage.bind(this, 'Decrypting .....................................................................\n\n' + msg.data.ct), 1000);
}

function setMessage (msg) {
  document.querySelector('.app').innerHTML = msg;
}


// See base64-url NPM package

function base64url_unescape (str) {
  return (str + '==='.slice((str.length + 3) % 4))
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
}

function base64url_escape (str) {
  return str.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}