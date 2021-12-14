//Run http://localhost:3050/


const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3050;


/***********************************************************************************************************************************
 ***************************************************************************************************************************************/ 
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();


var secretpassword = process.env.secretpassword;


app.listen(port, () => console.log('listening at '+port));
app.use(express.static('server_site'));
app.use(express.json({limit: '1mb'}));













/*********************************************************************************************************

//A4: server set up to receive post-requests
app.post('/api1', (request, response) => {
	//console.log('api1 got a request');
	//console.log(request.body);
	const data = request.body;
	//const timestamp = Date.now();
	//data.timestamp = timestamp;
	//database.insert(data);
	if (data.password=='thisisatestpassword')
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


app.get('/cron', (request, response) => {

	const data = {
		"test": "cron"
	}
	//run every 24 hours 
	setInterval(() =>{
		database.insert(data);

	}, 1000 * 60 * 60 * 24);
})



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
*********************************************************************************************************/


/*********************************************************************************************************
*********************************************************************************************************/



//CHECK THE LATEST TIME PERIOD
//https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0401__AM0401A/NAKUBefolkning2M/

/***********************************************************************************************************************************



var timecheck_url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401A/NAKUBefolkning2M"


var timecheck_body = {
  "query": [
    {
      "code": "Kon",
      "selection": {
        "filter": "item",
        "values": [
          "1"
        ]
      }
    },
    {
      "code": "Alder",
      "selection": {
        "filter": "item",
        "values": [
          "tot16-64"
        ]
      }
    },
    {
      "code": "Arbetskraftstillh",
      "selection": {
        "filter": "item",
        "values": [
          "SYS"
        ]
      }
    },
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": [
          "000001CA"
        ]
      }
    },
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": [
          "2021M01"
        ]
      }
    }
  ],
  "response": {
    "format": "json"
  }
}


//Kon Man="1" Kvinnor="2" Totalt="1+2"
//console.log("kön")
//timecheck_body.query[0].selection.values[0]="1+2"


//Alder "15-19", "20-24","15-24","25-34","35-44","45-54","55-64","65-74","tot15-74","tot16-64"
//console.log("Ålder")
//timecheck_body.query[1].selection.values[0]="tot15-74"

//Tillhorighet "SYS","ALÖS","EIAKR","IAKR","TOTB"
//console.log("Tillhörighet")
//timecheck_body.query[2].selection.values[0]="ALÖS"

//Tid ex: "2021M08"
//console.log("Tid")
//timecheck_body.query[4].selection.values = ["2021M09"]


var timecheck_options = {
      method: "POST",
      body: JSON.stringify(timecheck_body),
    };


async function timecheck_func() {
  console.log("step 1");
  const response = await fetch(timecheck_url, timecheck_options);
  console.log("step 2");
  console.log(response);
  const scbdata = await response.json();
  console.log("step 3");
  console.log(scbdata);
}



 ***************************************************************************************************************************************/ 


//x_server_test: server set up to receive get-requests
app.get('/api_x', (request, response) => {
	timecheck_func();

	response.json({reply: "well done"});
});


//y_server_test: server set up to receive post-requests
app.post('/api_y', (request, response) => {
	var reply = '';
	var income = request.body.password;
	var count = 0;
	if (request.body.password==secretpassword) {reply = 'correct'; count =1;} else {reply = 'incorrect'; count =5;}
	response.json({reply: reply, received: income, required: secretpassword, count: count});
});


var run5min = 1;

function enter5minutes() {
	data = {name: "test"};
	setInterval(() =>{
		data.time = Date();
		if (run5min==1) {
			database.insert(data);
			//console.log(Date());
		}
	}, 1000 * 60 * 5 * 1);
}

app.post('/api_5minutes', (request, response) => {
	if (request.body.password==secretpassword) {enter5minutes();}
	response.json({reply: "well done"});
});


//database printout
app.get('/api_db_printout', (request, response) => {
	database.find({}, (err,data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
});


//stop running enter5minutes
app.get('/api_5min_block', (request, response) => {
	run5min = 0;
	response.json({reply: "blocked"});
});

