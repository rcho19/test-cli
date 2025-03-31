/*
 * @Desc:
 * @Author: Hrc
 * @Date: 2025-03-17 19:07:24
 * @LastEditors: Hrc
 */
import { input, select } from '@inquirer/prompts'
import { clone } from '../utils/clone'
import path from "path"
import fs from "fs-extra"

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

  const templateName = await select({
    message: "请选择项目模板",
    choices: templateList
  })

  const info = tempaltes.get(templateName)
  console.log("template info", info)

  if(info) {
    clone(info.downloadUrl, projectName, ['-b', info.branch])
  }

  console.log(`create ${projectName}`);
}
