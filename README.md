# long-poll #
Push Data with Long Polling using Node.js, Socket.io and MySQL

You need to push data from your server without the client asking for it, in order to display real time data without a page refresh. One limitation to do this with polling is, your clients have to bash the server with short pauses, asking for a value continuously, however there is an approach around it, by waiting until there really is an update on the database before the server pushes the data to the clients. This approach is called long polling, and it is the way big names like facebook pushes notifications, as well as Gmail displaying new emails without page refreshes etc. In this post, I will keep the text short for you to dig into code straight away.

# Server side #

The following code is for server.js, Node.JS server which allows us to poll the database every second (see POLLING_INTERVAL variable) and only push the response if it is different than previous response. See client.html to display the client side of socket.io code we need to push the notification from server.

In this particular example, the business logic is simplified to only display the count of notifications we have from our mysql table, called activity_log, which displays activities taken part on our site by the user, uniquely identified with profile_id column. Obviously, one prerequisite for this to work is to have this table created in your MySql database, with the same columns (notified, profile_id) and values (both columns are int).

# Client side #

On the client side, instead of pulling the new data via AJAX, we make use of socket.io to listen to notifications emitted by the server and display the response data in a div. This is enabled by web sockets (socket.io library in this case) and it's a great way to display real-time data on our single page applications.

As stated earlier, if you notice the line where there's a querystring variable called profile_id being sent, this is retrieved via socket.handshake.query.profile_id on server side, via our socket.

# To Do #

TLDR: Install nodejs and mysql (and make a db/table as the mysql statement above requires) copy and paste above server (server.js, with mysql and socket.io package dependencies) and client (client.html) codes to experiment with a working prototype of long polling push notifications.

# Installation (Step by Step) #

```
git clone https://github.com/Porrapat/long-poll.git
cd long-poll
npm install
```

Config your MySQL database, Dump the data from longpoll.sql and fix index.js file.

```
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', //put your own mysql pwd
    database: 'longpoll', //put your database name
    port: 3306
}),
```

Run

```
node index.js
```

Or

```
nodemon index.js
```

locate http://localhost:3000/

Try to insert or delete some records. You will see the web page will update it automatically every 1 second.

# Your homework #

* Create more value and check it updating in real-time.
* Create some dashboard.
* Integrate it with chart like Chart.js or HighChart.
* Help me test with a lot of data. More clients or More records.