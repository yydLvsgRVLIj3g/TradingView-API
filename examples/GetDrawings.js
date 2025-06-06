const TradingView = require('../main');

/**
 * This example tests the getDrawings function
 */

// First parameter must be the layoutID
// If the layout is private:
// - Second parameter must be the userid (you can use getUser function)
// - You should provide your sessionid and signature cookies in .env file
//console.log(process.argv)

if (!process.argv[2]) throw Error('Please specify a layoutID');

TradingView.getDrawings(process.argv[2], 'BINANCE:UNIUSDT.P', {
  session: process.env.SESSION,
  signature: process.env.SIGNATURE,
  id: process.argv[3],
}).then((result) => {
  console.log(`Found ${result.drawings.length} drawings:`);
  
  result.drawings.forEach((drawing) => {
    console.log(`- ${drawing.id}: ${drawing.type} (${drawing.symbol})`);
    if (drawing.text) console.log(`  Text: ${drawing.text}`);
    if (drawing.title) console.log(`  Title: ${drawing.title}`);
    console.log(`  Points: ${drawing.points.length}`);
    console.log(`  Visible: ${drawing.visible}, Frozen: ${drawing.frozen}`);
    if (drawing.groupId) console.log(`  Group: ${drawing.groupId}`);
    console.log('---');
  });

  if (result.groups.length > 0) {
    console.log(`\nFound ${result.groups.length} groups:`);
    result.groups.forEach((group) => {
      console.log(`- ${group.id}: ${group.name} (${group.symbol})`);
    });
  }

  // Show summary
  const summary = TradingView.DrawingParser.getSummary(result.drawings);
  console.log('\nSummary:', {
    total: summary.total,
    visible: summary.visible,
    frozen: summary.frozen,
    grouped: summary.grouped,
    types: summary.typeCount
  });
}).catch((err) => {
  console.error('Error:', err.message);
});