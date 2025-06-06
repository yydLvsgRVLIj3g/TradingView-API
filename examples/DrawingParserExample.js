const client = require('../main');
const DrawingParser = require('../src/classes/DrawingParser');

/**
 * Example demonstrating how to use the DrawingParser with getDrawings
 */
async function exampleDrawingParser() {
  console.log('=== Drawing Parser Example ===\n');

  // Example layout ID - replace with a real one
  const layoutId = 'YOUR_LAYOUT_ID';
  const symbol = 'BINANCE:BTCUSDT'; // Optional symbol filter
  
  // User credentials (required for private layouts)
  const credentials = {
    session: 'YOUR_SESSION_ID',
    signature: 'YOUR_SIGNATURE'
  };

  try {
    console.log('1. Getting drawings with parsing (new behavior)...');
    // Get parsed drawings (default behavior)
    const parsedResult = await client.getDrawings(layoutId, symbol, credentials);
    
    console.log('Parsed Response Structure:');
    console.log('- Success:', parsedResult.success);
    console.log('- Total drawings:', parsedResult.drawings.length);
    console.log('- Total groups:', parsedResult.groups.length);
    
    // Display summary statistics
    const summary = DrawingParser.getSummary(parsedResult.drawings);
    console.log('\nDrawings Summary:');
    console.log('- Total:', summary.total);
    console.log('- Visible:', summary.visible);
    console.log('- Frozen:', summary.frozen);
    console.log('- Grouped:', summary.grouped);
    console.log('- Types:', summary.typeCount);
    console.log('- Symbols:', summary.symbolCount);
    
    console.log('\n2. Getting raw drawings (legacy behavior)...');
    // Get raw drawings (legacy behavior)
    const rawDrawings = await client.getDrawings(layoutId, symbol, credentials, '_shared', false);
    console.log('Raw drawings count:', rawDrawings.length);
    
    console.log('\n3. Filtering examples...');
    
    // Filter by drawing type
    const rectangles = DrawingParser.filterByType(parsedResult.drawings, DrawingParser.DRAWING_TYPES.RECTANGLE);
    const trendLines = DrawingParser.filterByType(parsedResult.drawings, DrawingParser.DRAWING_TYPES.TREND_LINE);
    const tables = DrawingParser.filterByType(parsedResult.drawings, DrawingParser.DRAWING_TYPES.TABLE);
    
    console.log('Rectangles:', rectangles.length);
    console.log('Trend Lines:', trendLines.length);
    console.log('Tables:', tables.length);
    
    // Filter by symbol
    const btcDrawings = DrawingParser.filterBySymbol(parsedResult.drawings, 'BINANCE:BTCUSDT');
    console.log('BTC drawings:', btcDrawings.length);
    
    console.log('\n4. Detailed drawing information...');
    
    // Display detailed info for each drawing
    parsedResult.drawings.forEach((drawing, index) => {
      console.log(`\nDrawing ${index + 1}:`);
      console.log(`- ID: ${drawing.id}`);
      console.log(`- Type: ${drawing.type}`);
      console.log(`- Symbol: ${drawing.symbol}`);
      console.log(`- Points: ${drawing.points.length}`);
      console.log(`- Visible: ${drawing.visible}`);
      console.log(`- Frozen: ${drawing.frozen}`);
      
      if (drawing.groupId) {
        console.log(`- Group ID: ${drawing.groupId}`);
      }
      
      if (drawing.title) {
        console.log(`- Title: ${drawing.title}`);
      }
      
      if (drawing.text) {
        console.log(`- Text: ${drawing.text}`);
      }
      
      // Display type-specific style properties
      if (drawing.type === DrawingParser.DRAWING_TYPES.RECTANGLE) {
        console.log(`- Fill Background: ${drawing.style.fillBackground}`);
        console.log(`- Background Color: ${drawing.style.backgroundColor}`);
      } else if (drawing.type === DrawingParser.DRAWING_TYPES.TREND_LINE) {
        console.log(`- Line Color: ${drawing.style.linecolor}`);
        console.log(`- Line Width: ${drawing.style.linewidth}`);
        console.log(`- Show Stats: ${drawing.style.alwaysShowStats}`);
      } else if (drawing.type === DrawingParser.DRAWING_TYPES.TABLE) {
        console.log(`- Rows: ${drawing.style.rowsCount}`);
        console.log(`- Columns: ${drawing.style.colsCount}`);
      }
      
      // Display points
      if (drawing.points.length > 0) {
        console.log('- Points:');
        drawing.points.forEach((point, i) => {
          console.log(`  Point ${i + 1}: Time=${point.time_t}, Price=${point.price}, Offset=${point.offset}`);
        });
      }
    });
    
    console.log('\n5. Group information...');
    
    // Display group information
    parsedResult.groups.forEach((group, index) => {
      console.log(`\nGroup ${index + 1}:`);
      console.log(`- ID: ${group.id}`);
      console.log(`- Name: ${group.name}`);
      console.log(`- Symbol: ${group.symbol}`);
      console.log(`- Last Updated: ${new Date(group.serverUpdateTime).toISOString()}`);
      
      // Find drawings in this group
      const groupDrawings = DrawingParser.filterByGroup(parsedResult.drawings, group.id);
      console.log(`- Drawings in group: ${groupDrawings.length}`);
    });
    
    console.log('\n6. Parsing custom response...');
    
    // Example of parsing a custom response
    const customResponse = {
      success: true,
      payload: {
        sources: {
          'custom1': {
            id: 'custom1',
            symbol: 'BINANCE:ETHUSDT',
            ownerSource: '_seriesId',
            serverUpdateTime: Date.now(),
            state: {
              type: 'LineToolTrendLine',
              id: 'custom1',
              state: {
                linecolor: 'rgba(255, 0, 0, 1)',
                linewidth: 2,
                visible: true,
                frozen: false
              },
              points: [
                { time_t: 1640995200, price: 3800, interval: '1D' },
                { time_t: 1641081600, price: 4000, interval: '1D' }
              ],
              zorder: -100,
              linkKey: 'test123',
              sharingMode: 1
            }
          }
        },
        drawing_groups: {}
      }
    };
    
    const customParsed = DrawingParser.parse(customResponse);
    console.log('Custom parsed drawings:', customParsed.drawings.length);
    console.log('First custom drawing type:', customParsed.drawings[0]?.type);
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('Wrong layout')) {
      console.log('\nTip: Make sure to use a valid layout ID and correct credentials.');
      console.log('You can find layout IDs in TradingView chart URLs.');
    }
  }
}

