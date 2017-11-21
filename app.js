const express = require('express');
const app = express();
let passport = require('./authentication/passport');
const server = require('http').createServer(app);
const database = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketCookieParser = require('socket.io-cookie');
const morgan = require('morgan');
let sharedSession = require('express-socket.io-session')
let io = require('socket.io')(server);

const session = require('express-session')({
    secret: process.env.LUPIN_CATCHER_SECRET || "testSecret!@#",
    resave: true,
    saveUninitialized: true
});


app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(session); // 세션 활성화
app.use(require('passport').initialize()); // passport 구동
app.use(require('passport').session()); // 세션 연결

passport();

io.use(sharedSession(session, cookieParser()));

io.on("connection", function (socket) {
    console.log(socket.handshake.session);
    socket.on('login', function (sessionId) {
        console.log(sessionId);
        socket.handshake.session.sessionId = sessionId;
        socket.handshake.session.save();
        console.log("asdasd");
        // console.log(userdata);
        socket.emit('logged_in', socket.handshake.session);
    })

    socket.on('logout', function (userdata) {
        if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
    })
});
app.use('/', (req, res, next)=>{
    console.log(req.cookies);
    next();
})
app.use('/public', express.static('public'));
app.use('/api', require('./routes'));
server.listen(5000, () => {
    database();
    console.log("RUNNING ON 5000 PORT");
})