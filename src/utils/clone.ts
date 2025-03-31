/*
 * @Desc: 
 * @Author: Hrc
 * @Date: 2025-03-18 12:36:44
 * @LastEditors: Hrc
 */
import simpleGit, { SimpleGitOptions  } from 'simple-git'
import chalk from 'chalk';
import createLogger from 'progress-estimator'

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

export async function clone(url: string, prjName: string, options: string[]) {

  const git = simpleGit(gitOpts)

  try {
    await logger(git.clone(url, prjName, options), "下载中...", {
      estimate: 5000  // 预计下载时间
    })

    console.log() // 空行
    console.log(chalk.blackBright("================================="))
    console.log(chalk.blackBright("======= 欢迎使用 auto-cli ======="))
    console.log(chalk.blackBright("================================="))
    console.log()
    console.log(chalk.green("项目创建成功"))
    console.log(chalk.green("执行以下命令启动项目："))
    console.info(`cd ${chalk.blueBright(prjName)}`)
    console.info(`${chalk.yellow('pnpm')} install`)
    console.info(`${chalk.yellow('pnpm')} run dev`)
  } catch (error) {
    console.error(chalk.red(`下载失败，${error}`))
  }
}