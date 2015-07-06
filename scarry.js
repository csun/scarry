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

    this.container = new PIXI.Container();
  }

  Stage.prototype.loadScene = function(sceneName) {
    this.container.removeChildren();
    this.resetCamera();

    var scene = this.scenes[sceneName];
    this.setBackground(scene.background);

    for(var i = 0; i < scene.actors.length; i++) {
      this.addActor(scene.actors[i]);
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

  Stage.prototype.addActor = function(actor) {
    var sprite = spriteFromImageName(actor.image);

    sprite.position = actor.position;

    for(var i = 0; i < actor.triggers.length; i++) {
      addTriggerToSprite(sprite, actor.triggers[i]);
    }

    this.container.addChild(sprite);
  };

  function addTriggerToSprite(sprite, trigger) {
    sprite.interactive = true;

    var fn;

    if(trigger.action === 'changeScene') {
      fn = generateChangeSceneFunction(trigger);
    }

    if(trigger.event === 'onClick') {
      sprite.on('mouseup', fn);
      sprite.on('touchend', fn);
    }
  }

  function generateChangeSceneFunction(trigger) {
    return function() {
      alert(trigger.destination);
    };
  }

  function spriteFromImageName(imageName) {
    return new PIXI.Sprite(PIXI.loader.resources[imageName].texture);
  }

  Stage.prototype.animate = function() {

  };

  Stage.prototype.render = function() {
    this.renderer.render(this.container);
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