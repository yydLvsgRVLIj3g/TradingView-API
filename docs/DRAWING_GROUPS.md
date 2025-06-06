# Drawing Groups Documentation

This document explains how to use drawing groups with the ChartDrawings class to organize your TradingView chart drawings.

## Overview

Drawing groups allow you to organize related drawings together on TradingView charts. For example, you can group all support/resistance lines together, or create a group for price targets. This makes it easier to manage and organize complex chart analysis.

## Key Features

- Create named drawing groups
- Assign drawings to groups during creation
- Add existing drawings to groups
- Filter drawings by group
- Remove groups and manage group assignments
- Complete integration with TradingView's API structure

## Basic Usage

### 1. Creating Drawing Groups

```javascript
const ChartDrawings = require('./src/classes/ChartDrawings');
const chartDrawings = new ChartDrawings();

// Create a drawing group
const supportGroup = chartDrawings.createDrawingGroup({
  name: 'Support Levels',
  symbol: 'BINANCE:BTCUSDT'
});

console.log(supportGroup);
// Output:
// {
//   id: 'abc123',
//   name: 'Support Levels',
//   symbol: 'BINANCE:BTCUSDT',
//   currencyId: null,
//   unitId: null
// }
```

### 2. Creating Drawings with Group Assignment

```javascript
// Create a trend line and assign it to a group
const supportLine = chartDrawings.createTrendLine({
  id: 'support-line-1',
  symbol: 'BINANCE:BTCUSDT',
  groupId: supportGroup.id, // Assign to group
  points: [
    { time_t: 1748923800, offset: 0, price: 45000, interval: '5' },
    { time_t: 1749139800, offset: 0, price: 45000, interval: '5' }
  ],
  style: {
    linecolor: 'rgba(76, 175, 80, 1)', // Green color
    text: 'Strong Support'
  }
});

// Create a rectangle in the same group
const supportZone = chartDrawings.createRectangle({
  id: 'support-zone-1',
  symbol: 'BINANCE:BTCUSDT',
  groupId: supportGroup.id, // Same group
  points: [
    { time_t: 1749000000, offset: 0, price: 44500, interval: '5' },
    { time_t: 1749200000, offset: 0, price: 45500, interval: '5' }
  ],
  style: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    text: 'Support Zone'
  }
});
```

### 3. Creating Complete Drawing Sources

```javascript
// Create multiple groups
const resistanceGroup = chartDrawings.createDrawingGroup({
  name: 'Resistance Levels',
  symbol: 'BINANCE:BTCUSDT'
});

// Create drawings for different groups
const resistanceLine = chartDrawings.createTrendLine({
  id: 'resistance-line-1',
  symbol: 'BINANCE:BTCUSDT',
  groupId: resistanceGroup.id,
  points: [
    { time_t: 1748923800, offset: 0, price: 48000, interval: '5' },
    { time_t: 1749139800, offset: 0, price: 48000, interval: '5' }
  ],
  style: {
    linecolor: 'rgba(244, 67, 54, 1)', // Red color
    text: 'Key Resistance'
  }
});

// Create complete drawing sources data
const drawingSources = chartDrawings.createDrawingSources({
  drawings: [supportLine, supportZone, resistanceLine],
  groups: [supportGroup, resistanceGroup]
});
```

### 4. Managing Groups and Drawings

```javascript
// Add an existing drawing to a group
const newLine = chartDrawings.createTrendLine({
  id: 'trend-line-1',
  symbol: 'BINANCE:BTCUSDT',
  points: [
    { time_t: 1749000000, offset: 0, price: 46000, interval: '5' },
    { time_t: 1749100000, offset: 0, price: 47000, interval: '5' }
  ]
});

const groupedLine = chartDrawings.addDrawingToGroup(newLine, supportGroup.id);

// Filter drawings by group
const supportDrawings = chartDrawings.getDrawingsByGroup(drawingSources, supportGroup.id);
console.log(`Found ${supportDrawings.length} drawings in support group`);

// Get all groups
const allGroups = chartDrawings.getDrawingGroups(drawingSources);
console.log('All groups:', allGroups.map(g => g.name));

// Remove a group (and unassign all drawings from it)
const updatedSources = chartDrawings.removeDrawingGroup(drawingSources, resistanceGroup.id);
```

## Saving to TradingView

```javascript
const credentials = {
  session: 'your_session_id',
  signature: 'your_session_signature',
  id: 123456
};

const chartDrawings = new ChartDrawings(credentials);

// Save the grouped drawings to TradingView
async function saveGroupedDrawings() {
  try {
    const layoutId = 'your_layout_id';
    const result = await chartDrawings.saveDrawings(layoutId, drawingSources);
    console.log('Drawings saved successfully:', result);
  } catch (error) {
    console.error('Error saving drawings:', error.message);
  }
}
```

