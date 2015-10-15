'use strict';

const program = require('commander');
const shell   = require('shelljs');

const exec = shell.exec;
const exit = shell.exit;

module.exports = (move_to_app_root) => {
    /**
     * init cmd
     */
    function execCmd(_cmd, config) {
        config = config || {};
        let larkInfo = move_to_app_root();
        _cmd = _cmd || '';
        let default_env = larkInfo('env');
        let env = config.env || program.environment || default_env || 'development';
        fixArgs();

        if (env !== 'development') {
            return execute(env, _cmd, true);
        }

        let status = larkInfo('status');
        let le = parseInt(larkInfo('lastExecutedAt'));

        if (status === 'command' && !!le && Math.abs(Date.now() - le) < 50) {
            exit(0);
            return;
        }
        larkInfo('lastExecutedAt', Date.now());
        larkInfo('status', 'command');
        if (status === 'running') {
            let pid = larkInfo('pid');
            try {
                process.kill(pid);
            }
            catch (e) {
            }
        }

        let sync = false;
        if (_cmd.match(/^--lark-/)) {
            sync = true;
            if (_cmd.match(/stop|delete|kill/)) {
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
        let larkInfo = move_to_app_root();
        let cmd = 'NODE_ENV=' + env + ' ' + process.execPath + ' ' + process.execArgv.join(" ") + ' index.js ' + _cmd;
        if (sync) {
            larkInfo('status', null);
            let code = exec(cmd, {async: false}).code;
            if (code !== 0) {
                exit(code);
            };
            return;
        }
        let proc = exec(cmd, (code, output) => {
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
        .action(() => {
            execCmd();
        });

    /**
     * command restart
     */
    program
        .command('restart')
        .description('restart app')
        .usage('<app>')
        .action(() => {
            execCmd('--lark-restart');
        }); 

    /**
     * command reload
     */
    program
        .command('reload')
        .description('reload app')
        .usage('<app>')
        .action(() => {
            execCmd('--lark-reload');
        });

    /**
     * command stop
     */

    program
        .command('stop')
        .description('stop app')
        .usage('<app>')
        .action(() => {
            execCmd('--lark-delete');
        });

    program
        .command('watch')
        .description('start app in watch mode')
        .usage('<app>')
        .action(() => {
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
        .action(() => {
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
    if (process.execArgv.indexOf('--harmony') >= 0) {
        return false;
    }
    //TODO: disable for iojs
    return true;
};
