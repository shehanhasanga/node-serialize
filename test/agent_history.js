//Last Version 
var agent ={};
agent.runAgent = function(callback){
	console.log('Hello World!');
	setTimeout(function(){
		callback(null,true);
	},3000);

};
agent.moveDevices = function(){
	return "random";
};
module.exports = agent;

//version 003
exports.runAgent = function(){
	console.log('Example 001 with API');
	var api = require('js-middleware-for-mobile-agents');
	api.moveTo(this,'Host# 1',function(err,result){
      if (err){
        console.log('Error: ' + err);
      } else {
        console.log('Result: ' + result);
      }
  	});
};
this.runAgent();

//Version 002
var agent = {
	name : 'Example 1',
	type : 'Agent',
	 runCode: function() {
	 	console.log('Start');
        this.api = require('./api.js');
        this.api.moveTO('127.0.0.0',this);
	 }
    };
agent.runCode();

//Version 001
function MobileAgent() {
  this.name = '';
  this. apelido = '';
};
MobileAgent.prototype.runCode = function() {
 	console.log('I am a mobile agent');
 	this.name = 'Carlos silva';
	console.log("Hello "+ this.name + ' ' + getApellido());
}
function getApellido(){
	var ape = 'Silva';
	return ape;
}
module.exports = new MobileAgent();





//module.exports = agent;

//var api = require('js-middleware-for-mobile-agents');
//api.executeAgent();


