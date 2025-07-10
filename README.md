<p align="center">
  <img src="https://imglink.win/image/2025/07/11/GWAZu.png" alt="ShaoShop Logo" width="200">
</p>

<h1 align="center">ShaoShop-Admin - 韶商汇商城后台管理系统</h1>

<p align="center">
  <strong>一站式本地购物平台 · 韶汇苑，更惠源，为会员</strong>
</p>

<p align="center">
  <a href="https://github.com/HuaHua-Technophile/ShaoShop-Admin"><img src="https://img.shields.io/github/stars/HuaHua-Technophile/ShaoShop-Admin?style=flat&logo=github" alt="Stars"></a>
  <a href="https://github.com/HuaHua-Technophile/ShaoShop-Admin"><img src="https://img.shields.io/github/forks/HuaHua-Technophile/ShaoShop-Admin?style=flat&logo=github" alt="Forks"></a>
  <a href="https://github.com/HuaHua-Technophile/ShaoShop-Admin"><img src="https://img.shields.io/github/repo-size/HuaHua-Technophile/ShaoShop-Admin?style=flat" alt="Repo Size"></a>
  <img src="https://img.shields.io/badge/platform-Vue3%20%7C%20Vite-blue?style=flat" alt="Platform">
</p>

## 📖 简介

ShaoShop-Admin 是一个基于 Vue 3、Vite 和 Element Plus 的现代化商城后台管理系统。它提供了一套完整的功能，旨在帮助您轻松管理商城的方方面面，包括商品、订单、用户、营销活动等。

本项目使用了最新的前端技术栈，采用响应式布局，致力于提供一个高效、美观且易于使用的管理界面。

## 🛠️ 技术栈

- **核心技术**: ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat) ![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?style=flat) ![Vue Router](https://img.shields.io/badge/Vue_Router-4.x-35495E?style=flat)
- **UI & 样式**: ![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409EFF?style=flat) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=flat) ![Sass](https://img.shields.io/badge/Sass-1.x-CC6699?style=flat) ![BetterScroll](https://img.shields.io/badge/BetterScroll-2.x-42b883?style=flat)
- **构建 & 工具**: ![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat) ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat) ![Lodash](https://img.shields.io/badge/Lodash-4.x-3492FF?style=flat)

## ✨ 功能列表

- **🏠 首页:** 工作台，展示核心数据和快捷入口。
- **📦 商品管理:** 商品列表、商品分类、商品标签、商品规格、商品评论
- **📄 订单管理:** 订单列表、退款申请
- **📈 营销管理:** 优惠券管理、满减规则、轮播图管理、广告管理
- **👥 用户管理:** 会员列表、角色管理、管理员列表
- **💰 财务管理:** 财务报表、发票管理
- **⚙️ 系统管理:** 菜单管理、字典管理、公告管理、系统消息
- **📊 统计报告:** 多维度数据统计与分析。

## 🚀 项目设置

### 环境要求

- Node.js >=16.0.0
- pnpm (本项目标准包管理器)

> [!TIP]
> 本项目使用 [pnpm](https://pnpm.io/zh/) 作为包管理器。如果您的环境中还未安装 pnpm，可以通过以下命令进行全局安装：
>
> ```bash
> npm install -g pnpm
> ```

### 📦 安装依赖

```bash
pnpm install
```

### 🧑‍💻 启动项目

```bash
pnpm run dev
```

### 🏗️ 项目打包

```bash
pnpm run build
```

### 🔍 预览打包结果

```bash
pnpm run preview
```

## 📁 目录结构

```
ShaoShop-Admin/
├── src/
│   ├── api/              # API 请求模块
│   ├── assets/           # 静态资源 (图片、样式等)
│   ├── components/       # 全局公共组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   ├── views/            # 页面视图组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口文件
├── .gitignore            # Git 忽略配置
├── index.html            # HTML 入口文件
├── package.json          # 项目依赖与脚本配置
└── README.md             # 项目说明文档
```
