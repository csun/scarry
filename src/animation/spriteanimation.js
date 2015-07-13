var BaseAnimation = require('./baseanimation');

function SpriteAnimation(sprite, frames, fps) {
  this._sprite = sprite;
  this._frames = frames;
  this._frameLength = 1000 / fps;

  BaseAnimation.call(this);
}
SpriteAnimation.prototype = Object.create(BaseAnimation.prototype);

SpriteAnimation.prototype.reset = function() {
  this._sprite.texture = this._frames[0];
  BaseAnimation.prototype.reset.call(this);
}

SpriteAnimation.prototype._shouldUpdate = function() {  
  return BaseAnimation.prototype._shouldUpdate.call(this) && this._currentFrame < this._frames.length;
};

SpriteAnimation.prototype._currentFrameTiming = function() {
  return this._frameLength;
};

SpriteAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  var frameTexture = this._frames[this._currentFrame];
  this._sprite.texture = frameTexture;
};

module.exports = SpriteAnimation;