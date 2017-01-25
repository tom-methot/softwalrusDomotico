var fuzz = require('fuzzball');
const util = require('util');
const fs = require('fs');
const path = require('path')
const Parser  = require('xml2js');

var obj;

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}



exports.init = function(){
    // Initialize resources of this plugin
    // All declared variables are scoped to this plugin 
  
    info('Plugin REQUEST is initializing ...');
    
    
    obj = require("./data.json");
  
    /*var directories = getDirectories("./plugins");
    info(directories);
    
    for(i in directories){
        var parser = new Parser.Parser();
        info(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml');
        fs.readFile(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
                console.dir(result);
                console.log('Done');
            });
        }); 
    }*/
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
  
    /*var nextFunction;
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
                SARAH.call(obj['plugins'][i].name, {"state" : "off", "tts" : "voila ces fait !"}, function(options){ 
                    console.log(util.inspect(options, false, null));
                    nextFunction = options;
                });
            }
            break;
        }
    }
    
  next(nextFunction);*/
    var directories = getDirectories("./plugins");
    
    for(i in directories){
        info("Directory ------> " + directories[i] + " i: " + i);
        var parser = new Parser.Parser();
        if (fs.existsSync(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml')) {
            fs.readFile(__dirname + '/../' + directories[i] + '/' + directories[i] + '.xml', function(err, data) {
                parser.parseString(data, function (err, result) {
                    for(k in result.grammar.rule[0]["one-of"][0]['item']){
                        console.log("item = : " + k);
                        console.log(result.grammar.rule[0]["one-of"][0]['item'][k]);
                        
                        if(result.grammar.rule[0]["one-of"][0]['item'][k]._ != undefined){
                            //TODO
                        }
                        
                        if(result.grammar.rule[0]["one-of"][0]['item'][k].tag != undefined){
                            //TODO
                        }
              
                    }
                    console.log('-------------------------');
                });
            });
            
        }
    }
  
  next();
}



