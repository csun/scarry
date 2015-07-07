var scarry = {};

(function() {

  // A Stage has real pixel dimensions (which control absolute
  // positioning on screen) and scene dimensions, which are
  // used to position assets relative to their actual sizes
  function Stage(realSize) {
    this.renderer = PIXI.autoDetectRenderer(realSize.width, realSize.height);

    this.realSize = realSize;
    this.scenes = {};
    this.sceneSize = { width:0, height: 0 };
    this.actors = [];

    this.container = new PIXI.Container();
  }

  Stage.prototype.loadScene = function(sceneName) {
    this.container.removeChildren();
    this.actors = [];
    this.resetCamera();

    var scene = this.scenes[sceneName];
    this.setBackground(scene.background);

    for(var i = 0; scene.actors && i < scene.actors.length; i++) {
      this.createActor(scene.actors[i]);
    }
  };

  Stage.prototype.resetCamera = function() {
    this.container.position.x = 0;
    this.container.position.y = 0;

    this.container.scale.x = this.realSize.width / this.sceneSize.width;
    this.container.scale.y = this.realSize.height / this.sceneSize.height;

    this.container.rotation = 0;
  };

  Stage.prototype.setBackground = function(imageName) {
    var sprite = spriteFromImageName(imageName);

    this.container.addChild(sprite);
  };

  Stage.prototype.createActor = function(actorData) {
    var actor = new Actor(this, actorData);
    this.actors.push(actor);
    this.container.addChild(actor.sprite);
  };

  function spriteFromImageName(imageName) {
    return new PIXI.Sprite(PIXI.loader.resources[imageName].texture);
  }

  Stage.prototype.animate = function(dt) {
    for(var i = 0; i < this.actors.length; i++) {
      this.actors[i].animate(dt);
    }
  };

  Stage.prototype.render = function() {
    this.renderer.render(this.container);
  };


  function Actor(stage, options) {
    this.sprite = spriteFromImageName(options.image);
    this.sprite.position = options.position;
    this.stage = stage;

    this.triggers = {};
    this.animations = {};

    if(options.triggers) {
      this.createTriggers(options.triggers);
    }
    if(options.animations) {
      this.createAnimations(options.animations);
    }
  }

  Actor.prototype.createTriggers = function(triggers) {
    for(var triggerType in triggers) {
      var triggerData = triggers[triggerType];

      if(triggerData instanceof Array) {
        this.triggers[triggerType] = triggerData;
      }
      else {
        this.triggers[triggerType] = [triggerData];
      }
    }

    var actor = this;
    if('onClick' in this.triggers) {
      var onClick = function() {
        actor.activateTrigger('onClick');
      };

      this.sprite.interactive = true;
      this.sprite.on('mouseup', onClick);
      this.sprite.on('touchend', onClick);
    }
  };

  Actor.prototype.createAnimations = function(animations) {
    for(var animationName in animations) {
      this.animations[animationName] = new Animation(this.sprite, animations[animationName]);
    }
  };

  Actor.prototype.activateTrigger = function(triggerName) {
    if(triggerName in this.triggers) {
      for(var i = 0; i < this.triggers[triggerName].length; i++) {
        var trigger = this.triggers[triggerName][i];

        if(trigger.action === 'changeScene') {
          this.stage.loadScene(trigger.destination);
        }
        else if(trigger.action === 'startAnimation') {
          this.animations[trigger.animation].start();
        }
      }
    }
  };

  Actor.prototype.animate = function(dt) {
    for(var animationName in this.animations) {
      if(this.animations[animationName].active) {
        this.animations[animationName].continue(dt);
      } 
    }
  };


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
    // ADD DT TO GENERAL ANIMATION FUNCTIONS
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


  scarry.init = function(options) {
    getJSON(options.storyFile, function(story, err) {
      if(err) {
        alert(err);
        return;
      }

      scarry.stage = new Stage(options.size, story.sceneSize);
      scarry.stage.scenes = story.scenes;
      scarry.stage.sceneSize = story.sceneSize;

      document.body.appendChild(scarry.stage.renderer.view);
      
      for(var asset in story.assets) {
        PIXI.loader.add(asset, story.assets[asset]);
      }

      PIXI.loader.once('complete', function() {
        scarry.stage.loadScene(story.entryScene);
        requestAnimationFrame(scarry.animationFrame);
      });

      PIXI.loader.load();
    });
  };

  scarry.animationFrame = function(timestamp) {
    if(scarry.lastFrameTimestamp) {
      scarry.stage.animate(timestamp - scarry.lastFrameTimestamp);
      scarry.stage.render();
    }

    scarry.lastFrameTimestamp = timestamp;

    requestAnimationFrame(scarry.animationFrame);
  };

  function getJSON(url, callback) {
    // Source: http://youmightnotneedjquery.com/
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        callback(data);
      }
      else {
        callback(null, 'There was an error accessing the json.');
      }
    };

    request.onerror = function() {
      callback(null, 'There was an error connecting to the destination.');
    };

    request.send();
  }

})();