/**
 * 脚手架入口文件
 * zhouyang20
 * 2019.04.29
 */

//可以自动的解析命令和参数，用于处理用户输入的命令。
const program = require('commander');
//下载并提取 git 仓库，用于下载项目模板
const download = require('download-git-repo');
//交互式命令，向用户提问题
const inquirer = require('inquirer');
//将 handlebars 渲染完后的模板重新写入到文件中
const fs = require('fs');
//使用 ora 来提示用户正在下载中
const ora = require('ora');
//通过 chalk 来为打印信息加上样式，比如成功信息为绿色，失败信息为红色，这样子会让用户更加容易分辨，同时也让终端的显示更加的好看
const chalk = require('chalk');
//使用 log-symbols 在信息前面加上 √ 或 × 等的图标
const symbols = require('log-symbols');
//模板引擎，将用户提交的信息动态填充到文件中。
const handlebars = require('handlebars');

program.version('1.0.0', '-v, --version')
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
                    message: 'is in mobile (give you flexible&rem solutions)? (y/n):'
                },
                {
                    name: 'needRedux',
                    message: 'need redux? (y/n):'
                }
            ]).then((answers) => {
                const spinner = ora('Omg, creating rapidly, please wait a moment...');
                spinner.start();
                //根据输入配置对应不同仓库 分别对应isMobile，needRedux 1真0假
                const repMap = new Map([]);
                const { isMobile, needRedux } = answers;
                //是不是移动端
                const bIsMobile = (isMobile === 'y' || isMobile === 'Y' || isMobile === 'yes' || isMobile === 'Yes') ? '1' : '0';
                //需不需要redux
                const bNeedRedux = (needRedux === 'y' || needRedux === 'Y' || needRedux === 'yes' || needRedux === 'Yes') ? '1' : '0';

                download('https://github.com:xyzz0121/omg-react-template#master', name, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    } else {
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        
                        if (fs.existsSync(fileName)) {
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
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