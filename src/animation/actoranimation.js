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

  for(var action in frame) {
    var data = processFrameData(action, frame[action]);
    this._actor.performTriggerAction(action, data);
  }
};

function processFrameData(action, data) {
  switch(action) {
    case 'moveRelative':
      return { x: frame.moveRelative.x * percentage, y: frame.moveRelative.y * percentage };
    default:
      return data;
  }
}

module.exports = ActorAnimation;