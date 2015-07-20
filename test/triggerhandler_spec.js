var expect = require('chai').expect;
var TriggerHandler = require('../src/triggerhandler');


// Mock class and test data =========================================
function MockTriggerable() {
  this.triggeredActions = [];
}

MockTriggerable.prototype.performTriggerAction = function(action, data) {
  this.triggeredActions.push({ action: action, data: data });
};


var TRIGGERS_DATA = {
  TRIGGER1: {
    action: "ACTION2",
    data: "DATA2"
  },
  TRIGGER2: [
    {
      action: "ACTION1a",
      data: "DATA1a"
    },
    {
      action: "ACTION1b",
      data: "DATA1b"
    }
  ]
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
    handler = new TriggerHandler(TRIGGERS_DATA, triggerable);
  });

  it('should not do anything when responding to an unsubscribed trigger', function() {
    handler.handle('unsubscribed');

    expect(triggerable.triggeredActions.length).to.equal(0);
  });

  it('should properly handle a trigger with a single action', function() {
    handler.handle('TRIGGER1');

    expect(triggerable.triggeredActions.length).to.equal(1);
    expectActionsToMatch(TRIGGERS_DATA.TRIGGER1, triggerable.triggeredActions[0]);
  });

  it('should properly handle a trigger with multiple actions', function() {
    handler.handle('TRIGGER2');

    expect(triggerable.triggeredActions.length).to.equal(2);
    expectActionsToMatch(TRIGGERS_DATA.TRIGGER2[0], triggerable.triggeredActions[0]);
    expectActionsToMatch(TRIGGERS_DATA.TRIGGER2[1], triggerable.triggeredActions[1]);
  });
});