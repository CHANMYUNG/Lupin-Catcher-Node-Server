let socket = require('socket.io-client')('http://localhost:5000');

socket.on('connect', () => {
    socket.emit('login', getCookie('lupinCatcherSessionId'));
})

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

let remote = require('electron').remote;

function printProcesses() {
  const ps = require('ps-node');
  let div = document.getElementById("div");
  div.innerHTML = "";
  ps.lookup({
    "command": /.{0,}/
  }, (err, results) => {
    for (let i = 0; i < results.length; i++) {
      div.innerHTML += "PROCESS :: " + i + "<br>";
      div.innerHTML += 'PID : ' + results[i].pid + "<br>";
      div.innerHTML += 'COMMAND : ' + results[i].command + "<br>";
      div.innerHTML += 'Arguments : ' + results[i].arguments + "<br>" + "<br>";
    }
  });

  const {
    remote
  } = require('electron')
  let top = remote.getCurrentWindow();

  //top.close();
  // let child = new remote.BrowserWindow({
  //   parent: top,
  //   modal: true
  // })

  // child.loadURL(url.format({
  //   pathname: path.join(__dirname, '/../html/index2.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
}