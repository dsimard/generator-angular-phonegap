'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.hookFor('angular:controller');
  this.hookFor('angular:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
  var coffee = this.env.options.coffee;
  var config = {
    file: path.join(
      this.env.options.appPath,
      'scripts/app.' + (coffee ? 'coffee' : 'js')
    ),
    needle: '.otherwise',
    splicable: [
      "  url: '/" + this.name + (coffee ? "" : "," ),
      "  templateUrl: 'views/" + this.name + ".html'" + (coffee ? "" : "," ),
      "  controller: '" + this._.classify(this.name) + "Ctrl'"
    ]
  };

  if (coffee) {
    config.splicable.unshift("$stateProvider.state '/" + this.name + "',");
  }
  else {
    config.splicable.unshift("$stateProvider.state('" + this.name + "', {");
    config.splicable.push("})");
  }

  angularUtils.rewriteFile(config);
};
