var PIXI = require('pixi.js');

function Sprite(texture) {
  PIXI.Sprite.call(this, texture);

  this.animations = {};
  this._currentAnimation = null;
}
Sprite.prototype = Object.create(PIXI.Sprite.prototype);

Sprite.prototype.update = function(dt) {
  if(this._currentAnimation && this._currentAnimation.active) {
    this._currentAnimation.update(dt);
  }
  else {
    this._currentAnimation = null;
  }
};

Sprite.prototype.startAnimation = function(name, options) {
  if(this._currentAnimation) {
    this._currentAnimation.reset();
  }

  this._currentAnimation = this.animations[name];
  this._currentAnimation.start(options);
};

module.exports = Sprite;