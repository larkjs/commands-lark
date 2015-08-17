'use strict';

var program = require('commander');
var shell   = require('shelljs');

var exec = shell.exec;
var exit = shell.exit;

module.exports = function (move_to_app_root) {
    /**
     * init cmd
     */
    function execCmd(_cmd, config) {
        config = config || {};
        var larkInfo = move_to_app_root();
        _cmd = _cmd || '';
        var cmd = '';
        var default_env = larkInfo('env');
        var env = config.env || program.environment || default_env || 'development';
        cmd += 'NODE_ENV=' + env;
        fixArgs();
        cmd += ' ' + process.execPath + ' ' + process.execArgv.join(" ") + ' index.js ' + _cmd;

        if (program.background) {
            cmd += ' background';
        }

        if (larkInfo('pid')) {
            var pid = larkInfo('pid');
            var killed = true;
            try {
                process.kill(larkInfo('pid'));
            }
            catch (e) {
                console.log('Failed to kill lark process ' + pid);
                killed = false;
            }
            larkInfo('pid', null);
            if (killed && '--lark-delete' === _cmd) {
                return;
            }
        }

        var proc = exec(cmd, function (code, output) {
            larkInfo('pid', null);
            if (code !== 0) {
                exit(code);
            };
        });
        larkInfo('pid', proc.pid);

        return;
        var code = exec(cmd, {async: false}).code;
        if (code !== 0) {
            exit(code);
        };
    }

    /**
     * command start
     **/
    program
        .command('run')
        .alias('server')
        .alias('start')
        .description('run lark app with watch')
        .usage('<app>')
        .action(function () {
            execCmd();
        });

    /**
     * command restart
     */
    program
        .command('restart')
        .description('restart app')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-restart');
        }); 

    /**
     * command reload
     */
    program
        .command('reload')
        .description('reload app')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-reload');
        });

    /**
     * command stop
     */

    program
        .command('stop')
        .description('stop app')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-delete');
        });

    program
        .command('watch')
        .description('start app in watch mode')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-watch');
        });

    /**
     * command delete
     */

    /*
    program
        .command('delete')
        .description('delete app')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-delete');
        });
    */
};

function fixArgs () {
    if (needHarmonyFlag()) {
        process.execArgv.unshift('--harmony');
    }
};

function needHarmonyFlag () {
    if (process.execArgv.indexOf('--harmony') > 0) {
        return false;
    }
    //TODO: disable for iojs
    return true;
};
