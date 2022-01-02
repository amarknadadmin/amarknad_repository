//Run http://localhost:3050/


//const express = require('express');
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

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
database.history_db = new Datastore('history_db.db');
database.stats_db = new Datastore('stats_db.db');
database.loadDatabase();
database.time_db.loadDatabase();
database.history_db.loadDatabase();
database.stats_db.loadDatabase();



var secretpassword = process.env.secretpassword;


app.listen(port, () => console.log('listening at '+port));
app.use(express.static('server_site'));
app.use(express.json({limit: '1mb'}));


const monthNumberToLabelMap = {
  [1]: 'Jan',
  [2]: 'Feb',
  [3]: 'Mar',
  [4]: 'Apr',
  [5]: 'May',
  [6]: 'Jun',
  [7]: 'Jul',
  [8]: 'Aug',
  [9]: 'Sep',
  [10]: 'Okt',
  [11]: 'Nov',
  [12]: 'Dec',
}



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


async function sample_dload1_basic(bbb) { //this function loads a sample of data
	//bbb is the period we are checking
  dload1_basic_body.query[4].selection.values = [bbb]; //make sure sample loaded from correct period
  dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
  const response = await fetch(dload1_basic_url, dload1_basic_options);
  const scbdata = await response.json();
}

async function sample_dload2_usegments(bbb) { //this function loads a sample of data
	//bbb is the period we are checking
  dload2_usegments_body.query[5].selection.values = [bbb]; //make sure sample loaded from correct period
  dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
  const response = await fetch(dload1_basic_url, dload1_basic_options);
  const scbdata = await response.json();
}

async function timeexist(aaa) { //this function checks of samples returns value or error message
	//aaa is the period we are checking
	var timeexist_1=0; //timeexist_1 signals if sample could be retrieved for dload 1
	var timeexist_2=0; 
	await sample_dload1_basic(aaa).then(data => {timeexist_1=1}).catch(reason => {timeexist_1=2});
	await sample_dload2_usegments(aaa).then(data => {timeexist_2=1}).catch(reason => {timeexist_2=2});
	return Math.min(timeexist_1,timeexist_2);

}

async function latesttime_update() { //this function updates time strings in database files
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
	var new_histories = 0;
	if ((await timeexist(check_time))==1) {output_time=check_time; new_histories=1;}
	
	await database.time_db.remove({}, { multi: true }, function (err, numRemoved) {});
	database.time_db.persistence.compactDatafile();

	var timedata = {time: output_time};
	var timestamp = Date();
	timedata.timestamp = timestamp;

	database.time_db.insert(timedata);

	if (new_histories==1) {
	await database.history_db.remove({}, { multi: true }, function (err, numRemoved) {});
	database.history_db.persistence.compactDatafile();
	console.log("deleted histories from database");
	await create_list_periods(12);
	const p1y = periodlist;
	database.history_db.insert({history: "p1y", periods: p1y});
	console.log("created p1y");
	await create_list_periods(60);
	const p5y = periodlist;
	database.history_db.insert({history: "p5y", periods: p5y});
	console.log("created p5y");
	await create_list_periods(120);
	const p10y = periodlist;
	database.history_db.insert({history: "p10y", periods: p10y});
	console.log("created p10y");
	await create_list_periods(72);
	const p5ylag = periodlist.slice(0, 600)+"]";
	database.history_db.insert({history: "p5ylag", periods: p5ylag});
	console.log("created p5ylag");
	//const historylist = {p1y:p1y,p5y:p5y,p10y:p10y,p5ylag:p5ylag};
	//database.history_db.insert(historylist);
	//console.log("inserted histories to database");
	new_histories=0;
	}


}

