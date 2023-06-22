const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// acts as our local storage for the time being
// array of message objects, where each message contains a
// name property and a message property.
let messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Afton', message: 'Hello'},
]
// Endpoints for our frontend to communicate to our backend (here).
// if you go to the messages endpoint, you
// will see all of our messages in the array
app.get("/messages", (req, res) => {
    res.send(messages);
})

app.post("/messages", (req, res) => {
    messages.push(req.body);
    io.emit('message', req.body);
    res.sendStatus(200);
})

io.on('connection', (socket) => {
    console.log("a user connected.");
})

// server is listening on port 3000
const server = http.listen(3000, () => {
    console.log("Server is listening on port", server.address().port)
});