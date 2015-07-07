var PIXI = require('pixi.js');

var helpers = {};

helpers.getJSON = function(url, callback) {
  // Source: http://youmightnotneedjquery.com/
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      callback(data);
    }
    else {
      callback(null, 'There was an error accessing the json.');
    }
  };

  request.onerror = function() {
    callback(null, 'There was an error connecting to the destination.');
  };

  request.send();
};

helpers.spriteFromImageName = function(imageName) {
  return new PIXI.Sprite(PIXI.loader.resources[imageName].texture);
};


module.exports = helpers;