/**
 * Example showing available drawing types
 */
function showDrawingTypes() {
  console.log('\n=== Available Drawing Types ===');
  Object.entries(DrawingParser.DRAWING_TYPES).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

/**
 * Example showing how to handle errors
 */
async function errorHandlingExample() {
  console.log('\n=== Error Handling Examples ===');
  
  try {
    // Test with invalid response
    DrawingParser.parse(null);
  } catch (error) {
    console.log('1. Null response error:', error.message);
  }
  
  try {
    // Test with unsuccessful response
    DrawingParser.parse({ success: false });
  } catch (error) {
    console.log('2. Unsuccessful response error:', error.message);
  }
  
  try {
    // Test with missing payload
    DrawingParser.parse({ success: true });
  } catch (error) {
    console.log('3. Missing payload error:', error.message);
  }
  
  try {
    // Test with invalid drawing
    DrawingParser.parseDrawing({});
  } catch (error) {
    console.log('4. Invalid drawing error:', error.message);
  }
}

// Run examples
if (require.main === module) {
  showDrawingTypes();
  errorHandlingExample();
  
  // Uncomment to run the main example (requires valid credentials)
  // exampleDrawingParser();
}

module.exports = {
  exampleDrawingParser,
  showDrawingTypes,
  errorHandlingExample
};
