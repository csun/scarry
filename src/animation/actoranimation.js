var BaseAnimation = require('./baseanimation');

function ActorAnimation(actor, frames, options) {
  this._actor = actor;
  this._frames = frames;
  
  BaseAnimation.call(this, options);
}
ActorAnimation.prototype = Object.create(BaseAnimation.prototype);

ActorAnimation.prototype._currentFrameTiming = function() {
  return this._frames[this._currentFrame].time;
};

ActorAnimation.prototype._totalFrameCount = function() {
  return this._frames.length;
};

ActorAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  var frame = this._frames[this._currentFrame];

  if('moveRelative' in frame) {
    var movement = { x: frame.moveRelative.x * percentage, y: frame.moveRelative.y * percentage };
    this._actor.performTriggerAction('moveRelative', movement);
  }
  if('setHidden' in frame) {
    this._actor.performTriggerAction('setHidden', frame.setHidden);
  }
};

module.exports = ActorAnimation;