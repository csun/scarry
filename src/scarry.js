var yaml = require('js-yaml');
var Stage = require('./stage');
var spriteManager = require('./spritemanager');

var scarry = {};

scarry.init = function(options) {
  getStory(options.storyFile, function(story, err) {
    if(err) {
      alert(err);
      return;
    }

    var stageOptions = {
      realSize: options.size,
      sceneSize: story.sceneSize,
      fonts: story.fonts
    };
    scarry.stage = new Stage(story.scenes, stageOptions);

    document.body.appendChild(scarry.stage.renderer.view);
    
    spriteManager.load(story.sprites, function() {
      scarry.stage.loadScene(story.entryScene);
      requestAnimationFrame(scarry.animationFrame);
    });
  });
};

scarry.animationFrame = function(timestamp) {
  if(scarry.lastFrameTimestamp) {
    scarry.stage.animate(timestamp - scarry.lastFrameTimestamp);
    scarry.stage.render();
  }

  scarry.lastFrameTimestamp = timestamp;

  requestAnimationFrame(scarry.animationFrame);
};

function getStory(url, callback) {
  // Source: http://youmightnotneedjquery.com/
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = yaml.safeLoad(request.responseText);
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
}


module.exports = scarry;