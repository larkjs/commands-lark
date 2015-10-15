'use strict';

const cmd_new  = require('./new');
const cmd_help = require('./help');

module.exports = () => {
    cmd_new();
    cmd_help();
};
