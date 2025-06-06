const TradingView = require('../main');

/**
 * Example of using drawing groups with ChartDrawings
 * This example shows how to:
 * 1. Create drawing groups
 * 2. Create drawings and assign them to groups
 * 3. Save grouped drawings to TradingView
 * 4. Manage and organize drawings by groups
 * 
 * Requirements:
 * - Valid TradingView session credentials (SESSION and SIGNATURE environment variables)
 * - A valid layout ID (you can get this from a chart URL)
 * 
 * Usage:
 * node examples/DrawingGroupsExample.js <layout_id> [user_id] [symbol]
 */

// Check for required parameters and environment variables
if (!process.env.SESSION || !process.env.SIGNATURE) {
  throw Error('Please set your SESSION and SIGNATURE environment variables');
}

if (!process.argv[2]) {
  throw Error('Please specify a layout ID as the first argument');
}

const layoutId = process.argv[2];
const userId = process.argv[3] || null;
const symbol = process.argv[4] || 'BINANCE:BTCUSDT';

async function main() {
  // Initialize ChartDrawings with credentials from environment
  const chartDrawings = new TradingView.ChartDrawings({
    session: process.env.SESSION,
    signature: process.env.SIGNATURE,
    id: userId,
  });
  
  try {
    console.log('=== TradingView Drawing Groups Example ===');
    console.log(`Layout ID: ${layoutId}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`User ID: ${userId || 'Not specified'}\n`);
    
    // 1. Create drawing groups for different analysis types
    console.log('1. Creating drawing groups...');
    const supportResistanceGroup = chartDrawings.createDrawingGroup({
      name: 'Support & Resistance',
      symbol: symbol
    });
    
    const priceTargetsGroup = chartDrawings.createDrawingGroup({
      name: 'Price Targets',
      symbol: symbol
    });
    
    const trendAnalysisGroup = chartDrawings.createDrawingGroup({
      name: 'Trend Analysis', 
      symbol: symbol
    });
    
    console.log('✓ Created groups:', [
      supportResistanceGroup.name,
      priceTargetsGroup.name,
      trendAnalysisGroup.name
    ]);
    
    // 2. Create drawings and assign them to groups
    console.log('\n2. Creating drawings with group assignments...');
    
    // Support line (green)
    const supportLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: symbol,
      groupId: supportResistanceGroup.id,
      points: [
        { time_t: 1748923800, offset: 0, price: 45000, interval: '5' },
        { time_t: 1749139800, offset: 0, price: 45000, interval: '5' }
      ],
      style: {
        linecolor: 'rgba(76, 175, 80, 1)', // Green
        linewidth: 2,
        text: 'Major Support Level',
        showLabel: true
      }
    });
    
    // Resistance line (red)
    const resistanceLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: symbol,
      groupId: supportResistanceGroup.id,
      points: [
        { time_t: 1748923800, offset: 0, price: 48000, interval: '5' },
        { time_t: 1749139800, offset: 0, price: 48000, interval: '5' }
      ],
      style: {
        linecolor: 'rgba(244, 67, 54, 1)', // Red
        linewidth: 2,
        text: 'Key Resistance',
        showLabel: true
      }
    });
    
    // Price target zone (yellow rectangle)
    const targetZone = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: symbol,
      groupId: priceTargetsGroup.id,
      points: [
        { time_t: 1749000000, offset: 0, price: 49000, interval: '5' },
        { time_t: 1749200000, offset: 0, price: 51000, interval: '5' }
      ],
      style: {
        backgroundColor: 'rgba(255, 193, 7, 0.3)', // Yellow with transparency
        color: 'rgba(255, 193, 7, 1)',
        text: 'Breakout Target Zone',
        showLabel: true
      }
    });
    
    // Uptrend line (purple)
    const trendLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: symbol,
      groupId: trendAnalysisGroup.id,
      points: [
        { time_t: 1748800000, offset: 0, price: 43000, interval: '5' },
        { time_t: 1749200000, offset: 0, price: 47000, interval: '5' }
      ],
      style: {
        linecolor: 'rgba(156, 39, 176, 1)', // Purple
        linewidth: 3,
        text: 'Primary Uptrend',
        showLabel: true,
        extendRight: true
      }
    });
    
    console.log('✓ Created 4 drawings assigned to 3 groups');
    
    // 3. Create complete drawing sources data
    console.log('\n3. Creating complete drawing sources...');
    const drawingSources = chartDrawings.createDrawingSources({
      drawings: [supportLine, resistanceLine, targetZone, trendLine],
      groups: [supportResistanceGroup, priceTargetsGroup, trendAnalysisGroup]
    });
    
    console.log('✓ Drawing sources created:');
    console.log(`  - ${Object.keys(drawingSources.sources).length} drawings`);
    console.log(`  - ${Object.keys(drawingSources.drawing_groups).length} groups`);
    console.log(`  - Client ID: ${drawingSources.clientId}`);
    
    // 4. Demonstrate group management features
    console.log('\n4. Testing group management features...');
    
    // Filter drawings by group
    const srDrawings = chartDrawings.getDrawingsByGroup(drawingSources, supportResistanceGroup.id);
    console.log(`✓ Found ${srDrawings.length} drawings in "${supportResistanceGroup.name}" group`);
    
    // Get all groups
    const allGroups = chartDrawings.getDrawingGroups(drawingSources);
    console.log('✓ All groups:', allGroups.map(g => `"${g.name}"`).join(', '));
    
    // Add another drawing to existing group
    const additionalSupport = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: symbol,
      points: [
        { time_t: 1748900000, offset: 0, price: 44000, interval: '5' },
        { time_t: 1749150000, offset: 0, price: 44000, interval: '5' }
      ],
      style: {
        linecolor: 'rgba(139, 195, 74, 1)', // Light green
        text: 'Secondary Support'
      }
    });
    
    const groupedSupport = chartDrawings.addDrawingToGroup(additionalSupport, supportResistanceGroup.id);
    console.log(`✓ Added additional drawing to "${supportResistanceGroup.name}" group`);
    
    // 5. Show final structure (commented out for brevity)
    console.log('\n5. Final drawing sources structure ready for TradingView API');
    console.log('   (Use this data with saveDrawings method)');
    
    // Uncomment to see full structure:
    // console.log(JSON.stringify(drawingSources, null, 2));
    
    // 6. Save to TradingView 
    console.log('\n6. Saving to TradingView...');
    const result = await chartDrawings.saveDrawings(layoutId, drawingSources);
    console.log('✓ Drawings saved successfully to layout:', layoutId);
    
    // 7. Retrieve and verify saved drawings
    console.log('\n7. Retrieving saved drawings to verify...');
    const savedData = await chartDrawings.getDrawings(layoutId);
    console.log('✓ Retrieved drawings from TradingView:');
    console.log(`  - ${Object.keys(savedData.sources || {}).length} drawings found`);
    console.log(`  - ${Object.keys(savedData.drawing_groups || {}).length} groups found`);
    
    console.log('\n✅ Example completed successfully!');
    console.log('\nWhat was created:');
    console.log(`- Layout: ${layoutId}`);
    console.log(`- Symbol: ${symbol}`);
    console.log('- 3 drawing groups (Support/Resistance, Price Targets, Trend Analysis)');
    console.log('- 4 drawings assigned to groups');
    console.log('- All data saved to TradingView and verified');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
    }
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Alternative method: Create drawings with groups inline
function createDrawingsWithGroupsInline() {
  const chartDrawings = new TradingView.ChartDrawings();
  
  // Create all at once with groups
  const drawingSources = chartDrawings.createDrawingSources({
    drawings: [
      chartDrawings.createTrendLine({
        id: 'line1',
        symbol: 'BINANCE:BTCUSDT',
        groupId: 'GROUP1', // Direct group assignment
        points: [
          { time_t: 1748923800, offset: 0, price: 45000, interval: '5' },
          { time_t: 1749139800, offset: 0, price: 47000, interval: '5' }
        ]
      }),
      chartDrawings.createRectangle({
        id: 'rect1',
        symbol: 'BINANCE:BTCUSDT',
        groupId: 'GROUP1', // Same group
        points: [
          { time_t: 1749000000, offset: 0, price: 46000, interval: '5' },
          { time_t: 1749200000, offset: 0, price: 48000, interval: '5' }
        ]
      })
    ],
    groups: [
      chartDrawings.createDrawingGroup({
        id: 'GROUP1',
        name: 'Bitcoin Analysis',
        symbol: 'BINANCE:BTCUSDT'
      })
    ]
  });
  
  return drawingSources;
}

// Run the main example
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Example failed:', error.message);
    process.exit(1);
  });
}

module.exports = { main, createDrawingsWithGroupsInline };