var periodlist = '';
async function create_list_periods(per_num) { //this function creates a string of periods based on what the latest period is
	var loaded_time = await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});
	var yback = Math.floor(parseInt(per_num-1)/12); //1
	var mback = parseInt(per_num-1)-(yback*12); //11
	var monthhold = parseInt(loaded_time.substring(5,7),10)-mback;
	if (monthhold<1) {monthhold=monthhold+12; yback=yback+1;}
	monthhold = String(monthhold);
	monthhold = "0" + monthhold;
	monthhold = monthhold.substring(monthhold.length-2);

	var add_product = String(parseInt(loaded_time.substring(0,4),10)-yback)+"M"+monthhold;
	var add_string = "\"" + add_product + "\"";
	periodlist = "["+ add_string;
	var add_build ='';
	var add_build_y ='';
	var add_build_m ='';
	for (var i = 0; i < (per_num-1); i++) {
		add_build_y = parseInt(add_product.substring(0,4),10);
		add_build_m = parseInt(add_product.substring(5,7),10);
		if (add_build_m==12) {add_build_y=add_build_y+1; add_build_m=1;} else {add_build_m=add_build_m+1;}
		add_build_y = String(add_build_y);
		if (String(add_build_m).length==1) {add_build_m = "0"+String(add_build_m);} else {add_build_m = String(add_build_m);}
		add_product = add_build_y+"M"+add_build_m;
		add_string = "\"" + add_product + "\""
		periodlist = periodlist+","+add_string;
	}
	periodlist = periodlist+"]";
}


//when this function is triggered the server updates the stats database based on what the latest recorded time is
//this function does not update the recorded times
async function stats_update() {
	
	
	var p10y_list = await new Promise( (resolve,reject) => {database.history_db.find({history: 'p10y'}, function (err, output) {resolve(output[0].periods);});});
	var p5y_list = await new Promise( (resolve,reject) => {database.history_db.find({history: 'p5y'}, function (err, output) {resolve(output[0].periods);});});
	var entries_periods = JSON.parse(p10y_list); //an object version of period list
	
	var response = [];
	var scbdata = [];
	const data_array = [];
	var data = '';
	//insert periods
	for (var i = 0; i < 120; i++) {data = {period: entries_periods[i]}; data_array[i] = data;}

	//download 1: basic unemployment data
	var dload1_cats = ["SYS","ALÖS","EIAKR","IAKR","TOTB"];
	dload1_basic_body.query[4].selection.values = entries_periods;
	dload1_basic_body.query[0].selection.values[0]="1+2";
	dload1_basic_body.query[1].selection.values[0]="tot15-74";
	
	//insert SYS
	dload1_basic_body.query[2].selection.values=["SYS"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].SYS = scbdata.data[i].values[0];}
	
	//insert ALÖS
	dload1_basic_body.query[2].selection.values=["ALÖS"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].ALOS = scbdata.data[i].values[0];}

	//insert EIAKR
	dload1_basic_body.query[2].selection.values=["EIAKR"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].EIAKR = scbdata.data[i].values[0];}

	//insert IAKR
	dload1_basic_body.query[2].selection.values=["IAKR"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].IAKR = scbdata.data[i].values[0];}
	
	//insert TOTB
	dload1_basic_body.query[2].selection.values=["TOTB"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].TOTB = scbdata.data[i].values[0];}

	//calculation arbetslöshet
	for (var i = 0; i < 120; i++) {data_array[i].aloshet = Math.round(10000*data_array[i].ALOS/data_array[i].IAKR)/100;}

	//download 2: unemployments segments: inrikes/utrikes, ålder, långtids
	dload2_usegments_body.query[5].selection.values = entries_periods;
	dload2_usegments_body.query[0].selection.values = ["TOT"]; //längd "TOT","27V-"
	dload2_usegments_body.query[1].selection.values = ["83"]; //inr utr "13","23","83"
	dload2_usegments_body.query[2].selection.values = ["1+2"];
	dload2_usegments_body.query[3].selection.values = ["tot15-74"]; // ålder "15-24","25-54","55-74","tot15-74","tot16-64"

	//insert v27
	dload2_usegments_body.query[0].selection.values = ["27V-"];
	dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
	response = await fetch(dload2_usegments_url, dload2_usegments_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].v27 = scbdata.data[i].values[0];}
	dload2_usegments_body.query[0].selection.values = ["TOT"];
	
	//insert utrikes
	dload2_usegments_body.query[1].selection.values = ["23"];
	dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
	response = await fetch(dload2_usegments_url, dload2_usegments_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].utrikes = scbdata.data[i].values[0];}
	dload2_usegments_body.query[1].selection.values = ["83"];
	
	//insert ungdom 15-24
	dload2_usegments_body.query[3].selection.values = ["15-24"];
	dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
	response = await fetch(dload2_usegments_url, dload2_usegments_options);
	scbdata = await response.json();
	for (var i = 0; i < 120; i++) {data_array[i].ungdom = scbdata.data[i].values[0];}
	dload2_usegments_body.query[3].selection.values = ["tot15-74"];

	await database.stats_db.remove({}, { multi: true }, function (err, numRemoved) {});
	database.stats_db.persistence.compactDatafile();
	console.log(data_array[0].period);
	

	//below loop updates stats database with periods, period names and data
	for (var i = 0; i < 120; i++) {
		//database.stats_db
			database.stats_db.insert({
			
			
			period: data_array[i].period,
			month: (monthNumberToLabelMap[parseInt(data_array[i].period.substring(5,7))])+" "+data_array[i].period.substring(2,4),
			SYS: data_array[i].SYS,
			ALOS: data_array[i].ALOS,
			EIAKR: data_array[i].EIAKR,
			IAKR: data_array[i].IAKR,
			TOTB: data_array[i].TOTB,
			aloshet: data_array[i].aloshet,
			v27: data_array[i].v27,
			utrikes: data_array[i].utrikes,
			ungdom: data_array[i].ungdom
			
		});
	}
	console.log("updated stats database");
}
//stats_update();


