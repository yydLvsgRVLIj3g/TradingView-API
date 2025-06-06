# Drawing Parser

The `DrawingParser` class provides a comprehensive solution for parsing and working with TradingView drawing data from the `getDrawings` API response. It converts raw drawing data into structured, type-safe objects with additional utility methods for filtering and analysis.

## Features

- **Type-safe parsing** of drawing responses
- **Support for all drawing types** (Rectangles, Trend Lines, Paths, Tables, etc.)
- **Drawing filtering** by type, symbol, and group
- **Summary statistics** generation
- **Error handling** with descriptive messages
- **Backward compatibility** with raw responses

## Usage

### Basic Usage

```javascript
const client = require('@mathieuc/tradingview');
const DrawingParser = require('./src/classes/DrawingParser');

// Get parsed drawings (new default behavior)
const result = await client.getDrawings(layoutId, symbol, credentials);

console.log('Total drawings:', result.drawings.length);
console.log('Drawing groups:', result.groups.length);
console.log('Success:', result.success);

// Get raw drawings (legacy behavior)
const rawDrawings = await client.getDrawings(layoutId, symbol, credentials, '_shared', false);
```

### Filtering Drawings

```javascript
const { drawings } = await client.getDrawings(layoutId);

// Filter by type
const rectangles = DrawingParser.filterByType(drawings, DrawingParser.DRAWING_TYPES.RECTANGLE);
const trendLines = DrawingParser.filterByType(drawings, DrawingParser.DRAWING_TYPES.TREND_LINE);

// Filter by symbol
const btcDrawings = DrawingParser.filterBySymbol(drawings, 'BINANCE:BTCUSDT');

// Filter by group
const groupedDrawings = DrawingParser.filterByGroup(drawings, 'groupId');
```

### Summary Statistics

```javascript
const summary = DrawingParser.getSummary(drawings);

console.log('Total drawings:', summary.total);
console.log('Visible drawings:', summary.visible);
console.log('Frozen drawings:', summary.frozen);
console.log('Grouped drawings:', summary.grouped);
console.log('Type breakdown:', summary.typeCount);
console.log('Symbol breakdown:', summary.symbolCount);
```

## Supported Drawing Types

The parser supports all major TradingView drawing types:

| Constant | Value | Description |
|----------|-------|-------------|
| `RECTANGLE` | `LineToolRectangle` | Rectangle drawings |
| `TREND_LINE` | `LineToolTrendLine` | Trend line drawings |
| `PATH` | `LineToolPath` | Free-form path drawings |
| `TABLE` | `LineToolTable` | Table/text box drawings |
| `HORIZONTAL_LINE` | `LineToolHorzLine` | Horizontal lines |
| `VERTICAL_LINE` | `LineToolVertLine` | Vertical lines |
| `PARALLEL_CHANNEL` | `LineToolParallelChannel` | Parallel channel drawings |
| `FIBONACCI_RETRACEMENT` | `LineToolFibRetracement` | Fibonacci retracement |
| `FIBONACCI_EXTENSION` | `LineToolFibExtension` | Fibonacci extension |
| `ELLIPSE` | `LineToolEllipse` | Ellipse drawings |
| `CIRCLE` | `LineToolCircle` | Circle drawings |
| `ARROW` | `LineToolArrow` | Arrow drawings |
| `TEXT` | `LineToolText` | Text annotations |
| `NOTE` | `LineToolNote` | Note annotations |
| `CALLOUT` | `LineToolCallout` | Callout annotations |

## Data Structures

### ParsedDrawingsResponse

```typescript
interface ParsedDrawingsResponse {
  success: boolean;           // Whether the response was successful
  drawings: ParsedDrawing[];  // Array of parsed drawings
  groups: ParsedDrawingGroup[]; // Array of parsed drawing groups
  raw: Object;               // Raw response data
}
```

### ParsedDrawing

```typescript
interface ParsedDrawing {
  id: string;                // Drawing ID
  type: string;              // Drawing type (e.g., 'LineToolRectangle')
  symbol: string;            // Symbol associated with the drawing
  ownerSource: string;       // Owner source identifier
  serverUpdateTime: number;  // Last update timestamp
  points: ParsedPoint[];     // Array of drawing points
  zorder: number;            // Drawing Z-order
  linkKey: string;           // Drawing link key
  sharingMode: number;       // Sharing mode
  style: Object;             // Drawing style properties
  groupId?: string;          // Group ID if drawing belongs to a group
  title?: string;            // Drawing title
  text?: string;             // Drawing text content
  interval: string;          // Drawing interval
  visible: boolean;          // Whether drawing is visible
  frozen: boolean;           // Whether drawing is frozen
}
```

### ParsedPoint

```typescript
interface ParsedPoint {
  time_t: number;    // Point X time position
  price: number;     // Point Y price position
  offset: number;    // Point offset
  interval: string;  // Time interval
}
```

### ParsedDrawingGroup

```typescript
interface ParsedDrawingGroup {
  id: string;               // Group ID
  symbol: string;           // Symbol associated with the group
  serverUpdateTime: number; // Last update timestamp
  name: string;             // Group name
}
```

## API Reference

