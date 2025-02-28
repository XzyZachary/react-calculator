# React Calculator

一个基于 React 和 TypeScript 开发的现代化计算器应用，具有美观的界面和完整的计算功能。

## 功能特点

- 支持基本的数学运算（加、减、乘、除）
- 支持括号运算
- 实时计算结果显示
- 响应式设计，适配不同屏幕大小
- 错误提示功能
- 支持键盘输入
- 支持清除（AC）和回退（C）操作
- 支持小数点输入
- 支持正负号切换

## 安装

```bash
npm install
```

## 使用方法

### 基本使用

```tsx
import Calculator from './components/Calculator';

function App() {
  return (
    <div>
      <Calculator />
    </div>
  );
}
```

### 组件属性

Calculator 组件接受以下属性：

```typescript
interface IProps {
  ESCClick?: () => void;     // ESC按钮点击处理函数
  onOk?: (value: string) => void;  // 确认按钮点击处理函数
  value?: string | number;    // 计算器的初始值
}
```

### 示例

```tsx
function App() {
  const handleESC = () => {
    console.log('ESC clicked');
  };

  const handleResult = (value: string) => {
    console.log('Result:', value);
  };

  return (
    <Calculator 
      ESCClick={handleESC}
      onOk={handleResult}
      value="123"
    />
  );
}
```

## 功能说明

1. **数字输入**
   - 支持 0-9 数字输入
   - 支持小数点输入
   - 自动处理前导零

2. **运算符**
   - 加（+）
   - 减（-）
   - 乘（*）
   - 除（÷）
   - 括号（()）

3. **功能按钮**
   - AC：清除所有输入
   - C：删除最后一个字符
   - +-：正负号切换
   - =：计算结果

4. **显示区域**
   - 上方显示当前输入的表达式
   - 下方实时显示计算结果
   - 根据内容长度自动调整字体大小

5. **错误处理**
   - 输入错误表达式时会显示错误提示
   - 防止除以零等非法操作

## 开发命令

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 技术栈

- React
- TypeScript
- Ant Design
- SCSS
- Math.js

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT