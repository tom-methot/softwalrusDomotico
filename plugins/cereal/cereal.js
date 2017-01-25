
exports.action = function(data, callback, config, SARAH){
  
  // Retrieve config
  config = config.modules.cereal;
  
  var Hs100Api = require('hs100-api');
 
  var client = new Hs100Api.Client();
  var plug = client.getPlug({host: '192.168.0.126'});
  
  var state = data.state; 
  
  if (state != null) {
    if (state == 'on') {
      plug.setPowerState(true).then(function(){
        sleep(15000);
        plug.setPowerState(false);
      });
    }
    else {
      plug.setPowerState(false);
    }
  }
  
  callback({'tts': 'Voila tes céréales sont servies mon beau, Passe une belle journée'});
}


function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}