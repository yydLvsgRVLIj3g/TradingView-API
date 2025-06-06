const TradingView = require('../main');

/**
 * This example demonstrates how to create and save rectangle drawings
 * to a TradingView chart layout using the ChartDrawings API.
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

async function createRectangleExample() {
  try {
    console.log('Creating rectangle drawing...');
    
    // Create a rectangle drawing (support/resistance zone)
    const rectangle = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        {
          time_t: 1749100800,
          offset: 0,
          price: 6.944323437288694,
          interval: '5',
        },
        {
          time_t: 1749156300,
          offset: 0,
          price: 6.717444543085676,
          interval: '5',
        },
      ],
      style: {
        color: 'rgba(8, 153, 129, 1)',
        fillBackground: true,
        backgroundColor: 'rgba(248, 187, 208, 0.1939)',
        linewidth: 2,
        transparency: 50,
        text: 'Support Zone',
        textColor: 'rgba(255, 235, 59, 1)',
        fontSize: 18,
        horzLabelsAlign: 'center',
        vertLabelsAlign: 'top',
        middleLine: {
          showLine: true,
          lineWidth: 1,
          lineColor: '#9c27b0',
          lineStyle: 2,
        },
      },
    });

    // Prepare the drawing data
    const drawingData = {
      sources: {
        [rectangle.id]: rectangle,
      },
      drawing_groups: {},
      clientId: chartDrawings.generateClientId(),
    };

    console.log('Saving rectangle to layout:', layoutId);
    console.log('Rectangle data:', JSON.stringify(drawingData, null, 2));

    // Save the rectangle
    const result = await chartDrawings.saveDrawings(layoutId, drawingData);
    
    console.log('Rectangle saved successfully!');
    console.log('Result:', result);

  } catch (error) {
    console.error('Error saving rectangle:', error.message);
    process.exit(1);
  }
}

async function createMultipleRectangles() {
  try {
    console.log('\n--- Creating Multiple Rectangles ---');
    
    const drawings = {};
    
    // Support zone rectangle
    const supportZone = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        { time_t: 1749100800, offset: 0, price: 6.40, interval: '5' },
        { time_t: 1749156300, offset: 0, price: 6.35, interval: '5' },
      ],
      style: {
        color: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        text: 'Support Zone',
        fillBackground: true,
        transparency: 30,
      },
    });
    drawings[supportZone.id] = supportZone;

    // Resistance zone rectangle
    const resistanceZone = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        { time_t: 1749100800, offset: 0, price: 6.55, interval: '5' },
        { time_t: 1749156300, offset: 0, price: 6.50, interval: '5' },
      ],
      style: {
        color: 'rgba(244, 67, 54, 1)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        text: 'Resistance Zone',
        fillBackground: true,
        transparency: 30,
      },
    });
    drawings[resistanceZone.id] = resistanceZone;

    // Trading range rectangle
    const tradingRange = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        { time_t: 1749120000, offset: 0, price: 6.48, interval: '5' },
        { time_t: 1749140000, offset: 0, price: 6.42, interval: '5' },
      ],
      style: {
        color: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.05)',
        text: 'Trading Range',
        fillBackground: true,
        transparency: 80,
        linewidth: 1,
        middleLine: {
          showLine: true,
          lineWidth: 2,
          lineColor: '#ff9800',
          lineStyle: 1, // dotted
        },
      },
    });
    drawings[tradingRange.id] = tradingRange;

    const drawingData = {
      sources: drawings,
      drawing_groups: {},
      clientId: chartDrawings.generateClientId(),
    };

    console.log('Saving multiple rectangles...');
    const result = await chartDrawings.saveDrawings(layoutId, drawingData);
    console.log('Multiple rectangles saved successfully!');

  } catch (error) {
    console.error('Error saving multiple rectangles:', error.message);
  }
}

async function createCustomRectangle() {
  try {
    console.log('\n--- Creating Custom Styled Rectangle ---');
    
    // Create a highly customized rectangle
    const customRect = chartDrawings.createRectangle({
      id: chartDrawings.generateDrawingId(),
      symbol: 'BINANCE:UNIUSDT.P',
      points: [
        { time_t: 1749130000, offset: 0, price: 6.60, interval: '5' },
        { time_t: 1749150000, offset: 0, price: 6.30, interval: '5' },
      ],
      style: {
        color: 'rgba(156, 39, 176, 1)', // Purple border
        backgroundColor: 'rgba(156, 39, 176, 0.08)', // Light purple fill
        fillBackground: true,
        linewidth: 3,
        transparency: 20,
        text: 'Key Level Zone',
        textColor: 'rgba(255, 255, 255, 1)',
        fontSize: 20,
        bold: true,
        horzLabelsAlign: 'center',
        vertLabelsAlign: 'top',
        extendRight: true, // Extend the rectangle to the right
        middleLine: {
          showLine: true,
          lineWidth: 2,
          lineColor: '#e91e63',
          lineStyle: 0, // solid
        },
      },
    });

    const drawingData = {
      sources: { [customRect.id]: customRect },
      drawing_groups: {},
      clientId: chartDrawings.generateClientId(),
    };

    console.log('Saving custom rectangle...');
    const result = await chartDrawings.saveDrawings(layoutId, drawingData);
    console.log('Custom rectangle saved successfully!');

  } catch (error) {
    console.error('Error saving custom rectangle:', error.message);
  }
}

// Run the examples
createRectangleExample()
  .then(() => createMultipleRectangles())
  .then(() => createCustomRectangle())
  .then(() => {
    console.log('\n✅ All rectangle examples completed successfully!');
    console.log('\nRectangle types created:');
    console.log('1. Basic support zone rectangle');
    console.log('2. Multiple zone rectangles (support, resistance, trading range)');
    console.log('3. Custom styled rectangle with extensions');
    console.log('\nNext steps:');
    console.log('1. Open your TradingView chart with the layout ID');
    console.log('2. You should see the saved rectangles on the chart');
    console.log('3. Try modifying the rectangle styles and re-running the script');
  })
  .catch((error) => {
    console.error('❌ Rectangle example failed:', error.message);
    process.exit(1);
  });
