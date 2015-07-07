var Animation = require('./animation');
var helpers = require('./helpers');

function Actor(stage, options) {
  this.sprite = helpers.spriteFromImageName(options.image);
  this.sprite.position = options.position;
  this.stage = stage;

  this.triggers = {};
  this.animations = {};

  if(options.triggers) {
    this.createTriggers(options.triggers);
  }
  if(options.animations) {
    this.createAnimations(options.animations);
  }
}

Actor.prototype.createTriggers = function(triggers) {
  for(var triggerType in triggers) {
    var triggerData = triggers[triggerType];

    if(triggerData instanceof Array) {
      this.triggers[triggerType] = triggerData;
    }
    else {
      this.triggers[triggerType] = [triggerData];
    }
  }

  var actor = this;
  if('onClick' in this.triggers) {
    var onClick = function() {
      actor.activateTrigger('onClick');
    };

    this.sprite.interactive = true;
    this.sprite.on('mouseup', onClick);
    this.sprite.on('touchend', onClick);
  }
};

Actor.prototype.createAnimations = function(animations) {
  for(var animationName in animations) {
    this.animations[animationName] = new Animation(this.sprite, animations[animationName]);
  }
};

Actor.prototype.activateTrigger = function(triggerName) {
  if(triggerName in this.triggers) {
    for(var i = 0; i < this.triggers[triggerName].length; i++) {
      var trigger = this.triggers[triggerName][i];

      if(trigger.action === 'changeScene') {
        this.stage.loadScene(trigger.destination);
      }
      else if(trigger.action === 'startAnimation') {
        this.animations[trigger.animation].start();
      }
    }
  }
};

Actor.prototype.animate = function(dt) {
  for(var animationName in this.animations) {
    if(this.animations[animationName].active) {
      this.animations[animationName].continue(dt);
    } 
  }
};

module.exports = Actor;