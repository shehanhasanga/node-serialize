var agent = {
	name : 'Example 1',
	type : 'Agent',
	 runAgent: function() {
	 	console.log('Example 001 from Middleware command');
        this.api = require('js-middleware-for-mobile-agents');
        this.api.getHostName(function(err,result){
            if (err){
              console.log('Error: ' + err);
            } else {
              console.log('Host Name: ' + result);
            }
        });
          /*
        this.api.getAvailableHosts(function(err,result){
        	if (err){
        		console.log('Error: ' + err);
        	} else {
        		console.log('Host List available 2: ');
            	Object.keys(result).forEach(function (index) {
            		console.log(result[index]);
        		});
        	}
        });
        */
       /*
       	this.api.moveTo(this,'Host# 7',function(err,result){
        	if (err){
        		console.log('Error: ' + err);
        	} else {
        		console.log('Result: ' + result);
        	}
        });
        */
        console.log('Finished Example');
	 }
};
module.exports = agent;