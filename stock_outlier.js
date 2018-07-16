/* A circuit breaker is a financial regulatory instrument that is in 
place to prevent stock market crashes from occurring. Since their 
inception, circuit breakers have been modified to prevent 
both speculative gains and dramatic losses within a 
small time frame. As a result of being triggered, circuit 
breakers either stop trading for a small amount of time or 
close trading early in order to allow accurate information 
to flow amongst market makers and for institutional traders 
to assess their positions and make rational decisions.  */





// Obtain wink's streaming api for standard deviation.
var stdev = require( 'wink-statistics' ).streaming.stdev();
// Use split2 package to break stream at every new line.
var split = require( 'split2' );
	

// Configuration to compute outliers.
const minDataSize = 3; // Min # data points to process before outliers detection begins
const multiplier = 2.5; // Used to flag a value as outlier if it is > multiplier x std dev.
const stock_value = [];

// Setup a pipe for standard input
 process.stdin.pipe( split() ).on( 'data', function ( data ) 
{	
  const stock_index = +data;
  const r = stdev.result();
  const isOutlier = (r.size && (r.size >= minDataSize) &&
    ((stock_index > (r.mean + multiplier*r.stdev)) || (stock_index < (r.mean - multiplier*r.stdev))));
  if  ( isOutlier ) 
  {
    console.log( 'There is an abrupt change in the stock market and the index has reached  %d ', stock_index );
    console.log('\n Due to the abrupt change circuit breaker has been applied to the market,Hence Market will be closed today');
    exit();
  } 
  else 
  { 
    stdev.compute( stock_index );
    stock_value.push(stock_index);
  	console.log(stock_value);
  }
  

} );
