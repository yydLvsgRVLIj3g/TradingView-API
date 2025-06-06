const TradingView = require('../main');

/**
 * This example demonstrates how to save drawings to a TradingView chart layout
 * using the ChartDrawings API.
 * 
 * Requirements:
 * - Valid TradingView session credentials (SESSION and SIGNATURE)
 * - A valid layout ID (you can get this from a chart URL)
 * 
 * Usage:
 * node examples/SaveDrawings.js <layout_id> [user_id]
 */

if (!process.env.SESSION || !process.env.SIGNATURE) {
  throw Error('Please set your SESSION and SIGNATURE environment variables');
}

if (!process.argv[2]) {
  throw Error('Please specify a layout ID as the first argument');
}

const layoutId = process.argv[2];
const userId = process.argv[3] || null;

// Initialize ChartDrawings with credentials
const chartDrawings = new TradingView.ChartDrawings({
  session: process.env.SESSION,
  signature: process.env.SIGNATURE,
  id: userId,
});

async function saveDrawingExample() {
  try {
    console.log('Creating trend line drawing...');
    
    // Create a trend line drawing
    const trendLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        {
          time_t: 1749165300,
          offset: 0,
          price: 6.424942779291553,
          interval: '5',
        },
        {
          time_t: 1749150000,
          offset: 0,
          price: 6.432217983651226,
          interval: '5',
        },
      ],
      style: {
        linecolor: 'rgba(242, 54, 69, 1)',
        linewidth: 2,
        linestyle: 0,
        extendLeft: false,
        extendRight: true,
        textcolor: 'rgba(255, 235, 59, 1)',
        fontsize: 16,
        text: 'Support Line',
        title: 'Important Level',
      },
    });

    // Prepare the drawing data
    const drawingData = {
      sources: {
        [trendLine.id]: trendLine,
      },
      drawing_groups: {},
      clientId: chartDrawings.generateClientId(),
    };

    console.log('Saving drawing to layout:', layoutId);
    console.log('Drawing data:', JSON.stringify(drawingData, null, 2));

    // Save the drawing
    const result = await chartDrawings.saveDrawings(layoutId, drawingData);
    
    console.log('Drawing saved successfully!');
    console.log('Result:', result);

    // Optional: Retrieve and display the saved drawings
    console.log('\nRetrieving saved drawings...');
    const savedDrawings = await chartDrawings.getDrawings(layoutId);
    console.log('Saved drawings:', JSON.stringify(savedDrawings, null, 2));

  } catch (error) {
    console.error('Error saving drawing:', error.message);
    process.exit(1);
  }
}

async function demonstrateMultipleDrawings() {
  try {
    console.log('\n--- Demonstrating Multiple Drawings ---');
    
    // Create multiple trend lines
    const drawings = {};
    
    // Resistance line
    const resistanceLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        {
          time_t: 1749165300,
          offset: 0,
          price: 6.45,
          interval: '5',
        },
        {
          time_t: 1749150000,
          offset: 0,
          price: 6.46,
          interval: '5',
        },
      ],
      style: {
        linecolor: 'rgba(255, 82, 82, 1)',
        linewidth: 2,
        text: 'Resistance',
        extendRight: true,
      },
    });
    drawings[resistanceLine.id] = resistanceLine;

    // Support line
    const supportLine = chartDrawings.createTrendLine({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        {
          time_t: 1749165300,
          offset: 0,
          price: 6.40,
          interval: '5',
        },
        {
          time_t: 1749150000,
          offset: 0,
          price: 6.39,
          interval: '5',
        },
      ],
      style: {
        linecolor: 'rgba(76, 175, 80, 1)',
        linewidth: 2,
        text: 'Support',
        extendRight: true,
      },
    });
    drawings[supportLine.id] = supportLine;

    const drawingData = {
      sources: drawings,
      drawing_groups: {},
      clientId: chartDrawings.generateClientId(),
    };

    console.log('Saving multiple drawings...');
    const result = await chartDrawings.saveDrawings(layoutId, drawingData);
    console.log('Multiple drawings saved successfully!');

  } catch (error) {
    console.error('Error saving multiple drawings:', error.message);
  }
}

// Run the examples
saveDrawingExample()
  .then(() => demonstrateMultipleDrawings())
  .then(() => {
    console.log('\n✅ All examples completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Open your TradingView chart with the layout ID');
    console.log('2. You should see the saved drawings on the chart');
    console.log('3. Try modifying the drawing styles and re-running the script');
  })
  .catch((error) => {
    console.error('❌ Example failed:', error.message);
    process.exit(1);
  });
