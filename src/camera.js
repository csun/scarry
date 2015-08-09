var TriggerHandler = require('./triggerhandler');
var CameraAnimation = require('./animation/cameraanimation');

function Camera(container, sceneSize) {
  this.container = container;

  this.currentZoom = 0;

  this.sceneSize = sceneSize;

  this.animations = {};
  this.triggerHandler = new TriggerHandler(null, this);
}

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

  this.container.alpha = -cameraData.fade || 1;

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
  this.container.alpha = 1;

  this.container.position.x = 0;
  this.container.position.y = 0;

  this.currentZoom = 0;
  this.container.scale.x = 1;
  this.container.scale.y = 1;

  this.container.rotation = 0;
};

Camera.prototype.performTriggerAction = function(action, data) {
  if(action === 'startAnimation') {
    this.animations[data.name].start();
  }
};

Camera.prototype.handleTrigger = function(triggerName) {
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
  this.container.alpha -= amount;
};

Camera.prototype.update = function(dt) {
  for(var animationName in this.animations) {
    if(this.animations[animationName].active) {
      this.animations[animationName].update(dt);
    } 
  }
};

module.exports = Camera;