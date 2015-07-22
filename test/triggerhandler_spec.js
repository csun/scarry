var expect = require('chai').expect;
var TriggerHandler = require('../src/triggerhandler');


// Mock class and test data =========================================
function MockTriggerable() {
  this.triggeredActions = [];
}

MockTriggerable.prototype.performTriggerAction = function(action, data) {
  this.triggeredActions.push({ action: action, data: data });
};


var singleTrigger = {
  action: "ACTION2",
  data: "DATA2"
};

var doubleTrigger = [
  {
    action: "ACTION1a",
    data: "DATA1a"
  },
  {
    action: "ACTION1b",
    data: "DATA1b"
  }
];

var limitedTrigger = {
  action: "something",
  maxActivations: 2,
  data: "something"
};

function expectActionsToMatch(a1, a2) {
  expect(a1.action).to.equal(a2.action);
  expect(a1.data).to.equal(a2.data);
}
// ==================================================================


describe('TriggerHandler', function() {
  var triggerable;
  var handler;

  beforeEach(function() {
    triggerable = new MockTriggerable();
    handler = new TriggerHandler({}, triggerable);
  });

  it('should not do anything when responding to an unsubscribed trigger', function() {
    handler.loadTriggers({ subscribed: singleTrigger });
    handler.handle('unsubscribed');

    expect(triggerable.triggeredActions.length).to.equal(0);
  });

  it('should properly handle a trigger with a single action', function() {
    handler.loadTriggers({ trigger: singleTrigger });
    handler.handle('trigger');

    expect(triggerable.triggeredActions.length).to.equal(1);
    expectActionsToMatch(singleTrigger, triggerable.triggeredActions[0]);
  });

  it('should properly handle a trigger with multiple actions', function() {
    handler.loadTriggers({ trigger: doubleTrigger });
    handler.handle('trigger');

    expect(triggerable.triggeredActions.length).to.equal(2);
    expectActionsToMatch(doubleTrigger[0], triggerable.triggeredActions[0]);
    expectActionsToMatch(doubleTrigger[1], triggerable.triggeredActions[1]);
  });

  it('should respect max activations', function() {
    handler.loadTriggers({ trigger: limitedTrigger });

    for(var i = 0; i < limitedTrigger.maxActivations + 1; i++) {
      handler.handle('trigger');
    }

    expect(triggerable.triggeredActions.length).to.equal(limitedTrigger.maxActivations);
  });
});