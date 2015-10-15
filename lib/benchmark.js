'use strict';

const program = require('commander');
const shell   = require('shelljs');

const exec = shell.exec;
const exit = shell.exit;
const which = shell.which;

module.exports = (move_to_app_root) => {
    function benchmarkHelper() {
        let larkInfo = move_to_app_root();
        let port = program.port || 3000;
        if (!which('wrk')) {
            console.log('You need install wrk before use lark benchmark');
            exit(1);
        }
        if (!fs.existsSync('benchmarks/run.sh')) {
            console.log('You need benchmarks/run.sh ');
            exit(1);
        }
        console.log('wrk will test with port:%s', port);
        exit(exec('sh benchmarks/run.sh index.js ' + port).code);
    }

    program
        .command('benchmark')
        .alias('b')
        .description('benchmark test (you need installed wrk)')
        .action(benchmarkHelper); 
};
