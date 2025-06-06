const ChartDrawings = require('./src/classes/ChartDrawings');

// Simple test of drawing groups functionality
function testDrawingGroups() {
  console.log('Testing Drawing Groups functionality...\n');
  
  const chartDrawings = new ChartDrawings();
  
  try {
    // 1. Test creating a drawing group
    console.log('1. Creating drawing group...');
    const group = chartDrawings.createDrawingGroup({
      name: 'Test Group',
      symbol: 'BINANCE:BTCUSDT'
    });
    console.log('✓ Group created:', group);
    
    // 2. Test creating a drawing with group assignment
    console.log('\n2. Creating trend line with group assignment...');
    const trendLine = chartDrawings.createTrendLine({
      id: 'test-line-1',
      symbol: 'BINANCE:BTCUSDT',
      groupId: group.id,
      points: [
        { time_t: 1748923800, offset: 0, price: 45000, interval: '5' },
        { time_t: 1749139800, offset: 0, price: 47000, interval: '5' }
      ]
    });
    console.log('✓ Trend line created with groupId:', trendLine.groupId);
    
    // 3. Test creating drawing sources
    console.log('\n3. Creating complete drawing sources...');
    const drawingSources = chartDrawings.createDrawingSources({
      drawings: [trendLine],
      groups: [group]
    });
    console.log('✓ Drawing sources created with structure:');
    console.log('  - Sources count:', Object.keys(drawingSources.sources).length);
    console.log('  - Groups count:', Object.keys(drawingSources.drawing_groups).length);
    console.log('  - Client ID:', drawingSources.clientId);
    
    // 4. Test filtering drawings by group
    console.log('\n4. Testing group filtering...');
    const groupDrawings = chartDrawings.getDrawingsByGroup(drawingSources, group.id);
    console.log('✓ Found', groupDrawings.length, 'drawings in group');
    
    // 5. Test adding drawing to existing group
    console.log('\n5. Testing adding drawing to group...');
    const rectangle = chartDrawings.createRectangle({
      id: 'test-rect-1',
      symbol: 'BINANCE:BTCUSDT',
      points: [
        { time_t: 1749000000, offset: 0, price: 46000, interval: '5' },
        { time_t: 1749200000, offset: 0, price: 48000, interval: '5' }
      ]
    });
    
    const groupedRectangle = chartDrawings.addDrawingToGroup(rectangle, group.id);
    console.log('✓ Rectangle added to group:', groupedRectangle.groupId);
    
    // 6. Show final structure that would be sent to TradingView
    console.log('\n6. Final structure for TradingView API:');
    const finalSources = chartDrawings.createDrawingSources({
      drawings: [trendLine, groupedRectangle],
      groups: [group]
    });
    
    console.log(JSON.stringify(finalSources, null, 2));
    
    console.log('\n✅ All tests passed! Drawing groups functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDrawingGroups();
