
exports.runAgent = function() {

  this._name = "move random";
  console.log('\033[2J');
  //this._name = "Agent1";
  //console.clear(); in v8.3.0 and above
  /*var lines = process.stdout.getWindowSize()[1];
  for(var i = 0; i < lines; i++) {
      console.log('\r\n');
  }*/


  var api = require('js-middleware-for-mobile-agents');
  //var api = require('../lib/Api');
  var agent = this;
  var now = new Date();
  var jsonDate = now.toJSON();

  console.log('Example 001 with API');
  console.log("I'm Here at " + jsonDate + ", I'm waiting for 5 seg before to move.");
  var host;

  setTimeout(function(){
    api.getAvailableHosts(function(err,result){
      if (err){
        console.log('Error: ' + err);
      } else {
        var min = Math.ceil(0);
        var max = Math.floor(result.length - 1);
        var item =  Math.floor(Math.random() * (max - min + 1)) + min;
        host = result[item];

        api.moveTo(agent,host,function(err,result){
          if (err){
              console.log('Error: ' + err);
           } else {
            console.log('\033[2J');
          }
        });

      }
    });
  },5000);
  /*console.log('I Moved to ' + host);
  setTimeout(function(){
    console.log('\033[2J');
  },2000);
  */
};
//this.runAgent();
