#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const remove =   require("./utils/remove");
const modify =   require("./utils/modify");

program.version('1.1.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if (!fs.existsSync(name)) {
            inquirer.prompt([
                {
                    name: 'description',
                    message: 'description:'
                },
                {
                    name: 'author',
                    message: 'author:'
                },
                {
                    name: 'isMobile',
                    message: 'is in mobile (give you flexible&pxtorem solutions)? (y/n):'
                }, {
                    name: 'needRouter',
                    message: 'need react-router? (y/n):'
                },
                {
                    name: 'needRedux',
                    message: 'need redux? (y/n):'
                }
            ]).then((answers) => {
                const spinner = ora('Omg, creating rapidly, please wait a moment...');
                spinner.start();
                const { isMobile, needRedux, needRouter } = answers;
                //是不是移动端
                const isInMobile = (isMobile === 'y' || isMobile === 'Y' || isMobile === 'yes' || isMobile === 'Yes');
                //需不需要react-router
                const isNeedRouter = (needRouter === 'y' || needRouter === 'Y' || needRouter === 'yes' || needRouter === 'Yes');
                //需不需要redux
                const isNeedRedux = (needRedux === 'y' || needRedux === 'Y' || needRedux === 'yes' || needRedux === 'Yes');

                download('https://github.com:xyzz0121/omg-react-template#master', name, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    } else {
                        spinner.succeed();
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author, 
                            isNeedRedux,
                            isInMobile,
                            isNeedRouter
                        }
                        //修改模板
                        modify(`${name}/src/index.tsx`,{isInMobile, isNeedRouter, isNeedRedux});
                        modify(`${name}/src/index.html`,{isInMobile});
                        modify(`${name}/src/components/Home/HomeContent/index.tsx`,{isNeedRouter,isNeedRedux});
                        modify(`${name}/src/components/Home/HomeBtn/index.tsx`,{isNeedRedux});
                        modify(`${name}/src/pages/index.ts`,{isNeedRouter});
                        modify(`${name}/src/pages/Home/index.tsx`,{isNeedRedux});
                        modify(`${name}/package.json`,meta);
                        modify(`${name}/webpack.config.js`,{isInMobile});
                        //删除多余文件
                        if (!isNeedRouter) {
                            remove(`${name}/src/routers`);
                            remove(`${name}/src/components/Common`);
                            remove(`${name}/src/pages/Detail`);
                        }
                        if (!isNeedRedux) {
                            remove(`${name}/src/store`);
                        }
                        console.log(symbols.success, chalk.green('Done happily!'));
                        console.log(symbols.success, chalk.green(`You can cd ./${name}`));
                    }
                })
            })
        } else {
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('Project already exists!'));
        }
    })
program.parse(process.argv);