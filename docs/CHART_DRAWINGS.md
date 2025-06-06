# TradingView Chart Drawings API

This document describes the ChartDrawings API for saving and managing drawings on TradingView charts.

## Overview

The ChartDrawings API allows you to programmatically create, save, and retrieve drawing objects (like trend lines, support/resistance lines, etc.) on TradingView charts. This is useful for:

- Automated technical analysis
- Backtesting strategies with visual markers
- Sharing chart annotations programmatically
- Building custom trading tools

## Authentication

The API requires TradingView session credentials:

```javascript
const credentials = {
  session: 'your_session_id',      // Required
  signature: 'your_signature',     // Required for private layouts
  id: 12345                        // User ID (optional)
};
```

## Basic Usage

```javascript
const TradingView = require('tradingview-api');

// Initialize with credentials
const chartDrawings = new TradingView.ChartDrawings({
  session: process.env.SESSION,
  signature: process.env.SIGNATURE,
  id: process.env.USER_ID
});

// Create a trend line
const trendLine = chartDrawings.createTrendLine({
  id: chartDrawings.generateDrawingId(),
  symbol: 'BINANCE:BTCUSDT',
  points: [
    { time_t: 1649165300, offset: 0, price: 40000, interval: '5m' },
    { time_t: 1649150000, offset: 0, price: 41000, interval: '5m' }
  ],
  style: {
    linecolor: 'rgba(255, 0, 0, 1)',
    linewidth: 2,
    text: 'Support Line'
  }
});

// Save to layout
const drawingData = {
  sources: { [trendLine.id]: trendLine },
  drawing_groups: {},
  clientId: chartDrawings.generateClientId()
};

await chartDrawings.saveDrawings('your_layout_id', drawingData);
```

## API Reference

### Class: ChartDrawings

#### Constructor

```javascript
new ChartDrawings(credentials)
```

**Parameters:**
- `credentials` (Object): Authentication credentials
  - `session` (string): TradingView session ID
  - `signature` (string): Session signature (required for private layouts)
  - `id` (number): User ID (optional)

#### Methods

##### saveDrawings(layoutId, drawingData, chartId)

Saves drawing objects to a TradingView chart layout.

**Parameters:**
- `layoutId` (string): The layout ID from the chart URL
- `drawingData` (Object): Drawing sources data
  - `sources` (Object): Map of drawing ID to drawing object
  - `drawing_groups` (Object): Drawing groups (usually empty)
  - `clientId` (string): Client identifier
- `chartId` (string): Chart ID (default: '_shared')

**Returns:** Promise<Object> - API response

**Example:**
```javascript
await chartDrawings.saveDrawings('8N39bUTh', {
  sources: { 'drawing1': trendLineObject },
  drawing_groups: {},
  clientId: 'client123'
});
```

##### getDrawings(layoutId, chartId, symbol)

Retrieves drawing objects from a TradingView chart layout.

**Parameters:**
- `layoutId` (string): The layout ID
- `chartId` (string): Chart ID (default: '_shared')
- `symbol` (string): Symbol filter (optional)

**Returns:** Promise<Object> - Drawing sources

##### createTrendLine(options)

Creates a trend line drawing object.

**Parameters:**
- `options` (Object):
  - `id` (string): Unique drawing ID
  - `symbol` (string): Market symbol (e.g., 'BINANCE:BTCUSDT')
  - `points` (Array): Array of exactly 2 point objects
    - `time_t` (number): Unix timestamp
    - `offset` (number): Time offset (usually 0)
    - `price` (number): Price level
    - `interval` (string): Time interval
  - `style` (Object): Style configuration (optional)
    - `linecolor` (string): Line color in rgba format
    - `linewidth` (number): Line width
    - `linestyle` (number): Line style (0=solid, 1=dotted, 2=dashed)
    - `extendLeft` (boolean): Extend line to left
    - `extendRight` (boolean): Extend line to right
    - `text` (string): Text label
    - `title` (string): Title
    - `textcolor` (string): Text color in rgba format
    - `fontsize` (number): Font size

**Returns:** DrawingState object

**Example:**
```javascript
const trendLine = chartDrawings.createTrendLine({
  id: 'trend1',
  symbol: 'BINANCE:BTCUSDT',
  points: [
    { time_t: 1649165300, offset: 0, price: 40000, interval: '1h' },
    { time_t: 1649150000, offset: 0, price: 41000, interval: '1h' }
  ],
  style: {
    linecolor: 'rgba(255, 0, 0, 1)',
    linewidth: 2,
    extendRight: true,
    text: 'Uptrend'
  }
});
```

