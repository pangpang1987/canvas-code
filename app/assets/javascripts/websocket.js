// To maintain atomicity, new object requests and object updates should be returned from the server before being applied to the canvas view. This may create a little lag but will simplify development.


// Object format
/*
var sampleObj = {
	id: 107, //Id of object
	text: 'some text',
	parent: 27, //Id of parent node
	owner: 4 //Id of creator
	// etc
}


var path = 'ws://'+window.location.hostname+':8080';
var socket = new WebSocket(path);

socket.onopen = function() {
	// Display "connected"
	$('#status').text('Connected');
}

socket.onclose = function() {
	// Display "connected"
	$('#status').text('Not Connected');
}

socket.onmessage = function(msg) {
	var obj = JSON.parse(msg.data.substring(10,msg.data.length));
	console.log(obj);
	switch (obj.method) {
		case "create":
			add_new_node(obj.id, obj.data);
			console.log("create");
			break;
		case "update":
			update_node(obj.id, obj.data);
			console.log("update");
			break;
		case "delete":
			//deleteItem(obj.id);
			console.log("delete");
			break;
	}	
}


var idea = {


	create: function(obj) {
		obj.method = 'create';
		socket.send(JSON.stringify(obj));
	},

	update: function(id, obj) {
		socket.send({
			method: 'update',
			id: id,
			data: obj
		});
	},

	"delete": function(id) {
		socket.send({
			method: 'delete',
			id: id
		});
	}
}
*/