/***********************************************************************************************************************************
 ***************************************************************************************************************************************/ 
//{"time":"2021M02","timestamp":"Mon Dec 20 2021 23:12:05 GMT+0100 (centraleuropeisk normaltid)","_id":"ZaaX3xhm2SGx9BBs"}

//x_server_test: server set up to receive get-requests
app.get('/api_x', async (request, response) => {
	await latesttime_update();
	await stats_update();
	
	response.json({reply: "x1 executed, api works", testvalue: 123});
});


//y_server_test: server set up to receive post-requests
app.post('/api_y', (request, response) => {
	var reply = '';
	var income = request.body.password;
	var count = 0;
	//if (request.body.password==secretpassword) {reply = 'correct';} else {reply = 'incorrect';}
	if (request.body.password=="sweden") {reply = 'correct password';} else {reply = 'incorrect password';}
	response.json({reply: reply, testvalue: 456});
});


//***********************************************************************************************************************
// provide data



//supply stats to amarknad.se
app.get('/api_supply', async (request, response) => {
	var supply_data = await new Promise( (resolve,reject) => {database.stats_db.find({ }, function (err, output) {resolve(output);});});
	response.json({supply_data});	
});



//***********************************************************************************************************************
// Automatic updates management

var run5min = 1;

function enter5minutes() {
	console.log("tick tock");
	//data = {name: "test"};
	setInterval(() =>{
		//data.time = Date();
		if (run5min==1) {
			latesttime_update();
			console.log("update again");
			//console.log(Date());
		}
	}, 1000 * 60 * 5 * 1);
}

app.post('/api_5minutes', (request, response) => {
	if (request.body.password==secretpassword) {enter5minutes();}
	response.json({reply: "5 minutes executed"});
});


//stop running enter5minutes
app.get('/api_5min_block', (request, response) => {
	run5min = 0;
	response.json({reply: "blocked"});
});


//***********************************************************************************************************************
// Control databases


//latest time
app.post('/printout_time', async (request, response) => {
	var db_data = "access denied";
	var control = '';
	var income = request.body.password;
	var count = 0;
	if (request.body.password==secretpassword) 
		{control = 'correct password'; db_data=await new Promise( (resolve,reject) => {database.time_db.find({ }, function (err, output) {resolve(output[0].time);});});} 
	else {control = 'incorrect password';}
	response.json({control: control, db_data: db_data});
});


//history
app.post('/printout_history10', async (request, response) => {
	var db_data = "access denied";
	var control = '';
	var income = request.body.password;
	var count = 0;
	if (request.body.password==secretpassword) 
		{control = 'correct password'; db_data= await new Promise( (resolve,reject) => {database.history_db.find({history: 'p10y'}, function (err, output) {resolve(output[0].periods);});});} 
	else {control = 'incorrect password';}
	response.json({control: control, db_data: db_data});
});


//***********************************************************************************************************************
// Other functions


//identify port
app.post('/port_identity', (request, response) => {
	var port_number = "access denied";
	var control = '';
	var income = request.body.password;
	var count = 0;
	if (request.body.password==secretpassword) {control = 'correct password'; port_number = port;} else {control = 'incorrect password';}
	//if (request.body.password=="sweden") {reply = 'correct password';} else {reply = 'incorrect password';}
	response.json({control: control, port: port_number});
});