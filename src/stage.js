var PIXI = require('pixi.js');

var Actor = require('./actor');
var Camera = require('./camera');
var spriteManager = require('./spritemanager');

// A Stage has real pixel dimensions (which control absolute
// positioning on screen) and scene dimensions, which are
// used to position assets relative to their actual sizes
function Stage(realSize, sceneSize, scenes) {
  this.renderer = PIXI.autoDetectRenderer(realSize.width, realSize.height);

  this.baseContainer = new PIXI.Container();
  this.baseContainer.scale = { x: realSize.width / sceneSize.width, y: realSize.height / sceneSize.height };

  this.container = new PIXI.Container();
  this.baseContainer.addChild(this.container);

  this.camera = new Camera(this.container, sceneSize);

  this.scenes = scenes;
  this.actors = [];
}

Stage.prototype.loadScene = function(sceneName) {
  var scene = this.scenes[sceneName];

  this.camera.handleSceneChange(scene.camera);
  this.container.removeChildren();
  this.setBackground(scene.background);

  this.actors = [];
  for(var i = 0; scene.actors && i < scene.actors.length; i++) {
    this.createActor(scene.actors[i]);
  }

  this.broadcastTrigger('onLoad');
};

Stage.prototype.setBackground = function(imageName) {
  var sprite = spriteManager.createSprite(imageName);

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
Stage.prototype.broadcastTrigger = function(triggerName) {
  for(var i = 0; i < this.actors.length; i++) {
    this.actors[i].handleTrigger(triggerName);
  }

  this.camera.handleTrigger(triggerName);
};

Stage.prototype.animate = function(dt) {
  for(var i = 0; i < this.actors.length; i++) {
    this.actors[i].animate(dt);
  }
  
  this.camera.update(dt);
};

Stage.prototype.render = function() {
  this.renderer.render(this.baseContainer);
};


module.exports = Stage;