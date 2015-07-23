var PIXI = require('pixi.js');

function TextManager(fonts, container) {
  this.fonts = fonts;
  this.container = container;
}

TextManager.prototype.displayText = function(texts) {
  if(!texts) {
    return;
  }
  else if(!(texts instanceof Array)) {
    texts = [texts];
  }

  for(var i = 0; i < texts.length; i++) {
    var text = this._generateText(texts[i]);
    this.container.addChild(text);
  }
};

TextManager.prototype._generateText = function(textData) {
  var options = {
    font: this.fonts[textData.font].font,
    fill: this.fonts[textData.font].color
  };

  if('width' in textData) {
    options.wordWrap = true;
    options.wordWrapWidth = textData.width;
  }

  var text = new PIXI.Text(textData.text, options);
  text.x = textData.position.x;
  text.y = textData.position.y;

  return text;
};


module.exports = TextManager;