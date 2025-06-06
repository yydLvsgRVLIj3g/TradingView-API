# Drawing Groups Example Usage

这个示例展示了如何使用 TradingView API 的绘图分组功能。

## 前置要求

1. **环境变量设置**：
   ```bash
   export SESSION="your_session_id"
   export SIGNATURE="your_session_signature"
   ```

2. **获取 Layout ID**：
   - 打开 TradingView 图表
   - 从 URL 中获取 layout ID（例如：`https://www.tradingview.com/chart/8N39bUTh/` 中的 `8N39bUTh`）

## 使用方法

## 使用方法

### 方法1：使用 --env-file（推荐）
```bash
node --env-file=.env examples/DrawingGroupsExample.js <layout_id> [user_id] [symbol]
```

### 方法2：手动设置环境变量
```bash
export SESSION="your_session_id"
export SIGNATURE="your_session_signature"
node examples/DrawingGroupsExample.js <layout_id> [user_id] [symbol]
```

### 方法3：内联环境变量
```bash
SESSION="your_session" SIGNATURE="your_signature" node examples/DrawingGroupsExample.js <layout_id>
```

### 参数说明

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `layout_id` | ✅ | - | TradingView 图表的 Layout ID |
| `user_id` | ❌ | null | 用户 ID（私有图表需要） |
| `symbol` | ❌ | `BINANCE:BTCUSDT` | 交易对符号 |

## 示例命令

## 示例命令

### 1. 使用 .env 文件和默认参数（比特币）
```bash
# .env 文件已包含 SESSION 和 SIGNATURE
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh
```

### 2. 指定用户 ID（私有图表）
```bash
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942
```

### 3. 指定不同的交易对
```bash
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:ETHUSDT
```

### 4. 使用以太坊永续合约
```bash
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:ETHUSDT.P
```

### 5. 使用 UNI 永续合约
```bash
node --env-file=.env examples/DrawingGroupsExample.js 8N39bUTh 8810942 BINANCE:UNIUSDT.P
```

## 环境变量配置

项目已包含配置好的 `.env` 文件，您可以直接使用 `--env-file=.env` 参数。

### .env 文件格式
```bash
SESSION=your_session_id # Your sessionid cookie
SIGNATURE=your_session_signature # Your signature cookie
```

### 获取环境变量方法

1. **打开浏览器开发者工具**
2. **登录 TradingView** 
3. **查看 Cookie**：
   - `sessionid` → 设置为 `SESSION`
   - `sessionid_sign` → 设置为 `SIGNATURE`

### 如何更新 .env 文件
如果需要更新您的会话信息：
```bash
# 编辑 .env 文件
nano .env

# 或使用其他编辑器
code .env
```

## 示例输出

成功运行后，您将看到：

```
=== TradingView Drawing Groups Example ===
Layout ID: 8N39bUTh
Symbol: BINANCE:BTCUSDT
User ID: Not specified

1. Creating drawing groups...
✓ Created groups: Support & Resistance, Price Targets, Trend Analysis

2. Creating drawings with group assignments...
✓ Created 4 drawings assigned to 3 groups

3. Creating complete drawing sources...
✓ Drawing sources created:
  - 4 drawings
  - 3 groups
  - Client ID: abc123/1/def456

4. Testing group management features...
✓ Found 2 drawings in "Support & Resistance" group
✓ All groups: "Support & Resistance", "Price Targets", "Trend Analysis"
✓ Added additional drawing to "Support & Resistance" group

5. Final drawing sources structure ready for TradingView API
   (Use this data with saveDrawings method)

6. Saving to TradingView...
✓ Drawings saved successfully to layout: 8N39bUTh

7. Retrieving saved drawings to verify...
✓ Retrieved drawings from TradingView:
  - 4 drawings found
  - 3 groups found

✅ Example completed successfully!
```

## 创建的内容

运行示例后，将在您的 TradingView 图表上创建：

### 绘图分组
1. **Support & Resistance** - 支撑阻力分析
2. **Price Targets** - 价格目标
3. **Trend Analysis** - 趋势分析

### 绘图内容
1. **支撑线**（绿色）- 主要支撑位
2. **阻力线**（红色）- 关键阻力位  
3. **目标区域**（黄色矩形）- 突破目标区间
4. **趋势线**（紫色）- 主要上升趋势

## 错误处理

### 常见错误和解决方法

1. **`Please set your SESSION and SIGNATURE environment variables`**
   - 检查环境变量是否正确设置

2. **`Please specify a layout ID as the first argument`**
   - 确保提供了 layout ID 参数

3. **`Failed to get JWT token`**
   - 检查 SESSION 和 SIGNATURE 是否有效
   - 确保用户 ID 正确（如果是私有图表）

4. **`API Error 403: Forbidden`**
   - 检查权限，确保有访问该图表的权限

## 相关文件

- `examples/GetDrawings.js` - 获取绘图示例
- `examples/SaveDrawings.js` - 保存绘图示例  
- `docs/DRAWING_GROUPS.md` - 绘图分组完整文档