## API Structure

The complete structure sent to TradingView includes:

```javascript
{
  "sources": {
    "drawing-id-1": {
      "id": "drawing-id-1",
      "groupId": "group-id-1", // Group assignment
      // ... other drawing properties
    }
  },
  "drawing_groups": {
    "group-id-1": {
      "id": "group-id-1",
      "name": "Group Name",
      "symbol": "BINANCE:BTCUSDT",
      "currencyId": null,
      "unitId": null
    }
  },
  "clientId": "client-id"
}
```

## Real-World Example

Here's a complete example of organizing a technical analysis setup:

```javascript
const ChartDrawings = require('./src/classes/ChartDrawings');

async function createTechnicalAnalysis() {
  const credentials = { /* your credentials */ };
  const chartDrawings = new ChartDrawings(credentials);
  
  // Create groups for different analysis types
  const groups = [
    chartDrawings.createDrawingGroup({
      name: 'Support & Resistance',
      symbol: 'BINANCE:BTCUSDT'
    }),
    chartDrawings.createDrawingGroup({
      name: 'Price Targets',
      symbol: 'BINANCE:BTCUSDT'
    }),
    chartDrawings.createDrawingGroup({
      name: 'Trend Analysis',
      symbol: 'BINANCE:BTCUSDT'
    })
  ];
  
  const [srGroup, targetGroup, trendGroup] = groups;
  
  // Create drawings for each group
  const drawings = [
    // Support/Resistance lines
    chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:BTCUSDT',
      groupId: srGroup.id,
      points: [
        { time_t: 1748923800, offset: 0, price: 45000, interval: '5' },
        { time_t: 1749139800, offset: 0, price: 45000, interval: '5' }
      ],
      style: { linecolor: 'rgba(76, 175, 80, 1)', text: 'Major Support' }
    }),
    
    chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:BTCUSDT',
      groupId: srGroup.id,
      points: [
        { time_t: 1748923800, offset: 0, price: 48000, interval: '5' },
        { time_t: 1749139800, offset: 0, price: 48000, interval: '5' }
      ],
      style: { linecolor: 'rgba(244, 67, 54, 1)', text: 'Key Resistance' }
    }),
    
    // Price target zone
    chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:BTCUSDT',
      groupId: targetGroup.id,
      points: [
        { time_t: 1749000000, offset: 0, price: 49000, interval: '5' },
        { time_t: 1749200000, offset: 0, price: 51000, interval: '5' }
      ],
      style: { 
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        text: 'Target Zone'
      }
    }),
    
    // Trend line
    chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:BTCUSDT',
      groupId: trendGroup.id,
      points: [
        { time_t: 1748800000, offset: 0, price: 43000, interval: '5' },
        { time_t: 1749200000, offset: 0, price: 47000, interval: '5' }
      ],
      style: { 
        linecolor: 'rgba(156, 39, 176, 1)',
        text: 'Uptrend Line'
      }
    })
  ];
  
  // Create final sources structure
  const drawingSources = chartDrawings.createDrawingSources({
    drawings,
    groups
  });
  
  // Save to TradingView
  const layoutId = 'your_layout_id';
  const result = await chartDrawings.saveDrawings(layoutId, drawingSources);
  
  console.log('Technical analysis saved with', groups.length, 'groups and', drawings.length, 'drawings');
  return result;
}
```

## Benefits of Using Groups

1. **Organization**: Keep related drawings together
2. **Management**: Easily find and modify drawings by category
3. **Clarity**: Better visual organization on charts
4. **Scalability**: Manage complex analysis with many drawings
5. **Collaboration**: Share organized analysis with clear categorization

## API Methods Reference

### Group Management
- `createDrawingGroup(options)` - Create a new drawing group
- `getDrawingGroups(drawingSources)` - Get all groups from drawing sources
- `removeDrawingGroup(drawingSources, groupId)` - Remove a group

### Drawing Management
- `createTrendLine(options)` - Create trend line (with optional groupId)
- `createRectangle(options)` - Create rectangle (with optional groupId)
- `addDrawingToGroup(drawing, groupId)` - Add existing drawing to group
- `getDrawingsByGroup(drawingSources, groupId)` - Filter drawings by group

### Data Management
- `createDrawingSources(options)` - Create complete sources structure
- `saveDrawings(layoutId, drawingSources)` - Save to TradingView
- `getDrawings(layoutId)` - Retrieve from TradingView
