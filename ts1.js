var serialize = require('node-serialize');
var objS = '{"name":"sheha","say":"_$$ND_FUNC$$_function() {return \'hi \' + this.name;}"}'
console.log(serialize.unserialize(objS));
console.log(serialize.unserialize(objS).say());
