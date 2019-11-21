exports.runAgent = function() {
  /*
  * Custom Code begin
  */
  this._name = "Scenario 003";
  //this._macList = "";
  console.log("Mobile Agent running...");
  var hostList = ["Host# 1(::ffff:192.168.0.101)", "Host# 2(::ffff:192.168.0.103)", "Host# 3(::ffff:192.168.0.106)", "Host# 4(::ffff:192.168.0.105)", "Host# 5(::ffff:192.168.0.102)"];
  var api = this._api;
  var lastHost = this._lastHost;
  var newhost = 0;
  if (lastHost != NaN && lastHost != undefined) {
    newhost = (lastHost + 1);
  }
  this._lastHost = newhost;
  var macList ;//= this._macList;
  var next_host = hostList[newhost];
  var agent = this;
  require('getmac').getMac(function(err, macAddress){
    if (err)  throw err
        if (agent._macList == undefined) {
          macList =  macAddress;
        } else {
          macList = agent._macList + " | " + macAddress;
        }
        agent._macList = macList;
            if (newhost == (hostList.length)) {
              console.log("MACs List");
              console.log(macList);
            } else {
              setTimeout(function() {
                api.moveTo(agent, next_host, function(err, result) {
                  if (err) {
                    console.log('Error: ' + err);
                  } else {
                    console.log('\033[2J');
                  }
                });
             },5000);
         }
  });
  /*
  * Custom code end
  */
};
