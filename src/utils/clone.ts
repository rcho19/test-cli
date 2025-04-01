/*
 * @Desc: 
 * @Author: Hrc
 * @Date: 2025-03-18 12:36:44
 * @LastEditors: Hrc
 */
import simpleGit, { SimpleGitOptions  } from 'simple-git'
import chalk from 'chalk';
import createLogger from 'progress-estimator'
import log from './log'
const figlet = require("figlet");

const gitOpts: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 当前工程目录
  binary: 'git',
  maxConcurrentProcesses: 6 // 最大并发进程
}

const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.green(item))
  }
})

// 控制台logo打印
const goodPrinter = async () => {
  const data = await figlet('rcho-cli')
  console.log(chalk.rgb(40, 156, 193).visible(data))
}

export async function clone(url: string, prjName: string, options: string[]) {

  const git = simpleGit(gitOpts)

  try {
    await logger(git.clone(url, prjName, options), "下载中...", {
      estimate: 5000  // 预计下载时间
    })

    console.log()
    console.log(chalk.blackBright("================================="))
    console.log(chalk.blackBright("======= 欢迎使用 auto-cli ======="))
    console.log(chalk.blackBright("================================="))

    log.success(chalk.green("项目创建成功"))
    log.success(chalk.green("执行以下命令启动项目："))
    log.info(`cd ${chalk.blueBright(prjName)}`)
    log.info(`${chalk.yellow('pnpm')} install`)
    log.info(`${chalk.yellow('pnpm')} run dev`)
    goodPrinter()

  } catch (error) {
    log.error(chalk.red(`下载失败，${error}`))
  }
}