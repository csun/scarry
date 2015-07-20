function AnimationHandler(animationsData, animatable) {
  this.target = animatable;

  this.load(animationsData);
}

AnimationHandler.prototype.handle = function(triggerName) {
  if(triggerName in this.triggers) {
    for(var i = 0; i < this.triggers[triggerName].length; i++) {
      var trigger = this.triggers[triggerName][i];

      this.target.performTriggerAction(trigger.action, trigger.data);
    }
  }
};

module.exports = AnimationHandler;