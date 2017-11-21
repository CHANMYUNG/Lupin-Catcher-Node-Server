const axios = require('axios');
const url = require('url');
const path = require('path');
const dialog = require('electron').remote.dialog;

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios({
            "method": "POST",
            "url": "/api/auth/local",
            "data": {
                "email": email,
                "password": password
            }
        })
        .then(response => {
            dialog.showMessageBox({
                "type": "error",
                "title": "로그인 실패",
                "message": document.cookie
            })
            location.href = "../html/main.html";
        })
        .catch(err => {
            if (!err.response) {
                dialog.showErrorBox("네트워크 오류!", "뭔가 문제가 발생헀어요!");
            } else if (err.response.status == 401) {
                dialog.showMessageBox({
                    "type": "error",
                    "title": "로그인 실패",
                    "message": "아이디 혹은 비밀번호를 틀렸습니다."
                })
            } else {
                console.log(err.response);
            }
        })
}

function openRegister() {
    let electron = require('electron');
    let remote = electron.remote;
    const top = remote.getCurrentWindow();

    let child = new remote.BrowserWindow({
        parent: top,
        show: false,
        modal: true,
        backgroundColor: "#ffffff"
    })
    child.loadURL('http://localhost:5000/public/html/register.html')
    child.once('ready-to-show', () => {
        child.show();
    })
    child.on('registered', () => {
        top.loadURL('http://localhost:5000/public/html/main.html');
    })
}