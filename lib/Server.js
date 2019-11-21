/*!
 * JS-Middleware-for-mobile-agents
 * Copyright(c)
 */

//Library for Web socket
const WebSocket = require('ws');
//Library for Serialize
var Serialize = require('node-serialize');
//Library for color to console
var Colors = require('colors');
//Library for File System operations
//const Fs = require('fs');
//library for print objects
const Util = require('util');
//Variables Configuration
const VERSION = '0.0.1';
const REGISTRY_HOST = '127.0.0.1';

/**
* Middleware section
*/
var REGISTRY_PORT = 4045;

var wsServer;
var socketNum = 0;

var registryClientsInfo = Object.create(null);
var registryClientsList = [];
const KeyRegistryOperations = ['getMiddlewareList', 'setMiddlewareList', 'getFrameworkList', 'setFrameworkList'];
const KeyRegistryStatus = ['registeredHost', 'newConnectionHost', 'newDisconnectionHost', 'registeredHostConfirmation'];
const KeyClientStatus = ['infoAgent', 'getMiddlewareInfo', 'setMiddlewareInfo', 'getFrameworkInfo', 'setFrameworkInfo', 'infoFramework'];
const KeyAgentStatus = ['sendAgent', 'receivedAgent', 'infoTrackAgent'];
const KeyAgent = 'Agent';

/**
* Framework section
*/
var REGISTRY_PORT_FRAMEWORK = 4005;
var wsServerFramework;
var socketFrameworkNum = 0;
var registryFrameworksInfo = Object.create(null);
var registryFrameworksList = [];
const KeyFrameworkStatus = ['registeredFramework', 'newConnectedFramework', 'newDisconnectionFramework'];
const KeyFrameworkOperations = ['sendAgentCode', 'validateAgent','receivedAgentConfirmation'];

var ShowInformationMessages = true;
var ShowWarningMessages = true;
var ShowErrorMessages = true;
var menu = true;
var action = 0;
var stdin = process.openStdin();

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
          case '-framework-port':
            REGISTRY_PORT_FRAMEWORK = process.argv[i + 1];
            break;
          default:
              console.log('');
        }
    }
  }
  startServerSocket({host: REGISTRY_HOST, port: REGISTRY_PORT});
  startServerSocketFramework({host: REGISTRY_HOST, port: REGISTRY_PORT_FRAMEWORK});

/**
* Start Registry Server
* @param {Object} data
* @param {Function} callback
* @public
*/
exports.start = function(options,callback) {
    options = Object.assign({
      host: REGISTRY_HOST,   // use default
      port: REGISTRY_PORT    // use default
    }, options);

    if (options.port == null) {
      throw new TypeError('missing or invalid options');
    }
    if (options.port != null) {
        startServerSocket(options);
    }
}

/**
* Start Registry Server
* @param {Object} options
* @private
*/
function startServerSocket(options) {
    wsServer = new WebSocket.Server({ port: options.port }, function() {
        if(ShowInformationMessages) console.log(Colors.green('[*] Registry Server running on http://' + options.host + ":" + options.port));
    });

    wsServer.on('connection', function connection(socket, req) {
    	connectionProcess(socket, req);
        socket.on('message', function incoming(data) {
            //console.log('Client response => %s', data);
            validateObject(data);
        });
        socket.on('close', function () {
            closeProcess(socket);
        });
    });

    wsServer.on('connection', function connection(ws, req) {
      var ip = req.connection.remoteAddress;
      console.log(Colors.blue('[+] Connected from: ' + ip ));
    });

    wsServer.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        if (ShowErrorMessages) console.log(Colors.red('[-] Error to run Registry Server, port ' + options.port + ' in use'));
            setTimeout(() => {
                wsServer.close();
                try {
                    startServerSocket(options);
                    //process.exit(0);
                }catch(err) {
                    console.log('ERROR :' + err);
                }
            }, 1000);
      }
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
        //ws.ping(noop);
      });
    }, 20000);
    */
}

