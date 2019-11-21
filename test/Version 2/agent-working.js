exports.runAgent = function(){
    console.log('Example 001 with API');
    var api = require('js-middleware-for-mobile-agents');
/*
    setTimeout(function(){
    },2000);
    var agent = this;
    if(this.hostVisited === undefined){
      //var hostVisited = [];
      this.hostVisited = 0;
    } else {
      //var hostVisited = this.hostVisited;
    }
*/
    api.getAvailableHosts(function(err,result){
        if (err){
          console.log('Error: ' + err);
        } else {
          var min = Math.ceil(0);
          var max = Math.floor(result.length - 1);
          var item =  Math.floor(Math.random() * (max - min + 1)) + min;
          var host = result[item];
          api.getHostName(function(err,result){
            if (err){
              console.log('Error: ' + err);
            } else {
              //hostVisited.push(result);
              this.hostVisited = this.hostVisited + 1;
              if(result == 'Host# 11'){
                //agent.hostVisited.splice( agent.hostVisited.indexOf(result), 1);
                console.log('Host Name: ' + result);
                var now = new Date();
                var jsonDate = now.toJSON();
                console.log("I arrieved at " + jsonDate);
                console.log("Host visited: " + this.hostVisited.length);
              } else {
                console.log('Sending mobile agent to ' + host);
                api.moveTo(agent,host,function(err,result){
                  if (err){
                      console.log('Error: ' + err);
                   } else {
                    console.log('Result: ' + result);
                  }
                });
              }
              }
            });
        }
      });
    };
this.runAgent();
