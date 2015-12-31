var PIXI = require('pixi.js');
var Sprite = require('./sprite');
var SpriteAnimation = require('./animation/spriteanimation');

var spriteManager = {};

var textureLoader = new PIXI.loaders.Loader();

var defaultTextures = {};
var animationFrames = {};
var spritesheetData = {};

spriteManager.load = function(sprites, callback) {
  for(var spriteName in sprites) {
    var spriteData = sprites[spriteName];

    // Sprite specified as just texture
    if(typeof spriteData === 'string') {
      textureLoader.add(spriteName, spriteData);
    }
    else {
      loadComplexSprite(spriteName, spriteData);
    }
  }

  textureLoader.once('complete', function() {
    spriteManager._createAnimationFrames();
    spriteManager._setDefaultTextures(Object.keys(sprites));
    callback();
  });

  textureLoader.load();
};

spriteManager._createAnimationFrames = function() {
  for(var spriteName in spritesheetData) {
    var data = spritesheetData[spriteName];
    var baseTexture = textureLoader.resources[spriteName].texture.baseTexture;

    animationFrames[spriteName] = {};
    for(var animationName in data.animations) {
      var frames = [];
      var currentPosition = data.animations[animationName].startFrame;

      for(var i = 0; i < data.animations[animationName].count; i++) {
        frames.push(extractFrameFromBaseTexture(baseTexture, currentPosition, data.frameCounts));

        // Increment frame and wrap around
        currentPosition.x = (currentPosition.x + 1) % data.frameCounts.x;
        if(currentPosition.x === 0) {
          currentPosition.y += 1;
        }
      }

      animationFrames[spriteName][animationName] = frames;
    }
  }
};

function extractFrameFromBaseTexture(baseTexture, coordinates, frameCounts) {
  var frameSize = { x: (baseTexture.width / frameCounts.x), y: (baseTexture.height / frameCounts.y)};
  var initialX = frameSize.x * coordinates.x;
  var initialY = frameSize.y * coordinates.y;

  var frame = new PIXI.Rectangle(initialX, initialY, frameSize.x, frameSize.y);
  return new PIXI.Texture(baseTexture, frame);
}

spriteManager._setDefaultTextures = function(names) {
  for(var i = 0; i < names.length; i++) {
    var texture = textureLoader.resources[names[i]].texture;
    var spritesheet = spritesheetData[names[i]];

    if(spritesheet) {
      defaultTextures[names[i]] = extractFrameFromBaseTexture(texture.baseTexture, spritesheet.defaultFrame, spritesheet.frameCounts);
    }
    else {
      defaultTextures[names[i]] = texture;
    }
  }
};

spriteManager.createSprite = function(name) {
  var sprite = new Sprite(defaultTextures[name]);

  if(spritesheetData[name]) {
    for(var animationName in spritesheetData[name].animations)  {
      var fps = spritesheetData[name].animations[animationName].fps;
      var options = spritesheetData[name].animations[animationName].options;
      sprite.animations[animationName] = new SpriteAnimation(sprite, animationFrames[name][animationName], fps, options);
    }
  }
  
  return sprite;
};

function loadComplexSprite(name, spriteData) {
  if(spriteData.type === 'spritesheet') {
    textureLoader.add(name, spriteData.file);

    spritesheetData[name] = {
      frameCounts: spriteData.frameCounts,
      defaultFrame: spriteData.defaultFrame || { 'x': 0, 'y': 0 },
      animations: spriteData.animations
    };
  }
}

module.exports = spriteManager;
