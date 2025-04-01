import logSymbols from 'log-symbols';

// 打印前缀图标美化
const log = {
  success: (message: string) => {
    console.log(logSymbols.success, message)
  },
  info: (message: string) => {
    console.log(logSymbols.info, message)
  },
  warning: (message: string) => {
    console.log(logSymbols.warning, message)
  },
  error: (message: string) => {
    console.log(logSymbols.error, message)
  }
}

export default log