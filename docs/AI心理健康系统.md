# AI心理健康系统技术记录
## 1. 项目简介

+ 这是一个用来做什么的项目？ +
  
这是一个结合前沿AI技术和心理学的健康助手，通过AI技术帮助你的心理健康，目标为你提供情绪价值。

+ 所用的技术栈有哪些？ +
  
前端语言：HTML、CSS、TypeScript <br>
前端框架：Vue.js <br>
运行环境：Node.js v24.12.0 <br>
路由工具：Vue Router <br>
构建工具：Vite <br>
UI框架：Element Plus 、Vuetify、Bootstrap、JQuery<br>
后端语言：Java、Python<br>
jdk版本：21<br>
后端框架：Spring Boot <br>
后端服务器：Nginx <br>
数据缓存工具：Redis <br>
数据库：MySQL <br>
前端部署工具：Vercel <br>
Web服务器：Nginx <br>
API测试工具：Postman <br>
API设计文档：Rest API<br>
包管理器：NPM、Maven<br>
版本控制工具：Git <br>
仓库托管工具：GitHub <br>
代码编辑器：VSCode、Trae、IDEA<br>
操作系统：Windows 10、Ubuntu Linux <br>
云服务器：Ubuntu Linux<br>
AI服务运行框架：Ollama <br>
RAG服务运行框架：Langchain<br>
部署工具：Docker <br>


### 1.1 环境搭建 

1. Node.js的安装与配置（使用版本：v24.12.0）
   
<div style="margin: 20px 0;">
  <a 
     href="https://lonemonk298.github.io/Docsify-Blogs/img/redeme.pdf"
     target="_blank"
     style="
       display:inline-block;
       padding: 10px 20px;
       background: #64ffda;
       color: #000;
       border-radius: 6px;
       font-weight:bold;
       text-decoration:none;
     ">
    📄 点击查看教程
  </a>
</div>

``` pdf
./img/redeme.pdf
```

按照教程如果出现无法安装情况，使用如下命令： <br>
```cmd
// 1. 取消代理
nvm proxy none

// 2. 设置官方镜像
nvm node_mirror https://nodejs.org/dist/

// 3. 查看可用版本
nvm list available

// 4. 安装
nvm install 24.12.0

// 5. 查看已安装版本
nvm list

// 6. 切换使用指定版本
nvm use 24.12.0

// 7. 检查是否成功
node -v
```

1. 脚手架资料，根据文档搭建开发环境： <br>
   > https://vitejs.cn/vite3-cn/guide/

   搭建Vite项目： <br>
   > npm create vite@latest

   下载依赖包并在main.js中引入： <br>
   > npm install element-plus --save



