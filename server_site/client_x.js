

//B1 set up and call function for GET-request 
async function my_fetch_function() {
	const response = await fetch('/api_x');
	const data = await response.json();
	console.log(data);
}
//checkforindex();



