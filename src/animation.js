function Animation(sprite, options) {
  this.sprite = sprite;
  this.frames = options.frames;

  this.active = false;
  this.resetState();
  this.playCount = 0;
}

Animation.prototype.resetState = function() {
  this.currentFrame = 0;
  this.frameElapsed = 0;
  this.remainingDelta = 0;
};

Animation.prototype.start = function() {
  this.active = true;
  this.resetState();
  this.playCount += 1;
};

Animation.prototype.continue = function(dt) {
  this.remainingDelta = dt;

  while(this.currentFrame < this.frames.length && this.remainingDelta > 0) {
    this.handleFrame();
    if(this.frameElapsed >= this.frames[this.currentFrame].time) {
      this.currentFrame++;
    }
  }

  if(this.currentFrame >= this.frames.length) {
    // Animation is done
    this.active = false;
  }
};

Animation.prototype.handleFrame = function() {
  var frame = this.frames[this.currentFrame];
  var usableTime = Math.min(this.remainingDelta, frame.time - this.frameElapsed);
  var percentOfTotal = usableTime / frame.time;

  if(frame.type === 'moveRelative') {
    this.sprite.position.x += (frame.movement.x * percentOfTotal);
    this.sprite.position.y += (frame.movement.y * percentOfTotal);
  }

  this.remainingDelta -= usableTime;
  this.frameElapsed += usableTime;
};


module.exports = Animation;