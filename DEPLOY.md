# Vercel 部署指南

这个项目已经成功改造为 React + Vite 前端应用，可以直接部署到 Vercel。

## 项目结构

```
gemini-watermark-remover/
├── src/
│   ├── components/       # React 组件
│   ├── core/            # 水印处理核心逻辑
│   ├── hooks/           # React Hooks
│   ├── i18n/            # 国际化文件
│   ├── App.jsx          # 主应用组件
│   ├── main.jsx         # React 入口文件
│   └── index.css        # 全局样式
├── public/              # 静态资源目录
│   ├── i18n/           # 语言文件
│   └── terms.html      # 使用条款页面
├── index.html          # HTML 模板
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
├── vercel.json         # Vercel 配置
└── package.json        # 项目依赖

```

## 部署到 Vercel

### 方式一：通过 Vercel 控制台部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测到这是一个 Vite 项目
6. 保持默认设置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. 点击 "Deploy" 开始部署

### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 配置说明

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这个配置确保：
- 使用 npm 构建
- 输出目录为 dist
- 所有路由重定向到 index.html（支持客户端路由）

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 3
- **依赖**:
  - exifr: EXIF 数据解析
  - jszip: ZIP 文件处理
  - medium-zoom: 图片缩放预览

## 常见问题

### Q: 部署后图片上传不工作？
A: 确保 `public/i18n/` 目录下有语言文件，Vite 会自动将 public 目录下的文件复制到 dist。

### Q: 如何修改端口？
A: 编辑 `vite.config.js`，修改 `server.port` 配置。

### Q: 如何添加新的语言？
A: 在 `public/i18n/` 目录下添加新的语言 JSON 文件，参考现有的 `zh-CN.json` 和 `en-US.json`。

## 环境变量

本项目无需环境变量，所有处理都在浏览器端完成。

## 性能优化

- ✅ 代码分割（自动）
- ✅ Tree Shaking（自动）
- ✅ CSS 压缩
- ✅ 图片优化
- ✅ Gzip 压缩（Vercel 自动处理）

## License

MIT
