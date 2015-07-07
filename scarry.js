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

  Stage.prototype.animate = function() {
    for(var i = 0; i < this.actors.length; i++) {
      this.actors[i].animate();
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

    this.createTriggers(options.triggers);
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

  Actor.prototype.activateTrigger = function(triggerName) {
    if(triggerName in this.triggers) {
      for(var i = 0; i < this.triggers[triggerName].length; i++) {
        var trigger = this.triggers[triggerName][i];

        if(trigger.action === 'changeScene') {
          this.stage.loadScene(trigger.destination);
        }
      }
    }
  };

  Actor.prototype.animate = function() {
    
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
        scarry.run();
      });

      PIXI.loader.load();
    });
  };

  scarry.run = function() {
    requestAnimationFrame(scarry.run);
    scarry.stage.animate();
    scarry.stage.render();
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