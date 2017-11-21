function exit() {
    require('electron').remote.getCurrentWindow().close();
}

let socket = require('socket.io-client')("http://localhost:5000");
socket.emit('enter',{
    "ON": "SEESE"
});