/**
* Send to client the number host asigned.
* @param {Object} socket
* @private
*/
function connectionProcess(socket, req) {
    //const ip = req.connection.remoteAddress;
    socketNum++;
    socket.nickname = "Host# " + socketNum +'(' + req.connection.remoteAddress + ')';

    registryClientsInfo[socket.nickname] = socket ;
    registryClientsList.push(socket.nickname);

    var data = {data: {nickname: socket.nickname, clientNum: socketNum, list: registryClientsList}, type: KeyRegistryStatus[0]};
    socket.send(Serialize.serialize(data));
    // Broadcast to everyone else.
    var message = {data : {nickname: socket.nickname, clientNum: socketNum}, type: KeyRegistryStatus[1]};
        wsServer.clients.forEach(function each(client) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(Serialize.serialize(message));
          }
        });
        var data = {data: {nickname: socket.nickname}, status: true, type: KeyRegistryStatus[1]};
        wsServerFramework.clients.forEach(function each(client) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(Serialize.serialize(data));
          }
        });
    if (ShowInformationMessages) console.log(Colors.magenta(socket.nickname + " connected "));

}

/**
* Send to Server clients that a host has been disconnected
* @param {Object} socket
* @private
*/
function closeProcess(socket) {
    delete registryClientsInfo[socket.nickname];
    registryClientsList.splice(registryClientsList.indexOf(socket.nickname), 1);   //delete registryClientsList[socket.nickname];

    var message = {data: {nickname: socket.nickname , clientNum: socketNum}, status: true, type: KeyRegistryStatus[2]};
    wsServer.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(Serialize.serialize(message));
      }
    });

    var data = {data: {nickname: socket.nickname}, status: true, type: KeyRegistryStatus[2]};
    wsServerFramework.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(Serialize.serialize(data));
      }
    });
    console.log(Colors.red('Host desconnected : '+ socket.nickname));
}

/**
* Validate the object data sended between clients
* @param {Object} data
* @private
*/
function validateObject(data) {
    data = data.toString();
    typeof data === 'string';
    data = Serialize.unserialize(data);
    if (data.type) {
        switch(data.type) {
            case KeyRegistryStatus[3]: //Delete Mobile api connection from all registers
                var data = {nickname : data.nickname};
                closeProcess(data);
                break;
            case KeyAgentStatus[0]:
            //sent to all framework infor about agent moving
            wsServerFramework.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    data.type = KeyAgentStatus[2];
                    client.send(Serialize.serialize(data));
                }
            });
                wsServer.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        data.type = KeyAgent;
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            case KeyAgentStatus[1]:
                wsServer.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
                //Send Framework that the agent has been sent
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            case KeyClientStatus[0]:
                //Set information from middleware about agent
                registryClientsInfo[data.data.origin] = data.data;
                //Notify all framework about agent status
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            case KeyClientStatus[2]:
                wsServerFramework.clients.forEach(function each(client) {//client !== ws &&
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            default:
                if (ShowErrorMessages) console.error(Colors.red('[*] Unsupported object type: ', data.type));
                break;
        }
    }
}

/**
* Start Registry Server
* @param {Object} options
* @private
*/
function startServerSocketFramework(options) {
    wsServerFramework = new WebSocket.Server({ port: options.port }, function() {
        if(ShowInformationMessages) console.log(Colors.green('[*] Registry Server Framework running on http://' + options.host + ":" + options.port));
    });

    wsServerFramework.on('connection', function connection(socket, req) {
    	connectionProcessFramework(socket, req);
        socket.on('message', function incoming(data) {
            validateObjectFramework(data);
        });
        socket.on('close', function () {
            closeProcessFramework(socket);
        });
    });

    wsServerFramework.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        if (ShowErrorMessages) console.log(Colors.red('[-] Error to run Registry Server Framework, port ' + options.port + ' in use'));
            setTimeout(() => {
                wsServerFramework.close();
                try {
                    startServerSocketFramework(options);
                    //process.exit(0);
                }catch(err) {
                    console.log('ERROR :' + err);
                }
            }, 1000);
      }
    });
    /*
    function noop() {}
    function heartbeat() {
      this.isAlive = true;
    }

    wsServerFramework.on('connection', function connection(ws) {
      ws.isAlive = true;
      ws.on('pong', heartbeat);
    });

    const interval = setInterval(function ping() {
      wsServerFramework.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping('', false, true);
        //ws.ping(noop); -> not works
      });
    }, 20000);
    */
}


