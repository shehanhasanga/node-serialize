var _name = "Carlos Silva";

exports.helloWorld = function () {
  console.log("Test Done, " + _name);
}
exports.setName = function (name) {
  this._name = name;
}
