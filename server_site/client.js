




//A1: create variable to send
var datasend = {password: 'ilikebigbuttsandicannotlieyouotherbrotherscantdeny'};
//console.log(datasend);
//{value1: 55, value2: 56}

//A2: set up options-object
const options = {
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(datasend)
};


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