/**
* Send to client the number host asigned.
* @param {Object} socket
* @private
*/
function connectionProcessFramework(socket, req) {
    //const ip = req.connection.remoteAddress;
    socketFrameworkNum++;
    socket.nickname = "Framework# " + socketFrameworkNum +'(' + req.connection.remoteAddress + ')';
    registryFrameworksInfo[socket.nickname] = socket ;
    registryFrameworksList.push(socket.nickname);

    //, listInfoMiddleware: registryClientsInfo
    var data = {data: {nickname: socket.nickname , listInfoMiddleware: Util.inspect(registryClientsInfo, {showHidden: true, depth: null}), FrameworkNum: socketFrameworkNum, listMiddleware: registryClientsList, listFramework: registryFrameworksList}, type: KeyFrameworkStatus[0]};
    socket.send(Serialize.serialize(data));
    // Broadcast to everyone else.
    var message = {data : {nickname: socket.nickname , FrameworkNum : socketFrameworkNum},type: KeyFrameworkStatus[1]};
        wsServerFramework.clients.forEach(function each(client) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(Serialize.serialize(message));
          }
        });
    if (ShowInformationMessages) console.log(Colors.magenta(socket.nickname + " connected "));
}

/**
* Send to Server clients that a host has been disconnected
* @param {Object} socket
* @private
*/
function closeProcessFramework(socket){
    delete registryFrameworksInfo[socket.nickname];
    registryFrameworksList.splice(registryFrameworksList.indexOf(socket.nickname), 1);
    var message = {data : {nickname: socket.nickname , FrameworkNum: socketFrameworkNum}, status: true , type: KeyFrameworkStatus[2]};
    wsServerFramework.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(Serialize.serialize(message));
      }
    });
    console.log(Colors.red('Framework desconected : '+ socket.nickname));
}

/**
* Validate the object data sended between clients
* @param {Object} data
* @private
*/
function validateObjectFramework(data) {
    data = data.toString();
    typeof data === 'string';
    data = Serialize.unserialize(data);
    if (data.type) {
        switch(data.type) {
            case KeyClientStatus[1]:
            //var message = {origin: hostName, destiny: data.origin, data: {os:"macOS", ip: "192.168.1.0" } , type : KeyClientStatus[2]};
                wsServer.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            case KeyClientStatus[3]:
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
                break;
            case KeyClientStatus[4]:
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });
            case KeyClientStatus[5]:
                //set information from middleware about agent
                registryFrameworksInfo[data.data.nickname] = data.data;
                break;
            case KeyRegistryOperations[0]:
                var message = {list: registryClientsList , type : KeyRegistryOperations[1]};
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.origin ) {
                        client.send(Serialize.serialize(message));
                    }
                });
                break;
            case KeyRegistryOperations[2]:
                var message = {list: registryFrameworksList, type : KeyRegistryOperations[3]};
                wsServerFramework.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.origin ) {
                        client.send(Serialize.serialize(message));
                    }
                });
                break;
            case KeyFrameworkOperations[0]:
                data.type = KeyAgent;
                wsServer.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                        client.send(Serialize.serialize(data));
                    }
                });

                /*
                Fs.writeFile('./lib/code/backupAgent_001.js' , data.agentCode, function (err) {
                  if (err) {
                    console.log("Write failed: " + err);
                    return;
                  }
                  try {
                    var agent = require('./code/backupAgent_001.js');
                    agent.runAgent();

                    data.type = KeyFrameworkOperations[1];
                    wsServerFramework.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN && client.nickname == data.origin ) {
                            client.send(Serialize.serialize(data));
                        }
                    });


                    data.type = KeyAgent;
                    wsServer.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN && client.nickname == data.destiny ) {
                            client.send(Serialize.serialize(data));
                        }
                    });

                  } catch (e){

                      if (ShowErrorMessages) console.log(Colors.red('[middleware.js][-] Error to import Mobile Agent') + e);
                      return;
                  }

                });
                */

                break;
            default:
                if (ShowErrorMessages) console.error(Colors.red('[*] Unsupported object type: ', data.type));
                break;
        }
    }
}

