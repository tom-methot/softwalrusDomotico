var fuzz = require('fuzzball');
const util = require('util');

var obj;
exports.init = function(){
  // Initialize resources of this plugin
  // All declared variables are scoped to this plugin 
  
  info('Plugin REQUEST is initializing ...');
  
  var query = "126abzx";
	var choices = [{id: 345, modelnumber: "123abc"},{id: 346, modelnumber: "123efg"},{id: 347, modelnumber: "456abdzx"}];
	var options = {
			scorer: fuzz.partial_ratio, // any function that takes two strings and returns a score, default: ratio
			processor: function(choice) {return choice['modelnumber']},  //takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
			limit: 1, // max number of top results to return, default: no limit / 0.
			cutoff: 70, // lowest score to return, default: 0
			unsorted: false // results won't be sorted if true, default: false. If true limit will be ignored.
	};

	var results = fuzz.extract(query, choices, options);
  
  info('RESULT !!!!!!!!!!!!!!! : ' + results);
}

exports.dispose = function(){
  // Dispose all resources no longer need 
  // a new instance of this plugin will be called
  // This function do not stand async code !
  
  info('Plugin REQUEST is disposed ...');
}

exports.ajax = function(req, res, next){
  // Called before rendering portlet when clicking on 
  // <a href="/plugin/template" data-action="ajax">click me</a>  
  // Because portlet CAN'T do asynchronous code
  info('Plugin REQUEST ajax request ...');
  next();
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
  
	obj = require("./data.json");
	

	var query = data.query;
	info("query : " + query);
	for(i in obj['plugins']){
		info("obj " + obj['plugins'][i].name);
		
		var choices = obj['plugins'][i].items
		var options = {
				scorer: fuzz.partial_ratio, // any function that takes two strings and returns a score, default: ratio
				limit: 1, // max number of top results to return, default: no limit / 0.
				cutoff: 85, // lowest score to return, default: 0
				unsorted: false // results won't be sorted if true, default: false. If true limit will be ignored.
		};

		var results = fuzz.extract(query, choices, options);
		if(results.length > 0){
			info("res : " + results)
			info("CALL PLUGIN");
			var e = SARAH.exists(obj['plugins'][i].name);
			info(e);
			if(e == true){
				SARAH.run(obj['plugins'][i].name);
			}
			break;
		}
	}
  
  next();
}



