var PIXI = require('pixi.js');
var TriggerHandler = require('./triggerhandler');
var CameraAnimation = require('./animation/cameraanimation');

function Camera(container, sceneSize) {
  this.container = container;
  this.sceneSize = sceneSize;
  this.animations = {};

  this.createFadeMask();
  this.triggerHandler = new TriggerHandler(null, this);

  this.reset();
}

Camera.prototype.createFadeMask = function() {
  // Fading by changing container.alpha looks weird,
  // create a mask instead and fade it in.
  this.fadeMask = new PIXI.Graphics();
  this.container.addChild(this.fadeMask);
  this.fadeMask.beginFill(0x000000, 1);
  this.fadeMask.drawRect(0, 0, this.sceneSize.width, this.sceneSize.height);
  this.fadeMask.position.x = 0;
  this.fadeMask.position.y = 0;
};


Camera.prototype.resetFadeMask = function() {
  this.container.addChild(this.fadeMask);
  this.container.setChildIndex(this.fadeMask, this.container.children.length - 1);
};


Camera.prototype.handleSceneChange = function(cameraData) {
  this.reset();

  cameraData = cameraData || {};

  if(cameraData.position) {
    this.container.position.x = -cameraData.position.x;
    this.container.position.y = -cameraData.position.y;
  }
  if(cameraData.zoom) {
    this.zoomTo(cameraData.zoom);
  }

  this.fadeMask.alpha = cameraData.fade || 0;

  this.triggerHandler.loadTriggers(cameraData.triggers);
  this.loadAnimations(cameraData.animations);
};

Camera.prototype.loadAnimations = function(animations) {
  this.animations = {};

  if(!animations) {
    return;
  }

  for(var animationName in animations) {
    var animation = animations[animationName];
    this.animations[animationName] = new CameraAnimation(this, animation.frames, animation.options);
  }
};

Camera.prototype.reset = function() {
  this.container.position.x = 0;
  this.container.position.y = 0;

  this.currentZoom = 0;
  this.container.scale.x = 1;
  this.container.scale.y = 1;

  this.container.rotation = 0;
  this.resetFadeMask();
};

Camera.prototype.performTriggerAction = function(action, data) {
  if(action === 'startAnimation') {
    this.animations[data.name].start(data.options);
  }
};

Camera.prototype.handleTrigger = function(triggerName) {
  // Reset fademask after every scene load to get it on top of
  // all other children
  if(triggerName === 'onLoad') {
    this.resetFadeMask();
  }

  this.triggerHandler.handle(triggerName);
};

Camera.prototype.pan = function(movement) {
  this.container.position.x -= movement.x;
  this.container.position.y -= movement.y;
};

Camera.prototype.zoomTo = function(level) {
  var originalCenter = {
    x: (this.sceneSize.width * this.container.scale.x) / 2,
    y: (this.sceneSize.height * this.container.scale.y) / 2
  };

  this.currentZoom = level;
  var factor = Math.pow(2, this.currentZoom);

  this.container.scale.x = factor;
  this.container.scale.y = factor;

  var neededAdjustment = {
    x: ((this.sceneSize.width * this.container.scale.x) / 2) - originalCenter.x,
    y: ((this.sceneSize.height * this.container.scale.y) / 2) - originalCenter.y
  };

  // Zoom centers on top left corner by default so pan to
  // ensure that center screen stays centered
  this.pan(neededAdjustment);
};

Camera.prototype.zoom = function(amount) {
  this.zoomTo(this.currentZoom + amount);
};

Camera.prototype.fade = function(amount) {
  this.fadeMask.alpha += amount;
};

Camera.prototype.update = function(dt) {
  for(var animationName in this.animations) {
    if(this.animations[animationName].active) {
      this.animations[animationName].update(dt);
    } 
  }
};

module.exports = Camera;
