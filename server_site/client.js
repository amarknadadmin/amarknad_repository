
//***********************************************************************************************************************
// Test functions

// x code
async function x_fetch_function() {
	const response = await fetch('/api_x');
	const data = await response.json();
	console.log(data.reply);
}


// y code
async function y_fetch_function(aaa) {
	const response = await fetch('/api_y',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.reply);
}


//***********************************************************************************************************************
// provide data


// supply history to amarknad.se
async function supply_history() {
	const response = await fetch('/api_supply_history');
	const data = await response.json();
	console.log(data);
}

// supply stats to amarknad.se
async function supply_stats() {
	const response = await fetch('/api_supply_stats');
	const data = await response.json();
	console.log(data);
}


//***********************************************************************************************************************
// Automatic updates management


// 5 min code
async function min5_fetch_function(aaa) {
	const response = await fetch('/api_5minutes',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.reply);
}



// 5 min block
async function db_5min_block(aaa) {
	const response = await fetch('/api_5min_block',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.control);
	console.log(data.result);
}




//***********************************************************************************************************************
// Control databases


// latest time
async function printout_time(aaa) {
	const response = await fetch('/printout_time',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.control);
	console.log(data.db_data);
}


// history
async function printout_history10(aaa) {
	const response = await fetch('/printout_history10',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.control);
	console.log(data.db_data);
}



//***********************************************************************************************************************
// Other functions



// identify port number
async function identify_port(aaa) {
	const response = await fetch('/port_identity',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.control);
	console.log(data.port);
}











