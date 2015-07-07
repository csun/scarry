var helpers = require('./helpers');
var PIXI = require('pixi.js');
var Stage = require('./stage');

var scarry = {};

scarry.init = function(options) {
  helpers.getJSON(options.storyFile, function(story, err) {
    if(err) {
      alert(err);
      return;
    }

    scarry.stage = new Stage(options.size, story.sceneSize);
    scarry.stage.scenes = story.scenes;
    scarry.stage.sceneSize = story.sceneSize;

    document.body.appendChild(scarry.stage.renderer.view);
    
    for(var asset in story.assets) {
      PIXI.loader.add(asset, story.assets[asset]);
    }

    PIXI.loader.once('complete', function() {
      scarry.stage.loadScene(story.entryScene);
      requestAnimationFrame(scarry.animationFrame);
    });

    PIXI.loader.load();
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


module.exports = scarry;