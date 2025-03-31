import { Command } from 'commander';
import { version } from '../package.json'
import { create } from './command/create'

const program = new Command('my-cli');

// 创建项目命令
program.command('create').description('创建一个新项目').argument('[name]', '项目名称').action(async (dirName) => {
  create(dirName)
});

// 输出版本号
program.version(version, '-v, --version', 'output the current version')

program.parse()