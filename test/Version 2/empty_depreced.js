
exports.runAgent = function(callback){
	console.log('\033[2J');

	console.log('Hello World!');

	if(a==1){ //Custom condition
		this.moveDevices = function(){
			return "Host# 4";
		};
	};


	setTimeout(function(){
		callback(null,true);
	},3000);

	//Miercoles 10AM(EC) next meeting


};
/*
exports.codeLUA = function(){
	varchar(20) hello = ""
};
*/
exports.moveDevices = function(){
	return "Host# 3"; // return Host# 4
};
