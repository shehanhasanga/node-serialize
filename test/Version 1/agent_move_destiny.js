
 exports.runAgent = function(){

  console.log('Example 001 with API');
  var api = require('js-middleware-for-mobile-agents');
  //var api = require('/Users/carlossilva/Documents/Workspace_FrameworkJS/frameworkjsnode/lib/api.js');
  api.getHostName(function(err,result){
    if (err){
      console.log('Error: ' + err);
    } else {
      console.log('Host Name: ' + result);
    }
  });
  api.moveTo(this,'Host# 1',function(err,result){
      if (err){
        console.log('Error: ' + err);
      } else {
        console.log('Result: ' + result);
      }
  });
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

};
 //this.runAgent();

