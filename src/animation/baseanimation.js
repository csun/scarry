// A baseclass for all animation classes.
// Not intended to be instantiated alone, should be inherited from.
function BaseAnimation() {
  this.reset();
}

BaseAnimation.prototype.reset = function() {
  this.active = false;

  this._currentFrame = 0;
  this._frameElapsed = 0;
  this._remainingDelta = 0;
  this._playCount = 0;
};

BaseAnimation.prototype.start = function(options) {
  this.reset();

  options = options || {};

  this._loop = options.loop || false;
  this._reverse = options.reverse || false;

  this._currentFrame = this._firstFrame();

  this.active = true;
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
  var percentOfTotal;

  var frameTiming = this._currentFrameTiming();
  if(frameTiming) {
    // Allow us to have 0 length frames and still get correct behavior.
    percentOfTotal = usableTime / frameTiming;
  }
  else {
    percentOfTotal = 1;
  }

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
  if(!this._loop && this._lastFrame()) {
    // Don't just reset here to keep last frame displayed
    this.active = false;
    return;
  }
  else if(this._loop && this._lastFrame()) {
    // _loop can be a number or a boolean
    // If it is a number, we only loop n times, hence the _decrementLoopCount()
    this._currentFrame = this._firstFrame();
    this._decrementLoopCount();
  }
  else if(this._reverse) {
    this._currentFrame--;
  }
  else {
    this._currentFrame++;
  }

  this._frameElapsed = 0;

};

BaseAnimation.prototype._lastFrame = function() {
  return (this._reverse && this._currentFrame === 0) ||
    (!this._reverse && this._currentFrame === this._totalFrameCount() - 1);
};

BaseAnimation.prototype._firstFrame = function() {
  if(this._reverse) {
    return this._totalFrameCount() - 1;
  }
  else {
    return 0;
  }
};

BaseAnimation.prototype._decrementLoopCount = function() {
  if(typeof this._loop === 'number') {
    this._loop--;
  }
};

BaseAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  throw new Exception('Not implemented');
};

module.exports = BaseAnimation;
