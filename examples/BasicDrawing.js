const TradingView = require('../main');

/**
 * Basic example of using the ChartDrawings API
 * This example shows the minimal code needed to save a trend line to a chart
 */

// First parameter must be the layoutID
// If the layout is private:
// - Second parameter must be the userid (you can use getUser function)
// - You should provide your sessionid and signature cookies in .env file

if (!process.argv[2]) throw Error('Please specify a layoutID');

async function basicExample() {
  // Replace with your actual credentials
  const credentials = {
    session: process.env.SESSION,
    signature: process.env.SIGNATURE,
    id: process.argv[3], // Optional user ID from command line
  };

  // Create ChartDrawings instance
  const chartDrawings = new TradingView.ChartDrawings(credentials);

  // Create a simple trend line
  const trendLine = chartDrawings.createTrendLine({
    id: chartDrawings.generateDrawingId(),
    symbol: 'BINANCE:UNIUSDT.P',
    points: [
      { time_t: 1749165300, offset: 0, price: 6.424942779291553, interval: '5' },
      { time_t: 1749150000, offset: 0, price: 6.432217983651226, interval: '5' },
    ],
    style: {
      linecolor: 'rgba(255, 0, 0, 1)', // Red line
      linewidth: 2,
      text: 'My Trend Line',
    },
  });

  // Prepare drawing data
  const drawingData = {
    sources: { [trendLine.id]: trendLine },
    drawing_groups: {},
    clientId: chartDrawings.generateClientId(),
  };

  try {
    // Save the drawing using layoutID from command line
    await chartDrawings.saveDrawings(process.argv[2], drawingData);
    console.log('✅ Drawing saved successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  if (!process.env.SESSION) {
    console.error('Please set SESSION environment variable');
    process.exit(1);
  }
  
  basicExample();
}

module.exports = basicExample;
