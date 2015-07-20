var BaseAnimation = require('./baseanimation');

function MovementAnimation(sprite, frames, options) {
  this._sprite = sprite;
  this._frames = frames;
  
  BaseAnimation.call(this, options);
}
MovementAnimation.prototype = Object.create(BaseAnimation.prototype);

MovementAnimation.prototype._currentFrameTiming = function() {
  return this._frames[this._currentFrame].time;
};

MovementAnimation.prototype._totalFrameCount = function() {
  return this._frames.length;
};

MovementAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  var frame = this._frames[this._currentFrame];

  if('moveRelative' in frame) {
    this._sprite.position.x += (frame.moveRelative.x * percentage);
    this._sprite.position.y += (frame.moveRelative.y * percentage);
  }
};

module.exports = MovementAnimation;