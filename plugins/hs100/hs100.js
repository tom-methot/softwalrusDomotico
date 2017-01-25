
exports.action = function(data, callback, config, SARAH){
  
  // Retrieve config
  config = config.modules.hs100;
  
  var Hs100Api = require('hs100-api');
 
  var client = new Hs100Api.Client();
  var plug = client.getPlug({host: '192.168.0.100'});
  //plug.getInfo().then(console.log);

  var state = data.state;
  console.log(state);
  
  if (state != null) {
    plug.setPowerState(state == 'on');
  }
  
  callback({'tts': 'Voila, ces fait'});
}


