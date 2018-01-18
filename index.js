var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    mysql = require('mysql'),
    connectionsArray = [],
    last_count = 0, //this variable is to check previous count value
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234', //put your own mysql pwd
        database: 'longpoll', //put your database name
        port: 3306
    }),
    POLLING_INTERVAL = 1000;	//polling every 1 second.


// If there is an error connecting to the database
connection.connect(function(err) {
    // connected! (unless `err` is set)
    console.log(err);
});

// creating the server ( localhost:3000 )
app.listen(3000);

// on server started we can load our client.html page
function handler(req, res) {
    fs.readFile(__dirname + '/client.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

// First Query --- Please remove when we coding with server side language like PHP.
var firstQuery = function(socket) {
    sql = "SELECT count(id) as c FROM product";
    // Doing the database query
    var query = connection.query(sql);

    // setting the query listeners
    query
        .on('error', function(err) {
            // Handle error, and 'end' event will be emitted after this as well
            console.log(err);
        })
        .on('result', function(record) {
            // loop on itself only if there are sockets still connected
            data = {};
            data.time = new Date();
            data.count = record.c;
            socket.emit('showmessage', data);
        })
};

/*
 * HERE IT IS THE COOL PART
 * This function loops on itself since there are sockets connected
 * to the page. Upon Update it only emits the notification if
 * the value has changed.
 * Polling the database after a constant interval
 */
var pollingLoop = function() {
    sql = "SELECT count(id) as c FROM product";
    // Doing the database query
    var query = connection.query(sql);

    // setting the query listeners
    query
        .on('error', function(err) {
            // Handle error, and 'end' event will be emitted after this as well
            console.log(err);
            updateSockets(err);
        })
        .on('result', function(record) {
            // loop on itself only if there are sockets still connected
            if (connectionsArray.length) {
                pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);
                updateSockets({
                    count: record.c
                });
            }
        })
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

    console.log('Number of connections:' + connectionsArray.length);

    firstQuery(socket);

    // starting the loop only if at least there is one user connected
    if (!connectionsArray.length) {
        pollingLoop();
    }

    socket.on('disconnect', function() {
        var socketIndex = connectionsArray.indexOf(socket);
        console.log('socket = ' + socketIndex + ' disconnected');
        if (socketIndex >= 0) {
            connectionsArray.splice(socketIndex, 1);
        }
    });

    console.log('A new socket is connected!');
    connectionsArray.push(socket);
});

var updateSockets = function(data) {
    if (last_count != data.count) {
        // adding the time of the last update
        data.time = new Date();
        // sending new data to all the sockets connected
        connectionsArray.forEach(function(tmpSocket) {
            tmpSocket.emit('showmessage', data);
        });
    }
    last_count = data.count;
};