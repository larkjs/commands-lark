'use strict';

const program = require('commander');

module.exports = () => {
    /**
     * custom help
     */
    program.on('--help', () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ lark new lark-app');
        console.log('    $ lark run');
        console.log('    $ lark generate controller user/create.js');
        console.log('');
    });
};

/**
 * Print help if exec `lark`
 **/
if (!process.argv.slice(2).length) {
    process.nextTick(() => {
        program.outputHelp();
    });
}
