/*
 * @Desc:
 * @Author: Hrc
 * @Date: 2025-03-17 19:07:24
 * @LastEditors: Hrc
 */
import { input, select } from '@inquirer/prompts'
import { clone } from '../utils/clone'
import { name, version } from '../../package.json'
import { gt } from 'lodash'
import path from "path"
import fs from "fs-extra"
import axios, { AxiosResponse } from 'axios'
import chalk from 'chalk';

// 模板接口
interface TemplateInfo {
  name: string; // 项目名称
  downloadUrl: string; // 下载地址
  description: string; // 项目描述
  branch: string; // 项目分支
}

// 定义开发好的模板Map对象
const tempaltes: Map<string, TemplateInfo> = new Map([
  [
    "Vite4-Vue3-Typescript-template-main",
    {
      name: "admin-pro",
      downloadUrl: "git@github.com:rcho19/admin-pro.git",
      description: "Vue3技术栈开发模板",
      branch: "main",
    },
  ],
  [
    "Vite4-Vue3-Typescript-template-dev",
    {
      name: "admin-pro",
      downloadUrl: "git@github.com:rcho19/admin-pro.git",
      description: "Vue3技术栈开发模板开发分支",
      branch: "dev_breadcrumb_20250305",
    },
  ],
]);

const isOverwrite = (dirName: string) => {
  console.log(`${dirName}文件夹已存在`)

  return select({
    message: "是否覆盖？",
    choices: [
      {
        name: "覆盖",
        value: true
      },
      {
        name: "取消",
        value: false
      }
    ]
  })
}

// 获取npm包信息
async function getNpmInfo(name: string) {
  const npmUrl = `https://registry.npmjs.org/${name}`

  let res = {}
  try {
    res = await axios.get(npmUrl)
  } catch (error) {
    console.error(`查询版本错误：${error}`)
  }
  return res
}

// 返回版本信息
async function getNpmLatestVersion(name: string) {
  const { data } = (await getNpmInfo(name)) as AxiosResponse

  // console.info('npm info', data)
  return data['dist-tags'].latest
}

// 检查版本
async function checkCurrenVersion(name: string, version: string) {
  const latestVersion = await getNpmLatestVersion(name)
  const needUpdate = gt(latestVersion, version)
  if(needUpdate) {
    console.warn(`检查到最新版本为${chalk.yellowBright(latestVersion)}，当前版本为${chalk.yellowBright(version)}`)
    console.log(`可使用 ${chalk.blueBright('npm install rcho-cli@latest')} 更新，也可使用 ${chalk.blueBright('rcho update')} 命令更新`)
  }

  return needUpdate
}

export async function create(projectName: string) {
  // 初始化模板列表
  const templateList = Array.from(tempaltes).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;

      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );

  // 没有输入名称要求用户输入名称
  if (!projectName) {
    projectName = await input({
      message: "请输入项目名称"
    })
  }

  // 文件名存在则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName)
  if(fs.existsSync(filePath)) {
    const over = await isOverwrite(projectName)
    if(over) {
      fs.remove(filePath)
    } else {
      return
    }
  }

  // 检测当前脚手架版本是否最新
  await checkCurrenVersion(name, version)

  const templateName = await select({
    message: "请选择项目模板",
    choices: templateList
  })

  const info = tempaltes.get(templateName)
  // console.log("template info", info)

  if(info) {
    clone(info.downloadUrl, projectName, ['-b', info.branch])
  }

  console.log(`create ${projectName}`);
}
