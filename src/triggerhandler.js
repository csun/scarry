// Does the work of setting up triggers
// A triggerable is any object with a 
// performTriggerAction(action, data)
// function.
function TriggerHandler(triggersData, triggerable) {
  this.target = triggerable;

  this.loadTriggers(triggersData);
}

TriggerHandler.prototype.loadTriggers = function(triggersData) {
  this.triggerActions = {};
  
  if(!triggersData) {
    return;
  }

  for(var triggerName in triggersData) {
    var actions = triggersData[triggerName];

    if(actions instanceof Array) {
      this.triggerActions[triggerName] = actions;
    }
    else {
      this.triggerActions[triggerName] = [actions];
    }

    for(var i = 0; i < this.triggerActions[triggerName].length; i++) {
      this.triggerActions[triggerName][i].activations = 0;
    }
  }
};

TriggerHandler.prototype.handle = function(triggerName) {
  if(!(triggerName in this.triggerActions)) {
    return;
  }
  var actions = this.triggerActions[triggerName];

  for(var i = 0; i < actions.length; i++) {
    var action = actions[i];

    this._activateAction(action);
  }
};

TriggerHandler.prototype._activateAction = function(action) {
  if(action.maxActivations && (action.activations >= action.maxActivations)) {
    return;
  }

  var target = this.target;
  var performAction = function() { target.performTriggerAction(action.action, action.data); };

  if(action.delay) {
    setTimeout(performAction, action.delay);
  }
  else {
    performAction();
  }

  action.activations++;
};

module.exports = TriggerHandler;
