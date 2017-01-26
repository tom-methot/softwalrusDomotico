var fuzz        = require('fuzzball');
var util        = require('util');
var fs          = require('fs');
var path        = require('path');
var Parser      = require('xml2js');
var jsonFile    = require("./data.json");

exports.init = function(){
    info('Plugin REQUEST is initializing ...');

    var directories = getDirectories("./plugins");
    
    var arr = {};
    arr.plugins = {};
    for(i in directories){
        arr.plugins[directories[i]] = {};
        arr.plugins[directories[i]].items = [];
        var parser = new Parser.Parser();
        
		if (fs.existsSync(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml')) {
            var data = fs.readFileSync(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml');
            parser.parseString(data, function (err, result) {
                for(k in result.grammar.rule[0]["one-of"][0]['item']){
                    if(result.grammar.rule[0]["one-of"][0]['item'][k]._ !== undefined){
                        arr.plugins[directories[i]]["items"].push(result.grammar.rule[0]["one-of"][0]['item'][k]._);
                    };
                    if(result.grammar.rule[0]["one-of"][0]['item'][k].tag !== undefined){
                        arr.plugins[directories[i]]["tag"] = result.grammar.rule[0]["one-of"][0]['item'][k].tag;
                    };
                };
            });
        };
    };
    fs.writeFile('./plugins/request/data.json',JSON.stringify(arr,null,4),function(err){
        if(err) throw err;
    });
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
    
    console.log(jsonFile);
    for(i in jsonFile['plugins']){
        console.log(jsonFile['plugins'][i].items);
        var choices = jsonFile['plugins'][i].items;
        var options = {
                scorer: fuzz.partial_ratio, // any function that takes two strings and returns a score, default: ratio
                limit: 1, // max number of top results to return, default: no limit / 0.
                cutoff: 85, // lowest score to return, default: 0
                unsorted: false // results won't be sorted if true, default: false. If true limit will be ignored.
        };

        var results = fuzz.extract(query, choices, options);
        if(results.length > 0){
            info("plugin : " + i + " search result : " + results);
            info("CALL PLUGIN");
            var e = SARAH.exists(jsonFile['plugins'][i].name);
            info("plugins exist ? " + e);
            if(e == true){
                //SARAH.run(jsonFile['plugins'][i].name);
                SARAH.call(jsonFile['plugins'][i].name, {"state" : "off", "tts" : "voila ces fait !"}, function(options){ 
                    console.log(util.inspect(options, false, null));
                    nextFunction = options;
                });
            }
			else{
				nextFunction = {'tts': 'plugin trouver dans xml existe pas'};
			}
            break;
        }
    }
    
  next(nextFunction);
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}