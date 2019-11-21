/*!
 * JS-Middleware-for-mobile-agents
 * Copyright(c)
 * Copyright(c)
 * MIT Licensed
 */

//Library for Web socket
const WebSocket = require('ws');
//Library for Serialize
var Serialize = require('node-serialize');
//library for print objects
const util = require('util');
//Library for Colors to console
var Colors = require('colors');
//Library for File System operations
const Fs = require('fs');
//Configuration variables
const DEVICE = 'DESKTOP';
const VERSION = '0.0.1';
var MIDDLEWARE_PORT_WORKING;
const MIDDLEWARE_HOST = '127.0.0.1';
const MIDDLEWARE_PORT = [4040, 4041, 4042];
const REGISTRY_HOST = '192.168.2.14'; //registry-server.ddns.net //const REGISTRY_HOST = '13.56.108.240';
const REGISTRY_PORT = 4045;

/**
* Server Middleware
*/
var wsServer;
var socketNum = 0;
var middlewareClients = Object.create(null);
var middlewareClientsList = []; //var registryClientsList = Object.create(null);
const KeyMiddlewareStatus = ['registerConnectionAPI', 'confirmConnectionAPI', 'deleteConnectionAPI'];
const KeyMiddlewareOperations = ['sendAgentFromAPI', 'getAvailableHost', 'getHostName', 'getDeviceType'];

/**
* Registry Connection
*/
var host_list = [];
var wsClient;
var agent = undefined;
var hostName = '';
var hasAgent = false;
const KeyRegistryStatus = ['registeredHost', 'newConnectionHost', 'newDisconnectionHost', 'registeredHostConfirmation'];
const KeyClientStatus = ['infoAgent', 'getMiddlewareInfo', 'setMiddlewareInfo'];
const KeyAgentStatus = ['sendAgent', 'receivedAgent'];
const KeyAgent = 'Agent';
/**
*Framework operations
*/


var ShowInformationMessages = true;
var ShowWarningMessages = true;
var ShowErrorMessages = true;

var menu = true;
var action = 0;
var stdin = process.openStdin();

//----------------------------------MAIN()-----------------------------------//

//restoreBackup('backup001.js');
stdin.addListener("data", function(d) {
    validateMenu(d);
});

if (process.argv.length > 1) {
  for (var i = 2; i < process.argv.length; i++){
      var command = process.argv[i];
      switch(command) {
          case '-middleware-port':
              REGISTRY_PORT = process.argv[i + 1];
              break;
          default:
              console.log('');
      }
  }
}

connectMiddleware();
startMiddlewareSocket(0);
//restoreBackup('backup001.js');

function validateComandLine() {
  if (process.argv.length > 1) {
    for (var i = 2; i < process.argv.length; i++){
        var command = process.argv[i];
        switch(command) {
            case '-a':
              readAgentFromFile(process.argv[i + 1]);
              break;
            case '-h':
              if (hasAgent) {
                  sendAgent(process.argv[i + 1]);
              }
              break;
            default:
              console.log('');
        }
    }
  }
}


/**
*
*/
function connectMiddleware() {
  if (wsClient === undefined || wsClient.readyState === WebSocket.OPEN) {
    clientWebSocket({host: REGISTRY_HOST, port: REGISTRY_PORT});
  }
}

/**
* Start Middleware
* @param {Object} options
* @param {Function} callback
* @public
*/
/**
exports.start = function(options,callback) {
    options = Object.assign({
      host: REGISTRY_HOST,   // use default
      port: REGISTRY_PORT    // use default
    }, options);

    if (options.port == null) {
      throw new TypeError('missing or invalid options');
    }
    if (options.port != null && options.host != null) {
        clientWebSocket(options);
        startMiddlewareSocket(0);
    }
}
*/
/**
* Read the Mobile Agent from file system
* @param {String} filename
* @private
*/
function readAgentFromFile(filename) {
  console.log(Colors.yellow('AGENT NAME => ' + filename));
  try {
      agent = require('./' + filename);
      clearRequireCache();
  } catch (e){
      if (ShowErrorMessages) console.log(Colors.red('[Middleware.js][-] Error to import Mobile Agent'));

      return;
  }
  hasAgent = true;

  var now = new Date();
  var jsonDate = now.toJSON();
    jsonDate = new Date(jsonDate).toUTCString()
    agent._api = require('./Api.js'); //js-middleware-for-mobile-agents
    if (agent._name == undefined) {
      var now = new Date();
      var jsonDate = now.toJSON();
      agent._name = 'Name:'  + jsonDate;
    }


  sendAgentStatus();
    //setTimeout(function() {
      runAgent();
    //}, 5000);
}

