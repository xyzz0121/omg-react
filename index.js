const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
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