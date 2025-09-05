# GSAP高级动画系统功能说明

## 🎨 已实现的动画功能

### 1. 页面转场动画
- **功能**: 平滑的页面切换效果
- **实现**: 渐变色遮罩从左到右滑动
- **触发**: `AnimationManager.triggerPageTransition()`
- **持续时间**: 1.2秒

### 2. 滚动触发动画
- **类名**: `.animate-on-scroll`
- **效果**: 元素从底部淡入并上滑
- **触发点**: 元素进入视口85%时
- **应用区域**: Hero区域、项目卡片、游戏卡片等

### 3. 文字动画效果

#### 打字机效果
- **类名**: `.typewriter-text`
- **效果**: 文字逐字符显示
- **速度**: 每个字符0.05秒
- **应用**: Hero区域标题

#### 文字逐词显示
- **类名**: `.text-reveal`
- **效果**: 单词逐个从下方淡入
- **延迟**: 每个单词间隔0.1秒
- **应用**: Hero区域描述文字

### 4. 悬停动画效果

#### 卡片悬停
- **类名**: `.hover-card`
- **效果**: 上移10px + 轻微缩放(1.02)
- **持续时间**: 0.3秒
- **应用**: 项目卡片、游戏卡片

#### 按钮悬停
- **类名**: `.hover-button`
- **效果**: 弹性缩放(1.05)
- **缓动**: `back.out(1.7)`
- **应用**: CTA按钮

### 5. 视差和浮动效果

#### 背景视差
- **类名**: `.parallax-bg`
- **效果**: 背景元素以-50%速度滚动
- **应用**: 粒子背景容器

#### 浮动元素
- **类名**: `.floating-element`
- **效果**: 垂直方向上下浮动20px
- **周期**: 2秒
- **应用**: 滚动指示器、Hero头像

### 6. 技能条动画
- **结构**: `.skill-bar` 容器 + `.skill-progress` 进度条
- **数据**: `data-progress="90%"`
- **效果**: 从0%宽度动画到目标宽度
- **持续时间**: 1.5秒
- **触发**: 滚动到技能区域

### 7. 数字计数器动画
- **类名**: `.counter`
- **数据**: `data-target="50"`
- **效果**: 从0开始递增到目标数字
- **持续时间**: 2秒
- **应用**: 统计数据区域

### 8. 加载动画增强
- **改进**: 使用GSAP替代CSS过渡
- **效果**: 图标旋转360度 + 缩放1.2倍
- **退出**: 透明度渐变消失
- **持续时间**: 2秒后自动消失

## 🛠️ 动画工具方法

### AnimationManager.utils
```javascript
// 淡入动画
AnimationManager.utils.fadeIn(element, duration)

// 淡出动画  
AnimationManager.utils.fadeOut(element, duration)

// 滑入动画
AnimationManager.utils.slideIn(element, direction, distance, duration)

// 弹性动画
AnimationManager.utils.bounce(element, scale, duration)
```

### 自定义时间线
```javascript
const timeline = AnimationManager.createTimeline({
    repeat: -1,
    yoyo: true
});
```

## 🎯 性能优化

1. **按需加载**: 动画仅在需要时触发
2. **硬件加速**: 使用transform和opacity属性
3. **ScrollTrigger**: 优化滚动性能，避免不必要的计算
4. **防抖处理**: 避免频繁的动画触发

## 📱 响应式适配

- **移动端优化**: 粒子效果在小屏幕自动禁用
- **性能监控**: 页面不可见时暂停动画
- **触摸友好**: 悬停效果在触摸设备上适配

## 🎪 使用示例

### 为新元素添加滚动动画
```html
<div class="animate-on-scroll">
    <!-- 内容 -->
</div>
```

### 添加悬停效果
```html
<div class="hover-card">
    <!-- 卡片内容 -->
</div>
```

### 创建技能条
```html
<div class="skill-bar" data-progress="85%">
    <div class="skill-progress"></div>
</div>
```

### 添加计数器
```html
<div class="counter" data-target="100">0</div>
```

所有动画都已完美集成到您的个人网站中，提供流畅、现代的用户体验！🚀
