
console.log('x_fetch_function()');
console.log('x2_fetch_function()');
console.log('y_fetch_function()');




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

async function x2_fetch_function() {
	const response = await fetch('/api_x2');
	const data = await response.json();
	console.log(data);
}


// y code
async function y_fetch_function(aaa) {
	const response = await fetch('/api_y',{
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(aaa)
});
	const data = await response.json();
	console.log(data.reply);
	console.log(data);
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
//console.log("Tid")
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


async function test_a_fetch() {
dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
const response = await fetch(dload2_usegments_url, dload2_usegments_options);
const scbdata = await response.json();
console.log(dload2_usegments_body);
console.log(scbdata.data);
}
//test_a_fetch();




var periodlist = '';
async function create_list_periods(per_num) {
	var loaded_time = "2021M11";
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

async function daily_update() {
	await create_list_periods(60); //update list of periods
	var entries_periods = JSON.parse(periodlist); //an object version of period list
	var response = [];
	var scbdata = [];
	const data_array = [];
	//insert periods
	for (var i = 0; i < 60; i++) {data = {period: entries_periods[i]}; data_array[i] = data;}

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
	for (var i = 0; i < 60; i++) {data_array[i].SYS = scbdata.data[i].values[0];}
	
	//insert ALÖS
	dload1_basic_body.query[2].selection.values=["ALÖS"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].ALÖS = scbdata.data[i].values[0];}

	//insert EIAKR
	dload1_basic_body.query[2].selection.values=["EIAKR"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].EIAKR = scbdata.data[i].values[0];}

	//insert IAKR
	dload1_basic_body.query[2].selection.values=["IAKR"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].IAKR = scbdata.data[i].values[0];}
	
	//insert TOTB
	dload1_basic_body.query[2].selection.values=["TOTB"];
	dload1_basic_options = {method: "POST",body: JSON.stringify(dload1_basic_body)};
	response = await fetch(dload1_basic_url, dload1_basic_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].TOTB = scbdata.data[i].values[0];}

	//calculation arbetslöshet
	for (var i = 0; i < 60; i++) {data_array[i].arbetsloshet = Math.round(10000*data_array[i].ALÖS/data_array[i].IAKR)/100;}

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
	for (var i = 0; i < 60; i++) {data_array[i].v27 = scbdata.data[i].values[0];}
	dload2_usegments_body.query[0].selection.values = ["TOT"];
	
	//insert utrikes
	dload2_usegments_body.query[1].selection.values = ["23"];
	dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
	response = await fetch(dload2_usegments_url, dload2_usegments_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].utrikes = scbdata.data[i].values[0];}
	dload2_usegments_body.query[1].selection.values = ["83"];
	
	//insert ungdom 15-24
	dload2_usegments_body.query[3].selection.values = ["15-24"];
	dload2_usegments_options = {method: "POST",body: JSON.stringify(dload2_usegments_body)};
	response = await fetch(dload2_usegments_url, dload2_usegments_options);
	scbdata = await response.json();
	for (var i = 0; i < 60; i++) {data_array[i].ungdom = scbdata.data[i].values[0];}
	dload2_usegments_body.query[3].selection.values = ["tot15-74"];

	//console.log(scbdata);
	console.log(data_array);
}

daily_update();

























