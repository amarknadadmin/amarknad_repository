//Run http://localhost:3050/


const express = require('express');
const Datastore = require('nedb');
require('dotenv').config();
//var secret_password = process.env.secret_password;
//console.log(secret_password);

const app = express();
const port = process.env.PORT || 3050;

app.listen(port, () => console.log('listening at '+port));
app.use(express.static('public_html'));
app.use(express.static('server_site'));
app.use(express.json({limit: '1mb'}));


const database = new Datastore('database.db');
database.loadDatabase();


var holder ='';



/*********************************************************************************************************
//x_server_test: server set up to receive post-requests
app.get('/api_x', (request, response) => {
	response.json({comment: "index.js is present"});
});
*********************************************************************************************************/





//A4: server set up to receive post-requests
app.post('/api1', (request, response) => {
	//console.log('api1 got a request');
	console.log(request.body);
	const data = request.body;
	//const timestamp = Date.now();
	//data.timestamp = timestamp;
	//database.insert(data);
	if (data.password=='ilikebigbuttsandicannotlieyouotherbrotherscantdeny')
		{holder = 'success api1';}
	else
		{holder = 'failure api1';}
	response.json({status: holder});
});


//B2: server set up to receive get-requests
app.get('/api', (request, response) => {
	database.find({}, (err,data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
	
	//response.json({test: 123});
});



//C2: send data into database
app.post('/api2', (request, response) => {
	console.log('api2 got a request');
	console.log(request.body);
	const data = request.body;
	const timestamp = Date.now();
	data.timestamp = timestamp;
	database.insert(data);
	response.json({status: 'success api2'});
});



//D2: set up server to report port-number
app.post('/api3', (request, response) => {
	console.log('api3 got a request');
	response.json({status: 'success api3',returned_value: port});
});
/*********************************************************************************************************
*********************************************************************************************************/