function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}
/**
* Backup the mobile agent in case of a unexpected event
* @param {String} name name file
* @param {String} code Mobile agent code
* @private
*/
function backupAgent(name, agent) {
    var code = Serialize.serialize(agent);
    Fs.writeFile('./' + name ,code,function(error)  {
        if (error) {
            if (ShowErrorMessages) console.log(error);
        } else {
            if (ShowInformationMessages) console.log('[Middleware.js]The agent was created successful');
        }
    });
}

/**
* Restore the mobile agent in case of a unexpected event
* @param {String} filename
* @private
*/
function restoreBackup(filename) {
    agent = undefined;
    Fs.readFile('./' + filename,function(error,data){
        if (error) {
           // if (ShowErrorMessages) console.log(error);
        } else {
            data = data.toString();
            typeof data === 'string';
            agent = Serialize.unserialize(data);
            agent._api = require('./Api.js');//js-middleware-for-mobile-agents
            hasAgent = true;
            sendAgentStatus();
            if (ShowInformationMessages) console.log(Colors.green('[Middleware.js][*] Object Backup recover successful'));
        }
    });
}

/**
* Delete the mobile agent
* @private
*/
function deleteAgent() {
    agent = undefined;
    hasAgent = false;
    sendAgentStatus();
    console.log('\033[2J');
    try {
        Fs.unlink('./' + 'backup001.js', (err) => {
            if (err) {

            } else {
                if (ShowInformationMessages) console.log('[Middleware.js]successfully deleted');
            }
        });
    } catch(err) {
        //console.log('ERROR :' + err);
    }
}

/**
* Return a random value between max and min values
* @param {Function} callback
* @priavte
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/**
* Run Mobile Agent
* @private
*/
function runAgent() {
    if (agent != undefined){
        try {
          agent.runAgent();
          /*
            agent.runAgent(function(err,result) {
              if (err) {

              } else {
                  runAgentMove();
              }
            });
            */
        } catch (err) {
            // Handle the error here.
            console.log(err);
            //return;
        }
    } else {
        if(ShowErrorMessages) console.log(Colors.red('[Middleware.js]Mobile Agent is empty'));
    }
}

/**
* Move Agent through the network
* @private
*/
/*
function runAgentMove() {
  if (agent != undefined) {
    //backupAgent('backup001.js',agent);
    var destiny = agent.moveDevices();
    if (destiny == hostName) {
      //if(ShowInformationMessages) console.log(Colors.red('I arrived to my destiny'));
    } else if (destiny == "random") {
       var item = getRandomIntInclusive(0,host_list.length - 1);
       destiny = host_list[item];
       sendAgent(destiny);
       //console.log('Move random: '+destiny + " -item: " + item);
    } else {
      sendAgent(destiny);
      //console.log('Move to ' + destiny);
    }
  } else {
      if(ShowErrorMessages) console.log(Colors.red('Mobile Agent is empty'));
  }
}
*/

/**
* Send Mobile Agent through the network
* @param  {String} host_destiny
* @private
*/
function sendAgent(host_destiny) {
  var now = new Date();
  var jsonDate = now.toJSON();
    if (agent == undefined) {
        if(ShowErrorMessages) console.log(Colors.red('[Middleware.js] Mobile Agent is empty'));
        return;
    }
    if (destiny == "random") {
       var item = getRandomIntInclusive(0,host_list.length - 1);
       destiny = host_list[item];
    }
    var objectS = {origin: hostName, destiny: host_destiny,timeStamp: jsonDate, agentName: agent._name, agentCode: agent, type: KeyAgentStatus[0]};
     //if(ShowInformationMessages) console.log(Colors.yellow('Send agent to Client => ' + host_destiny));
    wsClient.send(Serialize.serialize(objectS),function ack(error) {
        // If error is not defined, the send has been completed, otherwise the error
        // object will indicate what failed.
    });
}


