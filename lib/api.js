/*!
 * JS-Middleware-for-mobile-agents
 * Copyright(c)
 * Copyright(c)
 * MIT Licensed
 */

//Library for comunication
//var net = require('net');
//Library for Web socket
const WebSocket = require('ws');
//Library for Serialize
var Serialize = require('node-serialize');
//Library for color to console
var Colors = require('colors');
//Variable for status
var APIName = '';

//Configuration variables
const VERSION = '0.0.1';
const MIDDLEWARE_HOST = '127.0.0.1';
const MIDDLEWARE_PORT = [4040, 4041, 4042];
const KeyMiddlewareStatus = ['registerConnectionAPI', 'confirmConnectionAPI', 'deleteConnectionAPI'];
const KeyMiddlewareOperations = ['sendAgentFromAPI', 'getAvailableHost', 'getHostName', 'getDeviceType'];

var status = true;
//var wsClient = undefined;
var host_list = [];
//var agent_list = [];
var hostName = '';

var ShowInformationMessages = true;
var ShowWarningMessages = true;
var ShowErrorMessages = true;

/**
*Test module importation
* @public
*/
exports.helloWorld = function () {
  console.log("Test Done, successful");
}

/**
* Move the Mobile Agent to another device
* @param {Object} agentObject
* @param {String} host_destiny
* @param {Function} callback
* @public
*/
exports.moveTo = function(agentObject,host_destiny,callback) {
	var message = {data: {destiny: host_destiny, agent : agentObject}, status: true , type: KeyMiddlewareOperations[0]};
    var wsClient = new WebSocket('ws://' + MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0], {
        origin: 'http://'+MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0]
    });
	if (wsClient) {
        startMiddlewareConnection(callback, 0, message, wsClient);
    }
};

/**
* Show the Available host list
* @param {Function} callback
* @public
*/
exports.getAvailableHosts = function(callback) {
   var message = {data: {origin: APIName}, type: KeyMiddlewareOperations[1]};
    var wsClient = new WebSocket('ws://' + MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0], {
        origin: 'http://'+MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0]
    });
    if (wsClient) {
        startMiddlewareConnection(callback, 0, message, wsClient);
    }
};

/**
*
*/
exports.getDeviceType = function(callback) {
    var message = {data : {origin: APIName}, type: KeyMiddlewareOperations[3]};
    var wsClient = new WebSocket('ws://' + MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0], {
        origin: 'http://'+MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0]
    });
    if (wsClient) {
        startMiddlewareConnection(callback, 0, message, wsClient);
    }
};

/**
* Return the host name asigned to this device
* @param {Function} callback
* @public
*/
exports.getHostName = function(callback) {
    var message = {data : {origin: APIName}, type: KeyMiddlewareOperations[2]};
    var wsClient = new WebSocket('ws://' + MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0], {
        origin: 'http://'+MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[0]
    });
    if (wsClient) {
        startMiddlewareConnection(callback, 0, message, wsClient);
    }
};

/**
* Return a random Host name
* @param {Function} callback
* @public
*/
exports.getRandomHost = function(callback) {
    this.getAvailableHosts(function(err,result) {
        if (err) {
        callback(err, null);
        } else {
            var item = getRandomIntInclusive(0,host_list.length - 1);
            callback(null,host_list[item]);
        }
    });

};

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
* Connection with the JS-Middleware
* @param {Function} callback
* @param {object} mobileAgent
* @param {String} next_port
* @param {String} message
* @public
*/
function startMiddlewareConnection(callback, next_port, message, wsClient) {
    wsClient.on('open', function open() {
        //if (ShowInformationMessages)
        console.log(Colors.blue('[API.js][+] Connected to Middleware '+ MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[next_port] + ' successful' ));
    });
    wsClient.on('message', function incoming(data) {
        validateObject(data, callback, message, wsClient);
    });
    wsClient.on('close', function close() {
        if (ShowErrorMessages) console.log(Colors.red('[API.js][-] Lost connection with the Middleware'));
    });
    wsClient.on('error', (e) => {
        if (e.code === 'ECONNREFUSED') {
            if(ShowWarningMessages) console.log(Colors.red('[API.js][-] Middleware not response ' + MIDDLEWARE_HOST + ':' + MIDDLEWARE_PORT[next_port] + ', retrying in another port...'));
            setTimeout(() => {
                //wsClient.terminate();
                if (next_port + 1 > (MIDDLEWARE_PORT.length - 1)) {
                    if (ShowErrorMessages) console.log(Colors.red('[API.js] Finished max number of attempts to connect the middleware'));
                    process.exit(0);
                }
                startMiddlewareConnection(callback, next_port + 1, message, wsClient);
            }, 1000);
        }
    });

}