#### Utility Methods

##### generateDrawingId()
Generates a random 6-character drawing ID.

##### generateLinkKey()
Generates a random 15-character link key for sharing.

##### generateClientId()
Generates a client ID in the format "xxxxxx/x/xxxxxx".

## Drawing Types

### Trend Line

The most common drawing type. Connects two points with a line that can be extended.

**Default Style Properties:**
```javascript
{
  linecolor: 'rgba(242, 54, 69, 1)',
  linewidth: 1,
  linestyle: 0,
  extendLeft: false,
  extendRight: false,
  showLabel: true,
  textcolor: 'rgba(255, 235, 59, 1)',
  fontsize: 16,
  bold: false,
  italic: false,
  visible: true,
  frozen: false
}
```

## Point Structure

Each drawing point must include:

```javascript
{
  time_t: 1649165300,           // Unix timestamp
  offset: 0,                    // Time offset
  price: 40000.50,             // Price level
  interval: '5'                 // Time interval ('1', '5', '15', '1h', 'D', etc.)
}
```

## Color Format

Colors should be specified in RGBA format:
- `'rgba(255, 0, 0, 1)'` - Red
- `'rgba(0, 255, 0, 0.5)'` - Semi-transparent green
- `'rgba(0, 0, 255, 1)'` - Blue

## Error Handling

The API throws descriptive errors for common issues:

```javascript
try {
  await chartDrawings.saveDrawings(layoutId, drawingData);
} catch (error) {
  if (error.message.includes('JWT token')) {
    // Handle authentication error
  } else if (error.message.includes('API Error')) {
    // Handle API-specific error
  } else {
    // Handle network or other errors
  }
}
```

## Common Errors

- **"Session credentials required for JWT token"**: Missing session in credentials
- **"Layout ID is required"**: Missing or invalid layout ID
- **"Drawing data with sources is required"**: Invalid drawing data structure
- **"API Error 401"**: Invalid authentication credentials
- **"API Error 404"**: Layout not found or no access

## Examples

### Multiple Drawings

```javascript
const drawings = {};

// Support line
const support = chartDrawings.createTrendLine({
  id: chartDrawings.generateDrawingId(),
  symbol: 'BINANCE:BTCUSDT',
  points: [
    { time_t: 1649165300, offset: 0, price: 39000, interval: '1h' },
    { time_t: 1649150000, offset: 0, price: 39100, interval: '1h' }
  ],
  style: {
    linecolor: 'rgba(76, 175, 80, 1)', // Green
    text: 'Support'
  }
});
drawings[support.id] = support;

// Resistance line
const resistance = chartDrawings.createTrendLine({
  id: chartDrawings.generateDrawingId(),
  symbol: 'BINANCE:BTCUSDT',
  points: [
    { time_t: 1649165300, offset: 0, price: 42000, interval: '1h' },
    { time_t: 1649150000, offset: 0, price: 42100, interval: '1h' }
  ],
  style: {
    linecolor: 'rgba(244, 67, 54, 1)', // Red
    text: 'Resistance'
  }
});
drawings[resistance.id] = resistance;

await chartDrawings.saveDrawings(layoutId, {
  sources: drawings,
  drawing_groups: {},
  clientId: chartDrawings.generateClientId()
});
```

### Retrieving Saved Drawings

```javascript
const savedDrawings = await chartDrawings.getDrawings(layoutId);
console.log('Found drawings:', Object.keys(savedDrawings.sources));

// Filter by symbol
const btcDrawings = await chartDrawings.getDrawings(layoutId, '_shared', 'BINANCE:BTCUSDT');
```

## Best Practices

1. **Always generate unique IDs** for drawings to avoid conflicts
2. **Use descriptive text labels** for better chart readability
3. **Set appropriate colors** that contrast with the chart background
4. **Handle errors gracefully** with try-catch blocks
5. **Validate point data** before creating drawings
6. **Use consistent intervals** for points in the same drawing
7. **Test with small datasets** before bulk operations

## Rate Limiting

Be mindful of TradingView's rate limits when making multiple API calls. Consider:
- Adding delays between requests
- Batching multiple drawings in single API calls
- Implementing retry logic for failed requests

## Security Notes

- Keep your session credentials secure
- Don't commit credentials to version control
- Use environment variables for sensitive data
- Rotate credentials regularly
- Only use over HTTPS connections
