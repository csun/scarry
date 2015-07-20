var helpers = require('./helpers');
var Stage = require('./stage');
var spriteManager = require('./spritemanager');

var scarry = {};

scarry.init = function(options) {
  helpers.getJSON(options.storyFile, function(story, err) {
    if(err) {
      alert(err);
      return;
    }

    scarry.stage = new Stage(options.size, story.sceneSize, story.scenes);

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


module.exports = scarry;