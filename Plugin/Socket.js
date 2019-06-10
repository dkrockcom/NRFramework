const url = require('url');

let socketState = {
	CLOSED: 'closed',
	CLOSING: 'closing',
	CONNECTED: 'connected',
	CONNECTING: 'connecting',
	OPEN: 'open'
}

let clients = [];
exports.Initialize = function (server, app) {
	const io = require("./node_modules/socket.io")(server);
	io.on('connection', (socket) => {
		let query = Object.assign({}, socket.client.request._query);
		console.log('Socket connection is alive ' + query.userId);

		clients.push({
			userId: query.userId,
			socket: socket
		});

		//Event for the message.
		socket.on('message', (data) => {

		});

		//Event for the message typing status.
		socket.on('typing', (data) => {

		});

		socket.on('disconnect', function (reason) {
			let index = clients.findIndex(x => x.socket === this);
			if (index > -1) {
				clients.splice(index, 1);
			}
		});

		socket.on('error', function (e) {
			let index = clients.findIndex(x => x.ws === this);
			if (index > -1) {
				clients.splice(index, 1);
			}
		});
	});
};

exports.Send = function (options) {
	let client = clients.filter(e => e.userId == options.data.userId);
	if (client && client.length > 0) {
		client.forEach(function (client) {
			try {
				if (client.socket.client.conn.readyState === socketState.OPEN) {
					client.socket.emit('message', options);
				}
			} catch (e) {
				console.log(e);
			}
		});
	}
};

exports.Broadcast = function (options) {
	if (clients && clients.length > 0) {
		clients.forEach(function (client) {
			try {
				if (client.socket.conn.readyState === socketState.OPEN) {
					client.socket.emit('message', options);
				}
			} catch (e) {
				console.log(e);
			}
		});
	}
};	