### Static Methods

#### `parse(rawResponse)`

Parses raw getDrawings response into structured data.

**Parameters:**
- `rawResponse` (Object): Raw response from getDrawings API

**Returns:** `ParsedDrawingsResponse`

**Throws:** Error if response is invalid

#### `parseDrawings(sources)`

Parses drawings from sources object.

**Parameters:**
- `sources` (Object): Sources object from API response

**Returns:** `ParsedDrawing[]`

#### `parseDrawing(drawing)`

Parses a single drawing.

**Parameters:**
- `drawing` (Object): Raw drawing object

**Returns:** `ParsedDrawing`

#### `parsePoints(points)`

Parses drawing points.

**Parameters:**
- `points` (Array): Array of point objects

**Returns:** `ParsedPoint[]`

#### `parseDrawingGroups(groups)`

Parses drawing groups.

**Parameters:**
- `groups` (Object): Groups object from API response

**Returns:** `ParsedDrawingGroup[]`

#### `filterByType(drawings, type)`

Filters drawings by type.

**Parameters:**
- `drawings` (ParsedDrawing[]): Array of drawings
- `type` (string): Drawing type to filter by

**Returns:** `ParsedDrawing[]`

#### `filterBySymbol(drawings, symbol)`

Filters drawings by symbol.

**Parameters:**
- `drawings` (ParsedDrawing[]): Array of drawings
- `symbol` (string): Symbol to filter by

**Returns:** `ParsedDrawing[]`

#### `filterByGroup(drawings, groupId)`

Filters drawings by group.

**Parameters:**
- `drawings` (ParsedDrawing[]): Array of drawings
- `groupId` (string): Group ID to filter by

**Returns:** `ParsedDrawing[]`

#### `getSummary(drawings)`

Gets drawings summary statistics.

**Parameters:**
- `drawings` (ParsedDrawing[]): Array of drawings

**Returns:** Object with summary statistics

## Type-Specific Style Properties

### Rectangle Style

```javascript
{
  color: string,              // Border color
  fillBackground: boolean,    // Whether to fill background
  backgroundColor: string,    // Background color
  linewidth: number,         // Border line width
  transparency: number,      // Background transparency
  showLabel: boolean,        // Whether to show label
  horzLabelsAlign: string,   // Horizontal label alignment
  vertLabelsAlign: string,   // Vertical label alignment
  textColor: string,         // Text color
  fontSize: number,          // Font size
  bold: boolean,             // Bold text
  italic: boolean,           // Italic text
  extendLeft: boolean,       // Extend left
  extendRight: boolean,      // Extend right
  middleLine: Object,        // Middle line configuration
  linestyle: number          // Line style
}
```

### Trend Line Style

```javascript
{
  linecolor: string,           // Line color
  linewidth: number,          // Line width
  linestyle: number,          // Line style
  extendLeft: boolean,        // Extend left
  extendRight: boolean,       // Extend right
  leftEnd: number,            // Left end style
  rightEnd: number,           // Right end style
  showLabel: boolean,         // Show label
  alwaysShowStats: boolean,   // Always show statistics
  showMiddlePoint: boolean,   // Show middle point
  showPriceLabels: boolean,   // Show price labels
  showPriceRange: boolean,    // Show price range
  showAngle: boolean,         // Show angle
  snapTo45Degrees: boolean,   // Snap to 45 degrees
  // ... and more
}
```

### Table Style

```javascript
{
  backgroundColor: string,    // Background color
  borderColor: string,       // Border color
  textColor: string,         // Text color
  fontSize: number,          // Font size
  horzAlign: string,         // Horizontal alignment
  anchored: boolean,         // Whether table is anchored
  rowsCount: number,         // Number of rows
  colsCount: number,         // Number of columns
  cells: Array[],            // Cell contents
  columnWidths: number[],    // Column widths
  rowHeights: number[]       // Row heights
}
```

## Error Handling

The parser includes comprehensive error handling:

```javascript
try {
  const result = DrawingParser.parse(response);
} catch (error) {
  if (error.message.includes('Invalid response')) {
    // Handle invalid response
  } else if (error.message.includes('Response indicates failure')) {
    // Handle API failure
  } else if (error.message.includes('No payload')) {
    // Handle missing payload
  }
}
```

## Migration Guide

### From Raw Response to Parsed Response

**Before:**
```javascript
const drawings = await client.getDrawings(layoutId);
// drawings is an array of raw drawing objects
```

**After:**
```javascript
const result = await client.getDrawings(layoutId);
// result.drawings is an array of parsed drawing objects
// result.groups is an array of drawing groups
// result.success indicates API success
// result.raw contains the original response
```

### Maintaining Backward Compatibility

To get the old behavior:
```javascript
const rawDrawings = await client.getDrawings(layoutId, symbol, credentials, chartID, false);
```

## Examples

See `examples/DrawingParserExample.js` for comprehensive usage examples.

## Testing

The parser includes comprehensive unit tests covering:
- Valid response parsing
- Error handling
- Drawing type-specific parsing
- Filtering operations
- Summary statistics
- Edge cases

Run tests with:
```bash
npm test -- tests/drawingParser.test.ts
```
