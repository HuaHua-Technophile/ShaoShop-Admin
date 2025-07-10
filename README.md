# ShaoShop-Admin - 商城后台管理系统

## 简介

ShaoShop-Admin 是一个基于 Vue 3, Vite 和 Element Plus 的现代化商城后台管理系统。它提供了一套完整的功能，帮助您轻松管理商城的方方面面，包括商品、订单、用户、营销活动等。

本项目使用了最新的前端技术栈，响应式布局，旨在提供一个高效、美观、易用的管理界面。

## ✨ 功能列表

系统包含以下主要功能模块：

- **🏠 首页:** 工作台，展示核心数据和快捷入口。
- **📦 商品管理:**
  - 商品列表
  - 商品分类
  - 商品标签
  - 商品规格
  - 商品评论
- **📄 订单管理:**
  - 订单列表
  - 退款申请
- **📈 营销管理:**
  - 优惠券管理
  - 满减规则
  - 轮播图管理
  - 广告管理
- **👥 用户管理:**
  - 会员列表
  - 角色管理
  - 管理员列表
- **💰 财务管理:**
  - 财务报表
  - 发票管理
- **⚙️ 系统管理:**
  - 菜单管理
  - 字典管理
  - 公告管理
  - 系统消息
- **📊 统计报告:**
  - 多维度数据统计与分析。

## 🚀 技术栈

- **开发框架:** [Vue 3](https://vuejs.org/)
- **构建工具:** [Vite](https://vitejs.dev/)
- **编程语言:** [TypeScript](https://www.typescriptlang.org/)
- **UI 组件库:** [Element Plus](https://element-plus.org/)
- **路由:** [Vue Router](https://router.vuejs.org/)
- **状态管理:** [Pinia](https://pinia.vuejs.org/)
- **HTTP 客户端:** [Axios](https://axios-http.com/)
- **CSS 预处理器:** [Sass](https://sass-lang.com/)
- **代码规范:** (如果使用) ESLint, Prettier

## 📦 项目设置

### 环境要求

- Node.js >=16.0.0
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 启动项目

```bash
pnpm run dev
```

### 项目打包

```bash
pnpm run build
```

### 预览打包结果

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

## 🤝 贡献

欢迎提交 PR 或 Issue。
