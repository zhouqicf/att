﻿var glob = require("glob"),
	wrench = require("wrench");

/**
 * plugin name
 */
exports.name = "tmp";

/**
 * plugin description
 */
exports.description = "list or remove the temp files";

/**
 * plugin action
 */
exports.action = function(){
	var command = process.argv[3];

	if(command == 'delete'){
		wrench.rmdirSyncRecursive(__dirname + "/../tmp/", true);
		wrench.mkdirSyncRecursive(__dirname + "/../tmp/", 0777);
		return;
	}
	glob(__dirname + "/../tmp/**/*", function(err, files){
		files.forEach(function(item){
			console.log("  -> " + item);
		});
	});
}