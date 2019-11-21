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
