//Run http://localhost:3050/


//const express = require('express');
import express from 'express';
const app = express();

//const Datastore = require('nedb');
import Datastore from 'nedb';

//const fetch = require('node-fetch');
import fetch from 'node-fetch';



//require('dotenv').config();
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT || 3050;


/***********************************************************************************************************************************
 ***************************************************************************************************************************************/ 

const database = new Datastore('database.db');
database.time_db = new Datastore('time_db.db');
database.loadDatabase();
database.time_db.loadDatabase();

//database.time_db.find({}, function (err,output){if(err){console.log(err);}console.log(output[0].time);});
//database.time_db.remove({ _id: '7Ew2xstqYWVHd0Hz' }, {}, function (err, numRemoved) {});



var secretpassword = process.env.secretpassword;


app.listen(port, () => console.log('listening at '+port));
app.use(express.static('server_site'));
app.use(express.json({limit: '1mb'}));






/*********************************************************************************************************
*********************************************************************************************************/



//CHECK THE LATEST TIME PERIOD
//https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0401__AM0401A/NAKUBefolkning2M/





var dload1_basic_url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401A/NAKUBefolkning2M";


var dload1_basic_body = {
  "query": [
    {"code": "Kon","selection": {"filter": "item","values": ["1"]}},
    {"code": "Alder","selection": {"filter": "item","values": ["tot15-74"]}},
    {"code": "Arbetskraftstillh","selection": {"filter": "item","values": ["SYS","ALÖS"]}},
    {"code": "ContentsCode","selection": {"filter": "item","values": ["000001CA"]}},
    {"code": "Tid","selection": {"filter": "item","values": ["2021M01"]}}
  ],
  "response": {"format": "json"}
};
//Kon Man="1" Kvinnor="2" Totalt="1+2"
//dload1_basic_body.query[0].selection.values[0]="1+2"
//Alder "15-19", "20-24","15-24","25-34","35-44","45-54","55-64","65-74","tot15-74","tot16-64"
//dload1_basic_body.query[1].selection.values[0]="tot15-74"
//Tillhorighet "SYS","ALÖS","EIAKR","IAKR","TOTB"
//dload1_basic_body.query[2].selection.values[0]="ALÖS"
//Tid ex: "2021M08"
//dload1_basic_body.query[4].selection.values = ["2021M01"];
var dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};


var dload2_usegments_url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401R/NAKUArblosaTInrUtrM";
var dload2_usegments_body = {
  "query": [
    {"code": "Arbetsloshetstid","selection": {"filter": "item","values": ["TOT"]}},
    {"code": "InrikesUtrikes","selection": {"filter": "item","values": ["83"]}},
    {"code": "Kon","selection": {"filter": "item","values": ["1+2"]}},
    {"code": "Alder","selection": {"filter": "item","values": ["tot15-74"]}},
    {"code": "ContentsCode","selection": {"filter": "item","values": ["AM0401RF"]}},
    {"code": "Tid","selection": {"filter": "item","values": ["2021M11"]}}
  ],
  "response": {"format": "json"}
};
//Arbetslöshet tid "TOT","27V-"
//dload2_usegments_body.query[0].selection.values = ["TOT"];
//Inrikes utrikes född "13","23","83" (Inrikes = 13) (Utrikes =23) (totalt = 83)
//dload2_usegments_body.query[1].selection.values = ["83"];
//Kön "1","2","1+2" (Män = 1)
//dload2_usegments_body.query[2].selection.values = ["1+2"];
//Ålder "15-24","25-54","55-74","tot15-74","tot16-64"
//dload2_usegments_body.query[3].selection.values = ["tot15-74"];
//Tid "2021M10","2021M11"
//dload2_usegments_body.query[5].selection.values = ["2021M11"];
var dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};


async function sample_time_value(bbb) {
	//bbb is the period we are checking
  dload1_basic_body.query[4].selection.values = [bbb]; //make sure sample loaded from correct period
  dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
  const response = await fetch(dload1_basic_url, dload1_basic_options);
  const scbdata = await response.json();
  
  var control=0;
  if (!response.ok) {
    control = 6;
  }
  if (response.ok) {
    control = 5;
  }
  return control;
}

async function timeexist(aaa) {
	//aaa is the period we are checking
	var timeexist_output=0; //timeexist_output signals if sample could be retrieved
	await sample_time_value(aaa).then(data => {timeexist_output=1}).catch(reason => {timeexist_output=2});
	return timeexist_output;

}

async function latesttime() {
	var previous_time= await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});
	var previous_y = previous_time.substring(0,4);
	var previous_m = previous_time.substring(5,7);
	var check_m = String(parseInt(previous_m,10) +1);
	var check_y = previous_y;
	if (check_m=="13") {
		check_m="01";
		check_y=String(parseInt(previous_y,10) +1);
	}
	if (check_m.length==1) {
		check_m="0"+check_m;
	}
	var check_time = check_y+"M"+check_m;
	var output_time = previous_time;
	if ((await timeexist(check_time))==1) {output_time=check_time;}
	
	await database.time_db.remove({}, { multi: true }, function (err, numRemoved) {});
	database.time_db.persistence.compactDatafile();

	var timedata = {time: output_time};
	var timestamp = Date();
	timedata.timestamp = timestamp;

	database.time_db.insert(timedata);
}

var periodlist = '';
async function list_10_years() {
	var add_product = await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});
	periodlist = "["+ add_product;
	var add_build ='';
	var add_build_y ='';
	var add_build_m ='';
	for (var i = 0; i < (11); i++) {
		add_build_y = parseInt(add_product.substring(0,4),10);
		add_build_m = parseInt(add_product.substring(5,7),10);
		if (add_build_m==1) {add_build_y=add_build_y-1; add_build_m=12;} else {add_build_m=add_build_m-1;}
		add_build_y = String(add_build_y);
		if (String(add_build_m).length==1) {add_build_m = "0"+String(add_build_m);} else {add_build_m = String(add_build_m);}
		add_product = add_build_y+"M"+add_build_m;
		periodlist = periodlist+","+add_product;
	}
	periodlist = periodlist+"]";
}




/***********************************************************************************************************************************
 ***************************************************************************************************************************************/ 
//{"time":"2021M02","timestamp":"Mon Dec 20 2021 23:12:05 GMT+0100 (centraleuropeisk normaltid)","_id":"ZaaX3xhm2SGx9BBs"}

//x_server_test: server set up to receive get-requests
app.get('/api_x', async (request, response) => {
	
	//timeexist("2021M10");
	latesttime();

	//var return_value = '';
	//await database.time_db.find({}, function (err, output){return_value = output[0].time;console.log("message inside: "+return_value);});
	//await console.log("message outside: "+return_value);

	//var x = await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});
	//console.log(x);

	//await list_10_years();
	//console.log(periodlist);
	response.json({reply: "x1 executed"});
});

app.get('/api_x2', async (request, response) => {
	//await database.time_db.remove({}, { multi: true }, function (err, numRemoved) {});
	//database.time_db.persistence.compactDatafile;
	var logged_time = await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});
	response.json({reply: "x2 executed", result: logged_time});
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
	console.log("tick tock");
	//data = {name: "test"};
	setInterval(() =>{
		//data.time = Date();
		if (run5min==1) {
			latesttime();
			console.log("update again");
			//console.log(Date());
		}
	}, 1000 * 60 * 5 * 1);
}

app.post('/api_5minutes', (request, response) => {
	if (request.body.password==secretpassword) {enter5minutes();}
	response.json({reply: "5 minutes executed"});
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

