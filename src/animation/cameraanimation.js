var BaseAnimation = require('./baseanimation');

function CameraAnimation(camera, frames, options) {
  this._camera = camera;
  this._frames = frames;
  
  BaseAnimation.call(this, options);
}
CameraAnimation.prototype = Object.create(BaseAnimation.prototype);

CameraAnimation.prototype._currentFrameTiming = function() {
  return this._frames[this._currentFrame].time;
};

CameraAnimation.prototype._totalFrameCount = function() {
  return this._frames.length;
};

CameraAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  var frame = this._frames[this._currentFrame];

  if('pan' in frame) {
    var adjustedPan = { x: frame.pan.x * percentage, y: frame.pan.y * percentage };
    this._camera.pan(adjustedPan);
  }
  if('zoom' in frame) {
    this._camera.zoom(frame.zoom * percentage);
  }
};

module.exports = CameraAnimation;