const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise;

// set up a model and schema
// denote a model with uppercase (i.e. Message)
const Message = mongoose.model('Message', {
    name: String,
    message: String
})

// acts as our local storage for the initial building of the app
// array of message objects, where each message contains a
// name property and a message property.
// ==========================================
// let messages = [
//     {name: 'Tim', message: 'Hi'},
//     {name: 'Afton', message: 'Hello'},
// ]


// Endpoints for our frontend to communicate to our backend (here).
// if you go to the messages endpoint, you
// will see all of our messages in the array
app.get("/messages", (req, res) => {
    Message.find()
        .then(function (messages) {
            res.send(messages);
        })
        .catch(function (err) {
            console.log(err);
        })
});

app.post("/messages", (req, res) => {
    let message = new Message(req.body);
    message.save()
        .then(() => {
            console.log('saved');
            return Message.findOne({message: 'badword'});

        })
        .then( censored => {
            if (censored) {
                console.log('censored words found', censored);
                return Message.deleteOne({_id: censored.id});
            }
            else {
                io.emit('message', req.body);
                res.sendStatus(200);
            }

        })
        .catch((err) => {
            res.sendStatus(500);
            return console.error(err)
        });
})

io.on('connection', (socket) => {
    console.log("a user connected.");
})

mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// server is listening on port 3000
const server = http.listen(3000, () => {
    console.log("Server is listening on port", server.address().port)
});