/**
* Validate Communicaion object between Midleware and Api
* @param {String} data
* @param {Function} callback
* @param {Object} message
* @param {WebSocket} wsClient
* @private
*/
function validateObject(data, callback, message, wsClient) {
    data = data.toString();
    typeof data === 'string';
    data = Serialize.unserialize(data);
    if (data.type) {
        switch(data.type) {
        	case KeyMiddlewareStatus[0]:
        		APIName = data.data.nickname;
                host_list = Object.keys(data.data.list).map(function(k) { return data.data.list[k] });
                hostName = data.data.hostNickName;
                if (ShowInformationMessages) console.log(Colors.yellow('[API.js][+] Client name for this API instance: ' + APIName));
                //Send information after connection
                message.data.origin = APIName;
                //console.log("Agent asigned: " + APIName + " Type sent: " + message.type);
                wsClient.send(Serialize.serialize(message), function(error) {
                    // Do something in here here to clean things up (or don't do anything at all)
                    //console.log(error);
                });
        		break;
            case KeyMiddlewareOperations[0]:
                if (data.data.status) {
                    wsClient.terminate();
                    callback(null,'[API.js]Agent sent succesfull to other device');
                }

                break;
            case KeyMiddlewareOperations[1]:
            //For new version, this work how middleware list cache
                if (data.data.list) {
                    wsClient.terminate();
                    host_list = Object.keys(data.data.list).map(function(k) { return data.data.list[k] });
                    callback(null,host_list);
                }
                break;
            case KeyMiddlewareOperations[2]:
                if (data.data.hostNickName) {
                    wsClient.terminate();
                    hostName = data.data.hostNickName;
                    callback(null,hostName);
                }
                break;
            case KeyMiddlewareOperations[3]:
                if (data.data.deviceType) {
                    wsClient.terminate();
                    callback(null, data.data.deviceType);
                }
                break;
								/*
            case KeyMiddlewareStatus[1]:
                agent_list.push(data.data.nickname);
                if (ShowInformationMessages) console.log(Colors.blue('[API.js][ADD] Agents list updated'));
                break;
            case KeyMiddlewareStatus[2]:
                agent_list.splice(agent_list.indexOf(data.data.nickname), 1);
                if (ShowInformationMessages) console.log(Colors.blue('[API.js][REMOVE] Agents list updated'));
                break;
								*/
            default:
                if (ShowErrorMessages) console.error(Colors.red('[API.js][*]API: Unsupported object type: ', data.type));
                    wsClient.terminate();
                    callback('[API.js][*] Unsupported object type: ',null)
                break;
        }
    }
}


//clientNet();
/*
//clientApi.write(Serialize.serialize(message));

//var message = {data : {origin: hostName}, status : true ,type: KeyMiddlewareOperations[1]};
    //wsClient.send(Serialize.serialize(message));
    //clientApi.write(Serialize.serialize(message));


// For new Middleware versions
function clientNet(){
    clientApi = new net.Socket();
    clientApi.connect(MIDDLEWARE_PORT, MIDDLEWARE_HOST, function() {
        //console.log('Connected');
    });
    clientApi.on('data', function(data) {
        ValidateObject(data);
    });
    clientApi.on('error', (e) => {
          if (e.code === 'ECONNREFUSED') {
            console.log(Colors.red('[-] Server not response' + MIDDLEWARE_HOST + ' :' + MIDDLEWARE_PORT + ', retrying...'));
            setTimeout(() => {
              clientApi.destroy();
              clientApi.connect(MIDDLEWARE_PORT, MIDDLEWARE_HOST);
            }, 1000);
          }
        });
}
*/
