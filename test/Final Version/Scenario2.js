exports.runAgent = function() {
  /*
  * Custom Code begin
  */
  this._name = "Scenario 002";
  var agent = this;
  console.log("Hello, World!");
  var host;
  var api = this._api;
  setTimeout(function() {
      api.getRandomHost(function(err, result) {
          if (err) {
            console.log('Error: ' + err);
          } else {
            host = result;
                api.moveTo(agent, host, function(err, result) {
                  if (err) {
                    console.log('Error: ' + err);
                  } else {
                    console.log('\033[2J');
                  }
                });
          }
      });
  },5000);
  /*
  * Custom code end
  */
};
