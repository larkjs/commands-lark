'use strict';

var program  = require('commander');
var pkg  = require(process.cwd()+'/package.json'); //package.json infomation about lark framework
var cmd_for_global  = require('./lib/global');
var cmd_for_app     = require('./lib/app');

process.orig_cwd = process.cwd();
process.on('exit', function () {
    process.chdir(process.orig_cwd);
});

if (!pkg || !pkg.version) {
    throw new Error("pakage.json is required, version must be set");
    return;
}

program.version(pkg.version);

cmd_for_global();
cmd_for_app();

program
    .command("*")
    .description("show help")
    .action(function () {
        program.outputHelp();
    });

program.parse(process.argv);
