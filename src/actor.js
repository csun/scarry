var MovementAnimation = require('./animation/movementanimation');
var spriteManager = require('./spritemanager');

function Actor(stage, options) {
  this.sprite = spriteManager.createSprite(options.sprite);
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
      actor.handleTrigger('onClick', null);
    };

    this.sprite.interactive = true;
    this.sprite.on('mouseup', onClick);
    this.sprite.on('touchend', onClick);
  }
};

Actor.prototype.createAnimations = function(animations) {
  for(var animationName in animations) {
    this.animations[animationName] = new MovementAnimation(this.sprite, animations[animationName].frames);
  }
};

Actor.prototype.handleTrigger = function(triggerName, data) {
  if(triggerName in this.triggers) {
    for(var i = 0; i < this.triggers[triggerName].length; i++) {
      var trigger = this.triggers[triggerName][i];

      if(trigger.action === 'changeScene') {
        this.stage.loadScene(trigger.data.destination);
      }
      else if(trigger.action === 'startAnimation') {
        this.animations[trigger.data.animation].start();
      }
      else if(trigger.action === 'startSpriteAnimation') {
        this.sprite.startAnimation(trigger.data.name);
      }
      else if(trigger.action === 'broadcastTrigger') {
        this.stage.broadcastTrigger(trigger.data.name, trigger.data.data);
      }
    }
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