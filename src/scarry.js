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
      controls: story.controls,
      fonts: story.fonts,
      containerElement: options.containerElement || document.body
    };
    scarry.stage = new Stage(story.scenes, stageOptions);

    stageOptions.containerElement.appendChild(scarry.stage.renderer.view);

    completionCallback = function () {
      scarry.stage.loadScene(story.entryScene);
      requestAnimationFrame(scarry.animationFrame);
    };

    spriteManager.load(
        story.sprites, options.loadingCallback, completionCallback);
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
      callback(null, 'There was an error reading the yaml.');
    }
  };

  request.onerror = function() {
    callback(null, 'There was an error connecting to the destination.');
  };

  request.send();
}


module.exports = scarry;
