'use strict';

const program = require('commander');
const path    = require('path');

module.exports = (move_to_app_root) => {

    program
        .command('status')
        .description('show app running status')
        .action(() => {
            let larkInfo = move_to_app_root();
            process.env.PM2_HOME = process.cwd();
            let pm = require('lark-bootstrap/lib/processManager');
            pm.cmd('list', () => {
                let list = arguments[1] || [];
                let disp = require('lark-bootstrap/node_modules/pm2/lib/CliUx').dispAsTable;
                disp(list);
                setTimeout(() => {
                    process.exit(0);
                },10);
            });
        });
};
