# 静态资源清单 —— CampusSwap / 换个啥 v2.0

## 1. 字体资源

| 字体 | 用途 | 来源 | 当前加载方式 | 备注 |
|------|------|------|--------------|------|
| ZCOOL KuaiLe | 标题、按钮、标签 | CDNFonts | wx.loadFontFace 在线加载 | 建议后续换成本地字体或稳定 CDN |
| DSEG14 Classic | 数字、时间、计数器 | keshikan/DSEG | wx.loadFontFace 在线加载 | LCD/数码管风格数字 |
| Noto Sans SC / PingFang SC | 正文回退 | 系统字体 | 无需引入 | 网络字体失败时自动回退 |

在线字体 URL：
- ZCOOL KuaiLe: https://fonts.cdnfonts.com/s/15322/ZCOOLKuaiLe-Regular.woff
- DSEG14 Classic: https://cdn.jsdelivr.net/gh/keshikan/DSEG@master/fonts/DSEG14-Classic/DSEG14Classic-Regular.woff2

## 2. 图标资源

底部 TabBar 当前使用 emoji 占位，建议后续替换为统一 SVG/PNG 图标：
- tab-home / tab-home-on：广场，霓虹线条风，紫色发光
- tab-publish：发布，C位圆形，青紫渐变
- tab-message / tab-message-on：消息，聊天气泡，带 NEW 角标
- tab-profile / tab-profile-on：我的，猫耳/像素头像轮廓

## 3. 图片资源

### 3.1 用户头像
已生成 6 张二次元风格头像，存放于 `assets/avatars/`：
- avatar-1.png ~ avatar-6.png

### 3.2 推荐交换帖子封面
已生成 5 张与 v2 风格一致的动漫化封面，存放于 `assets/mock-posts/`：
- post-calculator.png：计算器/学习主题
- post-cup.png：保温杯/生活主题
- post-suitcase.png：行李箱/毕业主题
- post-books.png：六级资料/学习主题
- post-art.png：手绘头像/技能主题

### 3.3 提案示例图
已生成 3 张提案占位图，存放于 `assets/mock-posts/`：
- proposal-milktea.png：奶茶券
- proposal-breakfast.png：早餐券
- proposal-notebook.png：手账本

### 3.4 空状态/装饰图（建议后续补充）
- empty-swap.png：空广场/无数据，像素风、半透明、紫色描边
- loading-pixel.gif：加载中，点阵动画（也可用 CSS 进度条替代）

## 4. 颜色与渐变

关键色板：
- --neon-violet: #8B5CF6
- --neon-pink: #EC4899
- --neon-cyan: #06B6D4
- --neon-orange: #F59E0B
- --dark-base: #0F0A1A
- --paper-white: #F5F0EB

渐变定义详见 `app.wxss` 与 `DESIGN_TOKENS.md`。

## 5. 动画/动效资源

所有动效均使用 CSS 动画实现，无需额外资源：
- blink：自定义导航标题光标闪烁
- load：首页底部像素进度条
- indicator-pulse：TabBar 选中态指示器脉冲
- badge-bounce：消息 NEW 角标弹跳
- scanline：TabBar 扫描线

## 6. 音效资源（可选增强）

建议后续补充：
- assets/sounds/click.mp3：按钮点击/像素音效
- assets/sounds/match.mp3：撮合成功提示音
- assets/sounds/new-message.mp3：新消息提示音

## 7. 资源替换优先级

1. P0：将在线字体改为本地字体或自有 CDN，避免加载失败。
2. P1：替换 TabBar emoji 为统一图标，提升专业感。
3. P2：补充默认头像、空状态插图。
4. P3：增加音效、微动效。
