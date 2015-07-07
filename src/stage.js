var PIXI = require('pixi.js');
var Actor = require('./actor');
var helpers = require('./helpers');

// A Stage has real pixel dimensions (which control absolute
// positioning on screen) and scene dimensions, which are
// used to position assets relative to their actual sizes
function Stage(realSize) {
  this.renderer = PIXI.autoDetectRenderer(realSize.width, realSize.height);

  this.realSize = realSize;
  this.scenes = {};
  this.sceneSize = { width:0, height: 0 };
  this.actors = [];

  this.container = new PIXI.Container();
}

Stage.prototype.loadScene = function(sceneName) {
  this.container.removeChildren();
  this.actors = [];
  this.resetCamera();

  var scene = this.scenes[sceneName];
  this.setBackground(scene.background);

  for(var i = 0; scene.actors && i < scene.actors.length; i++) {
    this.createActor(scene.actors[i]);
  }
};

Stage.prototype.resetCamera = function() {
  this.container.position.x = 0;
  this.container.position.y = 0;

  this.container.scale.x = this.realSize.width / this.sceneSize.width;
  this.container.scale.y = this.realSize.height / this.sceneSize.height;

  this.container.rotation = 0;
};

Stage.prototype.setBackground = function(imageName) {
  var sprite = helpers.spriteFromImageName(imageName);

  this.container.addChild(sprite);
};

Stage.prototype.createActor = function(actorData) {
  var actor = new Actor(this, actorData);
  this.actors.push(actor);
  this.container.addChild(actor.sprite);
};

// We opt for a broadcast model vs pubsub for a variety of reasons:
// Cleanup is easier when we change scenes (frequently), assumed 
// low subscriber counts and frequency of message sends, and
// assumed high ratio of actors in a scene responding to any
// given event.
Stage.prototype.broadcastTrigger = function(event, data) {
  for(var i = 0; i < this.actors.length; i++) {
    this.actors[i].handleTrigger(event, data);
  }
};

Stage.prototype.animate = function(dt) {
  for(var i = 0; i < this.actors.length; i++) {
    this.actors[i].animate(dt);
  }
};

Stage.prototype.render = function() {
  this.renderer.render(this.container);
};


module.exports = Stage;