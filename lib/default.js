'use strict';

const program = require('commander');

const commandsShortMap = {
    'env' : {
        'production':  ['pro', 'prod', 'product'],
        'development': ['dev', 'develop']
    }
};

module.exports = (move_to_app_root) => {
    function defaults (key, value, clear) {
        let larkInfo = move_to_app_root();
        let set = false;
        if (!key || key.length < 1) {
            return showUsage();
        }
        if (value && value.length > 0) {
            set = true;
        }
        else {
            value = larkInfo(key);
        }
        let shortMap = commandsShortMap[key];
        if (shortMap) {
            for (let name in shortMap) {
                let alias = Array.isArray(shortMap[name]) ? shortMap[name] : [shortMap[name]];
                if (alias.indexOf(value) >= 0) {
                    value = name;
                    break;
                }
            }
        }
        if (clear) {
            console.log("Default " + key + " is cleared");
            larkInfo(key, null);
            return;
        }
        if (set) {
            larkInfo(key, value);
            value = '[' + value + ']';
        }
        else if (!value) {
            value = 'not set yet';
        }
        console.log("Default " + key + " is " + (set ? "set to " : "") + value);
    }

    /**
     * comman set
     */
    program
        .command('env [env]')
        .description('set a default env for this app')
        .action((env) => {
            defaults('env', env);
        })

    program
        .command('default <key> [value]')
        .description('set the default variable for this app')
        .action((key, value) => {
            defaults(key, value);
        });

    program
        .command('clear <key>')
        .description('clear the default variable for this app')
        .action((key) => {
            defaults(key, null, true);
        });
};

