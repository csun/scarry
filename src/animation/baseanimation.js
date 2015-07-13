// A baseclass for all animation classes.
// Not intended to be instantiated alone, should be inherited from.
function BaseAnimation() {
  this.reset();

  this.playCount = 0;
}

BaseAnimation.prototype.reset = function() {
  this.active = false;

  this._currentFrame = 0;
  this._frameElapsed = 0;
  this._remainingDelta = 0;
};

BaseAnimation.prototype.start = function() {
  this.reset();
  this.active = true;
  this.playCount += 1;
};

BaseAnimation.prototype.update = function(dt) {
  this._remainingDelta = dt;

  while(this._shouldUpdate()) {
    this._handleCurrentFrame();
  }
};

BaseAnimation.prototype._shouldUpdate = function() {
  if(!this.active || this._remainingDelta <= 0) {
    return false;
  }

  return true;
};

BaseAnimation.prototype._currentFrameTiming = function() {
  return 0;
};

BaseAnimation.prototype._handleCurrentFrame = function() {
  var usableTime = Math.min(this._remainingDelta, this._currentFrameTiming() - this._frameElapsed);
  var percentOfTotal = usableTime / this._currentFrameTiming();

  this._advanceFrameByPercentage(percentOfTotal);

  this._remainingDelta -= usableTime;
  this._frameElapsed += usableTime;

  if(this._frameElapsed >= this._currentFrameTiming()) {
    this._currentFrame++;
  }
};

BaseAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  // To be overridden
};

module.exports = BaseAnimation;