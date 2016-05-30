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
        var default_env = larkInfo('env');
        var env = config.env || program.environment || default_env || 'development';
        fixArgs();

        if (env !== 'development') {
            return execute(env, _cmd, true);
        }

        var status = larkInfo('status');
        var le = parseInt(larkInfo('lastExecutedAt'));

        if (status === 'command' && !!le && Math.abs(Date.now() - le) < 50) {
            exit(0);
            return;
        }
        larkInfo('lastExecutedAt', Date.now());
        larkInfo('status', 'command');
        if (status === 'running') {
            var pid = larkInfo('pid');
            try {
                process.kill(pid);
            }
            catch (e) {
            }
        }

        var sync = false;
        if (_cmd.match(/^--lark-/)) {
            var sync = true;
            if (_cmd.match(/stop/)) {
                larkInfo('status', null);
                larkInfo('lastExecutedAt', null);
                if (!!status) {
                    return;
                }
            }
            else if (_cmd.match(/start|restart|reload/)) {
                _cmd = '';
                sync = false;
            }
        }
        return execute(env, _cmd, sync);
    }

    function execute (env, _cmd, sync) {
        var larkInfo = move_to_app_root();
        var cmd = 'NODE_ENV=' + env + ' ' + process.execPath + ' ' + process.execArgv.join(" ") + ' index.js ' + _cmd;
        if (sync) {
            larkInfo('status', null);
            var code = exec(cmd, {async: false}).code;
            if (code !== 0) {
                exit(code);
            };
            return;
        }
        var proc = exec(cmd, function (code, output) {
            if (code !== 0) {
                exit(code);
            };
        });
        larkInfo('pid', proc.pid);
        larkInfo('status', 'running');
        larkInfo('lastExecutedAt', null);
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
     * command stop
     */

    program
        .command('stop')
        .description('stop app')
        .usage('<app>')
        .action(function () {
            execCmd('--lark-stop');
        });

};

function fixArgs () {
    if (needHarmonyFlag()) {
        process.execArgv.unshift('--harmony');
    }
};

function needHarmonyFlag () {
    if (process.execArgv.indexOf('--harmony') >= 0) {
        return false;
    }
    //TODO: disable for iojs
    return true;
};
