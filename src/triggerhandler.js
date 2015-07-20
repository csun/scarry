// Does the work of setting up triggers
// A triggerable is any object with a 
// performTriggerAction(action, data)
// function.
function TriggerHandler(triggersData, triggerable) {
  this.target = triggerable;

  this.loadTriggers(triggersData);
}

TriggerHandler.prototype.loadTriggers = function(triggersData) {
  this.triggers = {};
  
  if(!triggersData) {
    return;
  }

  for(var triggerType in triggersData) {
    var triggerData = triggersData[triggerType];

    if(triggerData instanceof Array) {
      this.triggers[triggerType] = triggerData;
    }
    else {
      this.triggers[triggerType] = [triggerData];
    }
  }
};

TriggerHandler.prototype.handle = function(triggerName) {
  if(triggerName in this.triggers) {
    for(var i = 0; i < this.triggers[triggerName].length; i++) {
      var trigger = this.triggers[triggerName][i];

      this.target.performTriggerAction(trigger.action, trigger.data);
    }
  }
};

module.exports = TriggerHandler;