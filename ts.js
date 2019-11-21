var serialize = require('node-serialize');
console.log('shehan');
var obj = {
    name: 'Bob',
    say: function() {
      return 'hi ' + this.name;
    }
  };

  obj.name="sheha";
  
  var objS = serialize.serialize(obj);
  console.log(objS);
  typeof objS === 'string';
serialize.unserialize(objS).say() === 'hi Bob';