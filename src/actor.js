var MovementAnimation = require('./animation/movementanimation');
var spriteManager = require('./spritemanager');
var TriggerHandler = require('./triggerhandler');

function Actor(stage, options) {
  this.sprite = spriteManager.createSprite(options.sprite);
  this.sprite.position = options.position;
  this.stage = stage;

  this.triggerHandler = new TriggerHandler(options.triggers, this);
  this._setupInteractiveTriggers();

  this.animations = {};
  if(options.animations) {
    this.createAnimations(options.animations);
  }
}

Actor.prototype._setupInteractiveTriggers = function() {
  var actor = this;
  var onClick = function() {
    actor.handleTrigger('onClick');
  };

  this.sprite.interactive = true;
  this.sprite.on('mouseup', onClick);
  this.sprite.on('touchend', onClick);
};

Actor.prototype.handleTrigger = function(triggerName) {
  this.triggerHandler.handle(triggerName);
};

Actor.prototype.performTriggerAction = function(action, data) {
  if(action === 'changeScene') {
    this.stage.loadScene(data.destination);
  }
  else if(action === 'startAnimation') {
    this.animations[data.animation].start();
  }
  else if(action === 'startSpriteAnimation') {
    this.sprite.startAnimation(data.name);
  }
  else if(action === 'broadcastTrigger') {
    this.stage.broadcastTrigger(data.name, data.data);
  }
};

Actor.prototype.createAnimations = function(animations) {
  for(var animationName in animations) {
    var animation = animations[animationName];
    this.animations[animationName] = new MovementAnimation(this.sprite, animation.frames, animation.options);
  }
};

Actor.prototype.animate = function(dt) {
  for(var animationName in this.animations) {
    if(this.animations[animationName].active) {
      this.animations[animationName].update(dt);
    } 
  }

  this.sprite.update(dt);
};

module.exports = Actor;