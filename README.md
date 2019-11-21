# My project's README
* Create a new npm project
```sh
npm init
```
* Install middleware module
```sh
npm install js-middleware-for-mobile-agents --save
```
* Run the Server registry
```sh
node ./node_module/js-middleware-for-mobile-agents/lib/Server.js
```
* Run the middleware
```sh
node ./node_module/js-middleware-for-mobile-agents/lib/Middleware.js
```
* Create a Java script file
```sh
MobileAgent.js
```

* Run the Mobile Agent through Middleware
```sh
node [path-to-Middleware] -a [path-to-mobile-agent]
node ./lib/Middleware -a ../test/MobileAgent.js
```

## Table of Contents
* [Installing](#Installing)
* [API](#API)
* [Mobile agent structure]
* [Usage examples]
  + [GetHostName function](#GetHostName-function)
  + [GetAvailableHosts function](#GetAvailableHosts-function)
  + [MoveTo function](#MoveTo-function)
  + [Example](#Example)
* License

## Installing

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install js-middleware-for-mobile-agents
```

## API

```js
var api = require('./lib/Api.js')
```

## Mobile agent structure

```js
  exports.runAgent = function(){
    var api = this._api;
    console.log('Example with API 001');
  };
```

## Usage examples

###  GetHostName function

```js

  api.getHostName(function(err,result) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Host name for this device: ' + result);
    }
  });
```

###  GetAvailableHosts function

```js

	api.getAvailableHosts(function(err,result) {
  	if (err) {
  		console.log('Error: ' + err);
  	} else {
  		  console.log('Host List available: ');
      	Object.keys(result).forEach(function (index) {
          console.log(result[index]);
  		  });
  	}
    });
```

###  MoveTo function

```js

  	api.moveTo(this,'Host# 2',function(err,result){
      if (err) {
     		console.log('Error: ' + err);
     	} else {
     		console.log('Result: ' + result);
     	}
 	});
```

### Example example 1

```js
exports.runAgent = function() {
  /*
  * Custom Code begin
  */
  this._name = "Scenario 001";
  var agent = this;
  console.log("Hello, World!");
  var hostList = ["Host# 1(::ffff:192.168.0.101)", "Host# 2(::ffff:192.168.0.103)", "Host# 3(::ffff:192.168.0.106)", "Host# 4(::ffff:192.168.0.105)", "Host# 5(::ffff:192.168.0.102)"];
  var host = "Host# 2(::ffff:192.168.0.101)";
  var api = this._api;
  var lastHost = this._lastHost;
  var newhost = 0;
  if (lastHost != NaN && lastHost != undefined) {
    newhost = (lastHost + 1);
  }
  this._lastHost = newhost;
  var next_host = hostList[newhost];
  var agent = this;
  setTimeout(function() {
      api.moveTo(agent, next_host, function(err, result) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          console.log('\033[2J');
        }
      });
  },5000);
  /*
  * Custom code end
  */
};
```
### Agent Example 2
```js
exports.runAgent = function() {
  /*
  * Custom Code begin
  */
  this._name = "Scenario 002";
  var agent = this;
  console.log("Hello, World!");
  var host;
  var api = this._api;
  setTimeout(function() {
      api.getRandomHost(function(err, result) {
          if (err) {
            console.log('Error: ' + err);
          } else {
            host = result;
                api.moveTo(agent, host, function(err, result) {
                  if (err) {
                    console.log('Error: ' + err);
                  } else {
                    console.log('\033[2J');
                  }
                });
          }
      });
  },5000);
  /*
  * Custom code end
  */
};
```

### Agent Example 3
```js
exports.runAgent = function() {
  this._name = "Scenario 003";
  console.log("Mobile Agent running...");
  var hostList = ["Host# 1(::ffff:192.168.0.101)", "Host# 2(::ffff:192.168.0.103)", "Host# 3(::ffff:192.168.0.106)", "Host# 4(::ffff:192.168.0.105)", "Host# 5(::ffff:192.168.0.102)"];
  var api = this._api; var lastHost = this._lastHost; var newhost = 1;
  if (lastHost != NaN && lastHost != undefined) { newhost = (lastHost + 1); }
  this._lastHost = newhost;
  var macList; var next_host = hostList[newhost]; var agent = this;
  var source_arrive = this._source_arrive;
  if (source_arrive == NaN || source_arrive == undefined) { this._source_arrive = 0; }  
  if (source_arrive == 1) { console.log("MACs List"); console.log(this._macList);
  } else {
  		 require('getmac').getMac(function(err, macAddress) {
		    if (err)  throw err
		        if (agent._macList == undefined) {
		          macList =  macAddress;
		        } else {
		          macList = agent._macList + " | " + macAddress;
		        }
		        agent._macList = macList;
	            if (newhost == (hostList.length)) {
	              agent._source_arrive = 1;
	              api.moveTo(agent, hostList[0], function(err, result) {
	                  if (err) {
	                    console.log('Error: ' + err);
	                  } else {
	                    console.log('\033[2J');
	                  }
	                });
	            } else {
		              setTimeout(function() {
		                api.moveTo(agent, next_host, function(err, result) {
		                  if (err) {
		                    console.log('Error: ' + err);
		                  } else {
		                    console.log('\033[2J');
		                  }
		                });
		             },5000);
	        	 }
		  });
  }
};
```

## License
