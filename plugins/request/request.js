var fuzz = require('fuzzball');
const util = require('util');

var obj;
exports.init = function(){
  // Initialize resources of this plugin
  // All declared variables are scoped to this plugin 
  
  info('Plugin REQUEST is initializing ...');
  obj = require("./data.json");
}

exports.dispose = function(){
  // Dispose all resources no longer need 
  // a new instance of this plugin will be called
  // This function do not stand async code !
  
  info('Plugin REQUEST is disposed ...');
}
exports.speak = function(tts, async){
  // Hook called for each SARAH.speak()
  // to perform change on string
  // return false to prevent speaking
  
  info('Speaking : %s', tts, async);
  return tts;
}

exports.standBy = function(motion, device){
  // Hook called for each motion in a given device
  // to start/stop action when there is no moves

  info('Motion on %s: %s', device, motion);
}

exports.action = function(data, next){
  // Called by SARAH to perform main action
  
	var nextFunction;
	var query = data.query;
	info("query : " + query);
	for(i in obj['plugins']){
		
		var choices = obj['plugins'][i].items
		var options = {
				scorer: fuzz.partial_ratio, // any function that takes two strings and returns a score, default: ratio
				limit: 1, // max number of top results to return, default: no limit / 0.
				cutoff: 85, // lowest score to return, default: 0
				unsorted: false // results won't be sorted if true, default: false. If true limit will be ignored.
		};

		var results = fuzz.extract(query, choices, options);
		if(results.length > 0){
			info("plugin : " + obj['plugins'][i].name + " search result : " + results);
			info("CALL PLUGIN");
			var e = SARAH.exists(obj['plugins'][i].name);
			info("plugins exist ? " + e);
			if(e == true){
				//SARAH.run(obj['plugins'][i].name);
				SARAH.call(obj['plugins'][i].name, {}, function(options){ 
					console.log(util.inspect(options, false, null));
					nextFunction = options;
				});
			}
			break;
		}
	}
  
  next(nextFunction);
}



