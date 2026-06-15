# Time Coins 时间金币

iPhone 优先的个人时间复盘 PWA。默认将 06:30 至 23:30 拆分为 34 枚、每枚 30 分钟的时间金币。

## 运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

生产构建：

```bash
npm run build
npm run start
```

## 目录

```text
src/
  app/                 Next.js 页面、全局样式、PWA manifest
  components/
    pages/             Today、Stats、Plan、Settings
    ui/                shadcn/ui 风格基础组件
  hooks/               localStorage 数据状态与 CRUD
  lib/                 类型、常量、时间生成与周统计逻辑
public/                PWA 图标与 service worker
```

## 本地数据

数据保存在浏览器 `localStorage`：

- `time-coins:records`
- `time-coins:settings`
- `time-coins:roles`
- `time-coins:goals`
- `time-coins:mission`

在 iPhone Safari 中打开部署后的 HTTPS 地址，点击分享按钮并选择“添加到主屏幕”即可作为 PWA 使用。