/**
* Send API Notification
* @param  {String} host_destiny
* @private
*/
function sendAPINotification(host_destiny) {
     var message = {data: {status : true}, status: true, type: KeyMiddlewareOperations[0]};
     //NOTE: This operation is being done through the connection of the api with the middleware
    wsServer.clients.forEach(function each(client) {//client !== ws &&
        if (client.readyState === WebSocket.OPEN && client.nickname == host_destiny) {
            client.send(Serialize.serialize(message));
        }
    });
}

/**
* Send Host List
* @param  {String} host_destiny
* @private
*/
function sendHostList(host_destiny) {
    var message = {data: {list: host_list}, type: KeyMiddlewareOperations[1]};
    if(ShowInformationMessages) console.log(Colors.yellow('[Middleware.js] Send Host list to Agent => ' + host_destiny));
    //NOTE: This operation is being done through the connection of the api with the middleware
    wsServer.clients.forEach(function each(client) {//client !== ws &&
        if (client.readyState === WebSocket.OPEN && client.nickname == host_destiny) {
            client.send(Serialize.serialize(message));
        }
    });
}

/**
* Send Host Name
* @param  {String} host_destiny
* @private
*/
function sendHostName(host_destiny) {
    var message = {data : {hostNickName : hostName}, type : KeyMiddlewareOperations[2]};
    if(ShowInformationMessages) console.log(Colors.yellow('[Middleware.js] Send Host nick name to Agent => ' + host_destiny));
    //NOTE: This operation is being done through the connection of the api with the middleware
    wsServer.clients.forEach(function each(client) {//client !== ws &&
        if (client.readyState === WebSocket.OPEN && client.nickname == host_destiny) {
            client.send(Serialize.serialize(message));
        }
    });
}

/**
* Send Device Type
* @param  {String} host_destiny
* @private
*/
function sendDeviceType(host_destiny) {
    var message = {data : {deviceType : DEVICE}, type : KeyMiddlewareOperations[3]};
    if(ShowInformationMessages) console.log(Colors.yellow('[Middleware.js] Send device Type name to Agent => ' + host_destiny));
    //NOTE: This operation is being done through the connection of the api with the middleware
    wsServer.clients.forEach(function each(client) {//client !== ws &&
        if (client.readyState === WebSocket.OPEN && client.nickname == host_destiny) {
            client.send(Serialize.serialize(message));
        }
    });
}

