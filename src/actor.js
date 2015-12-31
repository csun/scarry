var ActorAnimation = require('./animation/actoranimation');
var spriteManager = require('./spritemanager');
var TriggerHandler = require('./triggerhandler');

function Actor(stage, options) {
  this.sprite = spriteManager.createSprite(options.sprite);

  // We need to copy instead of referencing. Otherwise positional
  // animations will cause permanent changes when going back to a scene.
  this.sprite.position = {
    'x': options.position.x,
    'y': options.position.y
  };

  if(options.anchor) {
    this.sprite.anchor.x = options.anchor.x;
    this.sprite.anchor.y = options.anchor.y;
  }

  this.sprite.scale.x = options.scale || 1;
  this.sprite.scale.y = options.scale || 1;

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
  switch(action) {
    case 'changeScene':
      this.stage.loadScene(data.destination);
      break;
    case 'nextScene':
      this.stage.nextScene();
      break;
    case 'prevScene':
      this.stage.prevScene();
      break;
    case 'startAnimation':
      this.animations[data.name].start(data.options);
      break;
    case 'startSpriteAnimation':
      this.sprite.startAnimation(data.name, data.options);
      break;
    case 'broadcastTrigger':
      this.stage.broadcastTrigger(data.name, data.data);
      break;
    case 'moveRelative':
      this.sprite.position.x += data.x;
      this.sprite.position.y += data.y;
      break;
    case 'setPosition':
      this.sprite.position.x = data.x;
      this.sprite.position.y = data.y;
      break;
    case 'rotate':
      this.sprite.rotation += (data * (3.14159 / 180));
      break;
    case 'fade':
      this.sprite.alpha -= data;
      this.sprite.alpha = Math.max(0, Math.min(1, this.sprite.alpha));
      break;
    case 'setHidden':
      this.sprite.visible = !data;
      break;
  }
};

Actor.prototype.createAnimations = function(animations) {
  for(var animationName in animations) {
    var animation = animations[animationName];
    this.animations[animationName] = new ActorAnimation(this, animation.frames, animation.options);
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
