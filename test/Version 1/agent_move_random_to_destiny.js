
 exports.runAgent = function(){
  console.log('Example 001 with API');
  var api = require('js-middleware-for-mobile-agents'); 
  //var api = require('/Users/carlossilva/Documents/Workspace_FrameworkJS/frameworkjsnode/lib/api.js');
  //var api = require('/home/ncosta/Desktop/MobileAgent/frameworkjsnode/lib/api.js');
  var agent = this;
/* This is another way to move randomly the agent using the api function (api.getRandomHost)
  api.getAvailableHosts(function(err,result){
    if (err){
      console.log('Error: ' + err);
    } else {
      api.getHostName(function(err,result){
        if (err){
          console.log('Error: ' + err);
        } else {
          if(result == 'Host# 2'){
            console.log('Host Name: ' + result);
            var now = new Date();
            var jsonDate = now.toJSON();
            console.log("I arrieved at " + jsonDate);
          } else {
            api.getRandomHost(function(err,result){
              if (err){
                console.log('Error: ' + err);
              } else {
                  console.log('Sending mobile agent to ' + result);
                  api.moveTo(agent,result,function(err,result){
                    if (err){
                        console.log('Error: ' + err);
                     } else {
                      console.log('Result: ' + result);
                    }
                  });
              }
            });
          }
        }
      });
    }
  });
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
          if(result == 'Host# 2'){
            console.log('Host Name: ' + result);
            var now = new Date();
            var jsonDate = now.toJSON();
            console.log("I arrieved at " + jsonDate);
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
 /*
  api.getRandomHost(
    function(err,result){
      if (err){
        console.log('Error: ' + err);
      } else {
        console.log('Result:' + result);
      }
  });
*/

/*
  api.getHostName(function(err,result){
    if (err){
      console.log('Error: ' + err);
    } else {
      console.log('Host Name: ' + result);
      }
  });
*/

/*  
  api.getAvailableHosts(function(err,result){
    if (err){
      console.log('Error: ' + err);
    } else {
      console.log('Host List available: ');
        Object.keys(result).forEach(function (index) {
          console.log(result[index]);
      });
    }
  });
*/

/*
  api.moveTo(agent,'Host# 8',function(err,result){
    if (err){
      console.log('Error: ' + err);
    } else {
      console.log('Result: ' + result);
    }
  });
*/  
};
this.runAgent();