/**
* Validate object from Server and Middleware communication
* @param  {String} data
* @private
*/
function validateObject(data) {
    //console.log(Colors.grey('Data received : ' + data));
    data = data.toString();
    typeof data === 'string';
    data = Serialize.unserialize(data);
    if (data.type) {
        switch(data.type) {
            case KeyRegistryStatus[0]:
                hostName = data.data.nickname;
                if (ShowInformationMessages) console.log(Colors.yellow('[Middleware.js][+] Client name for this device: ' + data.data.nickname));
                if (data.data.list){
                    host_list = Object.keys(data.data.list).map(function(k) {return data.data.list[k] });
                }
                if (ShowInformationMessages) console.log(Colors.blue('[Middleware.js][+] Client list updated'));
                validateComandLine();
                sendAgentStatus();
                //Send Confirmation to Middleware
                //data.type = KeyRegistryStatus[3];
                //wsClient.send(Serialize.serialize(data));
                //Finished
                break;
            case KeyRegistryStatus[1]:
                host_list.push(data.data.nickname);
                if (ShowInformationMessages)  console.log(Colors.blue('[Middleware.js][ADD] Client list updated'));
                break;
            case KeyRegistryStatus[2]:
                host_list.splice(host_list.indexOf(data.data.nickname), 1);
                console.log(Colors.blue('[Middleware.js][REMOVE] Client list updated'));
                break;
             case KeyAgent:
                agent = data.agentCode;
                hasAgent = true;
                agent._api = require('./Api.js');//js-middleware-for-mobile-agents
                var message = {origin: hostName, destiny: data.origin, status: true, description: 'Object received', type : KeyAgentStatus[1]};
                wsClient.send(Serialize.serialize(message), function ack(error) {
                    // If error is not defined, the send has been completed, otherwise the error
                    // object will indicate what failed.
                });
                sendAgentStatus();
                runAgent();
                break;
            case KeyAgentStatus[1]:
                if(data.status) {
                    if (ShowInformationMessages) console.log(Colors.blue('[Middleware.js][+] Agent sended successful: ' + data.description));
                    if(data.origin != hostName) {
                      deleteAgent();

                    }
                }
                break;
            case KeyClientStatus[1]:
                const os = require('os');
                var message = {origin: hostName, destiny: data.origin, data: {
                  middleware_platform: DEVICE,
                  middleware_api_port: MIDDLEWARE_PORT_WORKING,
                  os: os.platform(),
                  os_type: os.type(),
                  hostName: os.hostname()
                } , type : KeyClientStatus[2]};
                wsClient.send(Serialize.serialize(message), function ack(error) {
                    // If error is not defined, the send has been completed, otherwise the error
                    // object will indicate what failed.
                });
                break;
            default:
                 if (ShowErrorMessages) console.error(Colors.red('[Middleware.js][*] MD: Unsupported object type: ', data.type));
                break;
        }
    }
}

/**
* Send Mobile Agent Middleware status to Registry server
* @private
*/
function sendAgentStatus() {
    var message ;
    if (hasAgent){
        message  = {data: {origin: hostName, agentCode: agent }, type: KeyClientStatus[0]};
    } else {
        message  = {data: {origin: hostName, agentCode: '' }, type: KeyClientStatus[0]};
    }
    wsClient.send(Serialize.serialize(message), function ack(error) {
            // If error is not defined, the send has been completed, otherwise the error
            // object will indicate what failed.
        });
}

/**
* Print Menu options
* @private
*/
function printMenu() {
    console.log("[1] Read Agent from file");
    console.log("[2] Run Agent");
    console.log("[3] Move agent on the network");
    console.log("[4] Delete Agent");
}

/**
* Validate option selected
* @param {String} d
* @private
*/
function validateMenu(d) {
    if (menu){
        value = d.toString().trim();
    } else {
        value = action;
    }
    switch(value) {
      case '--menu':
          printMenu();
          break;
      case '--version':
          console.log(VERSION);
          break;
      case '--help':
          console.log('Options:');
          console.log('-a [agent.js]\t\tLoad and run the mobile agent');
          console.log('-h [hostName]\t\tSend the import agent to specific host');
          console.log('--help\t\tShow commands options');
          console.log('--menu\t\tShow the main menu');
          console.log('--status\t\tShow status Middleware');
          console.log('--version\tShow the Middleware.js version');
          break;
      case '--status':
          console.log('Host name :\t' + hostName);
          console.log('Agent status:\t' + hasAgent);
          break;
        case '1':
            if (menu) {
                menu = false;
                action = '1';
                console.log(Colors.blue('Write the file name Agent with .js'));
                return;
            }
            var filename = d.toString().trim();
            readAgentFromFile(filename);
            menu = true;
            action = 0;
            break;
        case'2':
            runAgent();
            break;
        case '3':
            if (agent == undefined) {
                console.log(Colors.red('Mobile Agent is empty'));
                return;
            }
            if (menu) {
                menu = false;
                action = '3';
                console.log(Colors.blue('There are the following Middleware:'));
                Object.keys(host_list).forEach(function(index) {
                    if (host_list[index] == hostName) {
                        console.log(host_list[index] + ' => [ME]');
                    } else {
                        console.log(host_list[index]);
                    }
                });
                console.log(Colors.blue('Write the Host name'));
                return;
            }
            var host = d.toString().trim();
            var indexSelected = -1;
            try {
                Object.keys(host_list).forEach(function(index) {
                    if (host == host_list[index]) {
                        indexSelected = index;
                    }
                });
                if (indexSelected == -1){
                    console.log(Colors.red('[-] Not found destiny'));
                    menu = true;
                    return;
                }
                sendAgent(host_list[indexSelected]);
                menu = true;
            } catch (e) {
                console.log(Colors.red(e));
            }
            menu = true;
            action = 0;
            break;
        case '4':
            deleteAgent();
            break;
    }
}

