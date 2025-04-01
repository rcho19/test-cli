import chalk from "chalk";
import ora from "ora";  // 终端加载动画
import process from 'child_process'

const loader = ora({
  text: "rcho-cli 正在更新....",
  spinner: {
    interval: 100,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.green(item)
    ),
  },
});

export function update() {
  loader.start()

  process.exec('npm install -g rcho-cli@latest', (error) => {
    loader.stop()

    if(!error) {
      console.info(chalk.green('更新成功'))
    } else {
      console.error(chalk.red(error))
    }
  })
}
