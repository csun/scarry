// A baseclass for all animation classes.
// Not intended to be instantiated alone, should be inherited from.
function BaseAnimation(options) {
  this.reset();

  this.playCount = 0;

  options = options || {};
  this.loop = options.loop || false;
  this.maxPlayCount = options.maxPlayCount || -1;
}

BaseAnimation.prototype.reset = function() {
  this.active = false;

  this._currentFrame = 0;
  this._frameElapsed = 0;
  this._remainingDelta = 0;
};

BaseAnimation.prototype.start = function() {
  if(this.maxPlayCount < 0 || this.playCount < this.maxPlayCount) {
    this.reset();
    this.active = true;
    this.playCount += 1;
  }
};

BaseAnimation.prototype.update = function(dt) {
  this._remainingDelta = dt;

  while(this._shouldUpdate()) {
    this._handleCurrentFrame();
  }
};

BaseAnimation.prototype._shouldUpdate = function() {
  return (this.active && this._remainingDelta > 0 && this._currentFrame < this._totalFrameCount());
};

BaseAnimation.prototype._currentFrameTiming = function() {
  throw new Exception('Not implemented');
};

BaseAnimation.prototype._totalFrameCount = function() {
  throw new Exception('Not implemented');
};

BaseAnimation.prototype._handleCurrentFrame = function() {
  var usableTime = Math.min(this._remainingDelta, this._currentFrameTiming() - this._frameElapsed);
  var percentOfTotal = usableTime / this._currentFrameTiming();

  this._advanceFrameByPercentage(percentOfTotal);

  this._remainingDelta -= usableTime;
  this._frameElapsed += usableTime;

  if(this._frameElapsed >= this._currentFrameTiming()) {
    // Don't just do a straight reset here so that the animation
    // will still display the last frame
    this._nextFrame();
  }
};

BaseAnimation.prototype._nextFrame = function() {
  if(!this.loop && this._currentFrame + 1 === this._totalFrameCount()) {
    // Don't just reset here to keep last frame displayed
    this.active = false;
    return;
  }

  this._currentFrame++;
  this._frameElapsed = 0;

  if(this.loop) {
    this._currentFrame %= this._totalFrameCount();
  }
};

BaseAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  throw new Exception('Not implemented');
};

module.exports = BaseAnimation;