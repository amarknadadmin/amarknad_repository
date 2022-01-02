
console.log('x_fetch_function()');
console.log('y_fetch_function()');
console.log('x_Heroku_fetch_function()');
console.log('y_Heroku_fetch_function()');
console.log('"sweden"');

//A1: create variable to send
var datasend = {password: 'thisisatestpassword'};
//console.log(datasend);
//{value1: 55, value2: 56}

//A2: set up options-object
const options = {
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(datasend)
};






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




// x code from Heroku to my local computer
async function x_Heroku_fetch_function() {
	const response = await fetch('https://amarknad-server-site.herokuapp.com/api_x');
	const data = await response.json();
	console.log(data.reply);
}


// y code from Heroku to my local computer
async function y_Heroku_fetch_function(aaa) {
	const response = await fetch('https://amarknad-server-site.herokuapp.com/api_y',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({password: aaa})
});
	const data = await response.json();
	console.log(data.reply);
}



















// 5 minutes code
async function min5_fetch_function(aaa) {
	const response = await fetch('/api_5minutes',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(aaa)
});
	const data = await response.json();
	console.log(data.reply);
}

// supply stats to amarknad.se
async function supply_function(aaa) {
	const response = await fetch('/api_supply',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(aaa)
});
	const data = await response.json();
	console.log(data);
}



// database printout
async function db_printout_fetch_function() {
	const response = await fetch('/api_db_printout');
	const data = await response.json();
	console.log(data);
}

// 5min block
async function db_5min_block() {
	const response = await fetch('/api_5min_block');
	const data = await response.json();
	console.log(data.reply);
}



//A3: set up and call function for fetch-request to server. Response will be logged
//fetch('/api', options).then(response =>  response.json()).then(json => console.log(json));
async function postData() {
	const response = await fetch('/api1', options);
	const data = await response.json();
	console.log(data);
}
//postData();


//B1 set up and call function for GET-request 
async function getData() {
	const response = await fetch('/api');
	const data = await response.json();
	console.log(data);
}
//getData();


//C1 set up function for sending entries to database

async function postDBentry(datasubmit) {
	const response = await fetch('/api2', {
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(datasubmit)
});
	const data = await response.json();
	console.log(data);
}
//postDBentry();


//D1 set up post function to indetify port
async function whatPort() {
	const response = await fetch('/api3', {
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({})
});
	const data = await response.json();
	console.log('Port is '+data.returned_value);
}
//whatPort();


//*************************************************************************************************************



























