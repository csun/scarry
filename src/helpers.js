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

module.exports = helpers;