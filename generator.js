/**
 * lark - generator.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

const path = require('path');

module.exports = (command) => {
    /**
     * Requiring yeoman may cost several seconds,
     * So we'd like to require it when yeoman is indeed needed
     * rather than once this module is required
     **/
    console.log("Starting yeoman generator, please wait...");
    let yeoman = require('generator-lark/node_modules/yeoman-generator');

    let env = yeoman();
    let root = path.dirname(require.resolve('generator-lark/package.json'));
    let cwd = process.cwd();

    process.chdir(root);
    env.lookup();
    process.chdir(cwd);

    env.on('error', (err) => {
        console.error(err);
    });

    env.larkPkg = require('../../package.json'); //向上两层目录去require lark的package.json

    env.run(command);
};
