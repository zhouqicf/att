var path = require("path"),
	glob = require("glob"),
	argv = require('optimist').argv,
	wrench = require("wrench"),
	program = require("commander"),
	MinifyCommand = require("../commands/MinifyCommand.js");

/**
 * plugin name
 */
exports.name = "minify";

/**
 * plugin description
 */
exports.description = "minify js, css, image and html";


/**
 * plugin action
 */
var toPath = function(file){
	var p = path.resolve( __dirname + "/../tmp/" + file),
		dirname = path.dirname(p);

	if(!path.existsSync(dirname)){
		try{
			wrench.mkdirSyncRecursive(dirname, 0777);
		}catch(err){}
	}
	return p;
};

var minifyFile = function(file, callback){
	MinifyCommand.execute({
		from: file,
		to: toPath(file)
	}, function(err){
		if(err){
			console.log("Error occur while handling file: " + file);
			console.log(err);
		}else{
			console.log("Minify success at file: " + file);
		}
		callback && callback(err);
	});
}
exports.action = function(){
	var query = process.argv[3],
		silent = argv.s || argv.silent;
	if(!query){
		return console.log("the file glob is required");
	}
	glob(query, function(err, files){
		if(silent){
			files.forEach(function(file){
				minifyFile(file)
			});
		}else{
			AttUtil.doSequenceTasks(files, function(file, callback){
				program.confirm("minify the file -> " + file + " ? ", function(yes){
					if(yes){
						minifyFile(file, callback)
					}else{
						callback();
					}
				});
			},function(){
				process.stdin.destroy();
			});
		}
	});
}