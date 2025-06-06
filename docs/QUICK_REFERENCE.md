# 绘图分组快速参考

## 🚀 快速开始

```bash
# 基本用法 - 使用默认 BTCUSDT
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh

# 指定用户ID和交易对
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:UNIUSDT.P
```

## 📋 参数说明

| 位置 | 参数 | 必需 | 默认值 | 示例 |
|------|------|------|--------|------|
| 1 | `layout_id` | ✅ | - | `8N39bUTh` |
| 2 | `user_id` | ❌ | `null` | `8810942` |
| 3 | `symbol` | ❌ | `BINANCE:BTCUSDT` | `BINANCE:UNIUSDT.P` |

## 🎯 常用交易对

```bash
# 比特币现货
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:BTCUSDT

# 比特币永续
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:BTCUSDT.P

# 以太坊永续  
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:ETHUSDT.P

# UNI 永续
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:UNIUSDT.P

# SOL 永续
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:SOLUSDT.P
```

## 📦 创建的内容

运行后将创建：

### 🏷️ 绘图分组
- **Support & Resistance** - 支撑阻力分析
- **Price Targets** - 价格目标
- **Trend Analysis** - 趋势分析

### 📊 绘图内容  
- **支撑线**（绿色）- 主要支撑位
- **阻力线**（红色）- 关键阻力位
- **目标区域**（黄色矩形）- 突破目标区间
- **趋势线**（紫色）- 主要上升趋势

## 🔧 环境配置

确保 `.env` 文件包含：
```bash
SESSION=your_session_id_here
SIGNATURE=your_signature_here  
```

## ❌ 常见错误

| 错误 | 解决方法 |
|------|----------|
| `Please set your SESSION and SIGNATURE` | 检查 `.env` 文件 |
| `Please specify a layout ID` | 提供 layout ID 参数 |
| `Failed to get JWT token` | 检查会话是否有效 |
| `API Error 403` | 检查用户权限 |

## 📚 相关文档

- [完整使用指南](DRAWING_GROUPS_USAGE.md)
- [API 文档](DRAWING_GROUPS.md)
- [绘图解析器](DRAWING_PARSER.md)