/**
* Connection with Registry Server
* @param {Object} options
* @private
*/
function clientWebSocket(options) {
    wsClient = new WebSocket('ws://' + options.host + ':' + options.port, {
        origin: 'http://'+options.host + ':' + options.port
    });
    wsClient.on('open', function open() {
        if (ShowInformationMessages) console.log(Colors.blue('[Middleware.js][+] Connected to Registry Server '+ options.host + ':' + options.port + ' successful' ));
    });

    wsClient.on('close', function close() {
        if (ShowInformationMessages) console.log(Colors.red('[Middleware.js][-] Client disconnected'));
    });
    wsClient.on('message', function incoming(data) {
        validateObject(data);
    });
    wsClient.on('error', (e) => {
        if (e.code === 'ECONNREFUSED') {
            //console.log(Colors.red('[*] Has been lost the connection with the server'));
            if (ShowErrorMessages)  console.log(Colors.red('[Middleware.js][-] Registry Server not response ' + options.host + ':' + options.port + ', retrying...'));
            setTimeout(() => {
                wsClient.terminate();
                clientWebSocket(options);
            }, 1000);
        }
    });
}

/**
* Start a Web socket service for Api communication
* @param {NUMBER} next_port
* @private
*/
function startMiddlewareSocket(next_port) {
    wsServer = new WebSocket.Server({port: MIDDLEWARE_PORT[next_port]}, function() {
        //if (ShowInformationMessages)
        MIDDLEWARE_PORT_WORKING = MIDDLEWARE_PORT[next_port];
        console.log(Colors.green('[Middleware.js][*] Middleware running on http://' + MIDDLEWARE_HOST + ":" + MIDDLEWARE_PORT[next_port]));
    });

    /*
    function noop() {}

    function heartbeat() {
		    this.isAlive = true;
	  }
  	const interval = setInterval(function ping() {
  		wsServer.clients.forEach(function each(ws) {
  	    if (ws.isAlive === false){
  	    	return ws.terminate();
  	    }
  	    ws.isAlive = false;
          ws.ping('', false, true);
          //ws.ping(noop); -> not works
  	  });
  	}, 20000);
*/

    wsServer.on('connection', function connection(socket) {
        connectionProcessAPI(socket);
        socket.on('message', function incoming(data) {
            validateObjectAPI(data);
        });
        socket.on('close', function () {
            closeProcessAPI(socket);
        });
    });

    wsServer.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
            //if (ShowWarningMessages)  console.log(Colors.red('[-] Error to run the Middleware, port ' + MIDDLEWARE_PORT[next_port] + ' in use'));
            setTimeout(() => {
                wsServer.close();
                try {
                    //if (ShowWarningMessages)  console.log(Colors.yellow('trying on another port'));
                    if (next_port + 1 > (MIDDLEWARE_PORT.length-1)) {
                        //if (ShowErrorMessages) console.log(Colors.red('Finished max number of attempts to run the middleware'));
                        process.exit(0);
                    }
                    startMiddlewareSocket(next_port + 1);
                }catch(err) {
                    console.log('ERROR :' + err);
                }
            }, 1000);
      }
    });
}

/**
* Middleware Connection Function
* @param {Object} socket
* @private
*/
function connectionProcessAPI(socket) {
    socketNum++;
    socket.nickname = "Agent# " + socketNum;
    middlewareClients[socket.nickname] = socket ;
    middlewareClientsList.push(socket.nickname);
    // For new Middleware versions
    var data = {data : {nickname: socket.nickname , clientNum: socketNum, list: host_list, hostNickName: hostName}, status: true, type: KeyMiddlewareStatus[0]};
    socket.send(Serialize.serialize(data));

    /*
    For Notifiy to all api about a new api connected to middleware
    // Broadcast to everyone else.
    var message = {data : {nickname: socket.nickname , clientNum : socketNum},type: KeyMiddlewareStatus[1]};
        wsServer.clients.forEach(function each(client) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(Serialize.serialize(message));
          }
        });
    */
    if (ShowInformationMessages) console.log(Colors.magenta("[Middleware.js] " + socket.nickname + " connected "));
}

/**
* Middleware Close Function
* @param {Object} socket
* @private
*/
function closeProcessAPI(socket) {
    delete middlewareClients[socket.nickname];
    if (ShowInformationMessages) console.log(Colors.red('[Middleware.js] Agent disconnected : '+ socket.nickname));
    middlewareClientsList.splice(middlewareClientsList.indexOf(socket.nickname), 1);

    /*For Notify to all api about a api has been disconnected
    var message = {data : {nickname: socket.nickname , clientNum : socketNum}, status : true ,type: KeyMiddlewareStatus[2]};
    wsServer.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(Serialize.serialize(message));
      }
    });
    delete registryClientsList[socket.nickname];
    */
}

/**
* Validate Communicaion object between Midleware and Api
* @param {String} data
* @private
*/
function validateObjectAPI(data) {
    data = data.toString();
    typeof data === 'string';
    data = Serialize.unserialize(data);
    if (data.type) {
        switch(data.type) {
            case KeyMiddlewareOperations[0]:
                hasAgent = true;
                agent = data.data.agent;
                agent._api = undefined; // require('./Api.js');
                sendAgentStatus();
                sendAgent(data.data.destiny);
                //this must when the middleware response that the mobileAgent was sended
                sendAPINotification(data.data.origin);
                break;
            case KeyMiddlewareOperations[1]:
                sendHostList(data.data.origin);
                break;
            case KeyMiddlewareOperations[2]:
                sendHostName(data.data.origin);
                break;
            case KeyMiddlewareOperations[3]:
                sendDeviceType(data.data.origin);
                break;
            default:
                if (ShowErrorMessages) console.error(Colors.red('[Middleware.js][*] API: Unsupported API object type: ', data.type));
                break;
        }
    }

}

//Library for comunication
//var net = require('net');
//var server;
//startServerNet();

/* For new Middleware versions
function clientNet(){
    var clientMiddleware = new net.Socket();
    clientMiddleware.connect(REGISTRY_PORT, REGISTRY_HOST, function() {
        //console.log('Connected');
    });
    clientMiddleware.on('data', function(data) {
        ValidateObject(data);
    });
    clientMiddleware.on('error', (e) => {
          if (e.code === 'ECONNREFUSED') {
            console.log(Colors.red('[-] Server not response' + REGISTRY_HOST + ' :' + REGISTRY_PORT + ', retrying...'));
            setTimeout(() => {
              clientMiddleware.destroy();
              clientMiddleware.connect(REGISTRY_PORT, REGISTRY_HOST);
            }, 1000);
          }
        });
}
*/
/*
function startServerNet(){
    server = net.createServer(function(socket) {
        connectionProcess(socket);
        socket.on('close', function() {
            console.log('The client has been disconnected');
            closeProcess(socket);
        });
        socket.on("end", function() {
            console.log('The client has been disconnected');
        });
        socket.on('data', function(data) {
            validateObject(data);
        });
    });
    server.on('connection', function() {
        console.log('New Api client connected');
    });
    server.on('error', (e) => {
          if (e.code === 'EADDRINUSE') {
            console.log(Colors.red('[-] Error to run the Middleware service, port in use'));
            //process.exit(0);
            setTimeout(() => {
                server.close();
                try {
                    server.listen(MIDDLEWARE_PORT, MIDDLEWARE_HOST);
                }catch(err) {
                    console.log('ERROR :' + err);
                }
            }, 1000);
          }
        });
    server.listen(MIDDLEWARE_PORT, function() {
        console.log(Colors.green('[*] Server Net running on http://' + MIDDLEWARE_HOST + ":" + MIDDLEWARE_PORT));
    });
}
*/