/**
* Show option menu to do operations
* @private
*/
function printMenu(){
    console.log("[1] Show Middleware connected");
    console.log("[2] Show Frameworks connected");
}

/**
* Validate option selected
* @param {String} d
* @private
*/
function validateMenu(d){
    if (menu) {
        value = d.toString().trim();
    } else {
        value = action;
    }
    switch(value) {
        case '1':
            console.log(Colors.blue('[*] There are the following Middleware connected'));
            Object.keys(registryClientsInfo).forEach(function (key) {
                console.log('\t' + key + ' => ' +  Util.inspect(Serialize.serialize(registryClientsInfo[key]), {showHidden: true, depth: null}));
            });
            /*
            for (var key in registryClientsInfo) {
                console.log(key + ' => ' + Util.inspect(registryClientsInfo[key], {showHidden: true, depth: null}));
            }
            */
            break;
        case '2':
            console.log(Colors.blue('[*] There are the following Frameworks connected'));
            Object.keys(registryFrameworksInfo).forEach(function (key) {
                console.log('\t' + key + ' => ' +  Util.inspect(Serialize.serialize(registryFrameworksInfo[key]), {showHidden: true, depth: null}));
            });
            break;
        default:
            break;
    }
    validateComandLine(value);
}

/**
* Show value option selected
* @param {String} value
* @private
*/
function validateComandLine(value) {
    switch(value) {
        case '--menu':
            printMenu();
            break;
        case '--version':
            console.log('v' + VERSION);
            break;
        case '--help':
            console.log('Options:');
            console.log('--help\t\tShow commands options');
            console.log('--menu\t\tShow the main menu');
            console.log('--version\tShow the Server.js version');
            break;
        case '--test' :
            try {
                var agent = require('./code/backupAgent_001.js');
                agent.runAgent();
              } catch (e){

                  if (ShowErrorMessages) console.log(Colors.red('[Server.js][-] Error to import Mobile Agent') + e);
                  return;
              }
              break;
        default:
            console.log('');
    }
}



/* Middleware and Server Connection through Net library
//var net = require('net');
var server;
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
        console.log('New client has been connected for send Agent');
    });
    server.on('error', (e) => {
          if (e.code === 'EADDRINUSE') {
            console.log(Colors.red('[-] Error to run the Middleware, port in use'));
            //process.exit(0);
            setTimeout(() => {
                server.close();
                try {
                    server.listen(REGISTRY_PORT, REGISTRY_HOST);
                }catch(err) {
                    console.log('ERROR :' + err);
                }
            }, 1000);
          }
        });
    server.listen(REGISTRY_PORT, function() {
        console.log(Colors.green('[*] Server Net running on http://' + REGISTRY_HOST + ":" + REGISTRY_PORT));
    });
}
*/
/*
	wsServer.broadcast = function broadcast(data) {
	  wsServer.clients.forEach(function each(client) {
	    if (client.readyState === WebSocket.OPEN ) {

	      client.send(data);
	    }
	  });
	};
*/
