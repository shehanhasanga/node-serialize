var agent = {
	name : 'Example 1',
	type : 'Agent',
	 runAgent: function() {
		console.log('Example 001');
	 	this.name = 'World';
	 	console.log('Hello,' + this.name);
	 }
	};
module.exports = agent;