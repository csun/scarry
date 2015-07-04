var scarry = {};

(function() {

  // A Stage has real pixel dimensions (which control absolute
  // positioning on screen) and scene dimensions, which are
  // used to position assets relative to their actual sizes
  function Stage(realSize, sceneSize) {
    this.renderer = PIXI.autoDetectRenderer(realSize.width, realSize.height);
    this.realSize = realSize;
    this.sceneSize = sceneSize;

    this.container = new PIXI.Container();
  }

  Stage.prototype.loadScene = function(scene) {
    this.container.removeChildren();
    this.resetCamera();

    this.setBackground(scene.background);

    for(var i = 0; i < scene.actors.length; i++) {
      this.addActor(scene.actors[i])
    }
  }

  Stage.prototype.resetCamera = function() {
    this.container.position.x = 0;
    this.container.position.y = 0;

    this.container.scale.x = this.realSize.width / this.sceneSize.width;
    this.container.scale.y = this.realSize.height / this.sceneSize.height;

    this.container.rotation = 0;
  }

  Stage.prototype.setBackground = function(imgName) {
    var sprite = new PIXI.Sprite.fromImage(imgName);

    this.container.addChild(sprite);
  }

  Stage.prototype.addActor = function(actor) {
    var sprite = new PIXI.Sprite.fromImage(actor.image);

    sprite.position = actor.position;
    this.container.addChild(sprite);
  }

  Stage.prototype.animate = function() {

  }

  Stage.prototype.render = function() {
    this.renderer.render(this.container);
  }


  scarry.init = function() {
    var realSize = {
      width: 1280,
      height: 720
    }

    var sceneSize = {
      width: 2560,
      height: 1440
    }

    scarry.stage = new Stage(realSize, sceneSize);

    document.body.appendChild(scarry.stage.renderer.view);
    scarry.animate()
  }

  scarry.animate = function() {
    requestAnimationFrame(scarry.animate);
    scarry.stage.animate();
    scarry.stage.render();
  }
})();