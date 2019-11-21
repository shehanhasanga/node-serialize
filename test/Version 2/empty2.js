
exports.runAgent = function() {
  console.log('\033[2J');
  this._name = "Agent001";
  //this._name = "move random";

  var now = new Date();
  var jsonDate = now.toJSON();
  console.log('Hello Prof. Carlos Grilo');
  console.log("I'm Here at " + jsonDate + ", I'm waiting for 5 seg before to move.");

  //var api = require('js-middleware-for-mobile-agents');
  //var api = require('example');
  //var api = require('./../lib/Api.js');
  var api = this._api;
  var agent = this;

  setTimeout(function() {
    api.getAvailableHosts(function(err,result) {
      if (err){
        console.log('Error: ' + err);
      } else {
        var min = Math.ceil(0);
        var max = Math.floor(result.length - 1);
        var item =  Math.floor(Math.random() * (max - min + 1)) + min;
        var host = result[item];
        api.moveTo(agent, host, function(err,result) {
          if (err){
              console.log('Error: ' + err);
           } else {
            console.log('\033[2J');
          }
        });

      }
    });
},5000);
  
};
