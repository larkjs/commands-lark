'use strict';

const program         = require('commander');
const pkg             = require('../../package.json'); //package.json infomation about lark framework
const cmd_for_global  = require('./lib/global');
const cmd_for_app     = require('./lib/app');

process.orig_cwd = process.cwd();
process.on('exit', () => {
    process.chdir(process.orig_cwd);
});

if (!pkg || !pkg.version) {
    throw new Error("package.json is required, version must be set");
    return;
}

program.version(pkg.version);

cmd_for_global();
cmd_for_app();

program
    .command("*")
    .description("show help")
    .action(() => {
        program.outputHelp();
    });

program.parse(process.argv);
