'use strict';

const path    = require('path');
const program = require('commander');
const shell   = require('shelljs');
const generator = require('../generator');

module.exports = (move_to_app_root) => {
    /**
     * generateHelper
     */
    function generateHelper() {
        let larkInfo = move_to_app_root();
        let args = arguments;
        if (args['0'] != 'benchmark' && args.length != 3 ) {
            console.log('Usage: lark g/generate/c/create [type] [name]');
            return;
        }
        let generateType = args['0'];
        let arg = args['1'];
        switch (generateType) {
            case 'controller':
            case 'route':
                generateController(arg);
                break;
            case 'page':
                generatePageService(arg);
                break;
            case 'data':
                generateDataService(arg);
                break;
            case 'dao':
                generateDaoService(arg);
                break;
            case 'benchmark':
                generateBenchmark();
                break;
        }
    }

    /**
     * delete models
     */
    function destroyHelper() {
        let larkInfo = move_to_app_root();
        let args = arguments;
        if (args.length != 3) {
            console.log('Usage: lark d/destroy [type] [name]')
            return;
        }
        let generateType = args['0'];
        //let directory = path.dirname(args['1']);
        let directory = args['1'];
        let cwd = process.cwd();
        let dirname = "";
        switch (generateType) {
            case 'controller':
                dirname = path.join(cwd, 'controllers', directory);
                break;
            case 'page':
                dirname = path.join(cwd, 'models', 'pageServices', directory);
                if (path.extname(dirname) !== '.js') {
                    dirname += '.js';
                }
                break;
            case 'data':
                dirname = path.join(cwd, 'models', 'dataServices', directory);
                if (path.extname(dirname) !== '.js') {
                    dirname += '.js';
                }
                break;
            case 'dao':
                dirname = path.join(cwd, 'models', 'dao', directory);
                if (path.extname(dirname) !== '.js') {
                    dirname += '.js';
                }
                break;
        }
        shell.rm('-rf', dirname);
        console.log(dirname, ' destoryed.');
    }

    /**
     * command generate
     */
    program
        .command('generate')
        .alias('g')
        .description('code generator')
        .usage('[something]')
        .action(generateHelper);

    program
        .command('create')
        .alias('c')
        .description('code generator')
        .usage('[something]')
        .action(generateHelper);

    /**
     * command destroy
     */
    program
        .command('destroy')
        .alias('d')
        .description('code destroy')
        .usage('[something]')
        .action(destroyHelper);
};

/**
 * generateController
 * @param directory {{string}}
 * useage
 * user/create.js
 * api
 * api/
 */
function generateController(directory) {
    if (!directory) {
        return;
    }
    let filePath = '';
    let extname = path.extname(directory);
    if (extname && extname === '.js') {
        //filePath = path.join(cwd, 'controllers', directory);
        filePath = directory;
    } else if (!extname) {
        //filePath = path.join(cwd, 'controllers', directory, 'index.js');
        filePath = path.join(directory, 'index.js');
    }
    generator('lark:controller ' + filePath)
}

/**
 * generate PageService file
 * @param page  pageService file name
 */
function generatePageService(page) {
    if (!page) {
        return;
    }
    if (path.extname(page) !== '.js') {
        page += '.js';
    }
    generator('lark:page ' + page);
}
/**
 * generate DataService file
 * @param data dataService file name
 */
function generateDataService(data) {
    if (!data) {
        return;
    }
    if (path.extname(data) !== '.js') {
        data += '.js';
    }
    generator('lark:data ' + data);
}

/**
 * generate dao file
 * @param dao  file name
 */
function generateDaoService(dao) {
    if (!dao) {
        return;
    }
    if (path.extname(dao) !== '.js') {
        dao += '.js';
    }
    generator('lark:dao ' + dao);
}

/**
 * generate dao file
 * @param dao  file name
 */
function generateBenchmark() {
    generator('lark:benchmark');
}
