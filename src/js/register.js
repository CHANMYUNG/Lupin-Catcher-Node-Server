let emailValidated = false;
let passwordValidated = false;
let passwordMatches = false;

function emailValidation() {
    emailValidated = false;
    const email = document.getElementById("email").value;
    let emailNotice = document.getElementById("emailNotice");

    removeBorder(document.getElementById("email"));
    if (email === "") {
        closeSpan(emailNotice);
        return;
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        showSpan(emailNotice, "이메일 형식이 아니네요!", "ff0000");
    } else {
        closeSpan(emailNotice);
    }
}

function emailValidationFromServer() {
    const axios = require('axios');
    const email = document.getElementById("email").value;
    const dialog = require('electron').remote.dialog;
    let emailNotice = document.getElementById("emailNotice");

    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        axios({
                "method": "GET",
                "url": "http://localhost:5000/api/email/validation/" + email
            })
            .then(response => {
                setBorderColor(document.getElementById("email"), "#00ff00");
                showSpan(emailNotice, "사용 가능한 이메일입니다!", "#00ff00")
                emailValidated = true;
            })
            .catch(error => {
                if (!error.response) {
                    dialog.showErrorBox("네트워크 오류", "adasd");
                } else if (error.response.status == 409) {
                    setBorderColor(document.getElementById("email"), "#ff0000");
                    showSpan(emailNotice, "이미 사용중인 이메일입니다!", "#ff0000");
                }
                emailValidated = false;
            })
    }
}

function passwordValidation() {
    passwordValidated = false;

    // TODO :: FUCKING REINPUT
    document.getElementById("re_password").value = "";
    passwordMatch();

    const password = document.getElementById("password").value;
    const passwordNotice = document.getElementById("passwordNotice");

    const numberExist = password.search(/[0-9]/g) != -1;
    const engExist = password.search(/[a-z]/g) != -1;
    const specialCharExist = password.search(/\W/g) != -1;

    if (!numberExist || !engExist || !specialCharExist) {
        showSpan(passwordNotice, "비밀번호는 영문/숫자/특수문자를 모두 사용해야합니다.");
        return;

    } else if (!/^[a-zA-Z0-9\W]{10,30}$/.test(password)) {
        showSpan(passwordNotice, "비밀번호는 영문/숫자/특수문자 혼합 10~30자리를 만족해야합니다.", "#FF0000");
        return;
    }
    passwordValidated = true;
    closeSpan(passwordNotice);
}

function passwordMatch() {

    passwordMatches = false;


    const password = document.getElementById("password").value;
    const re_password = document.getElementById("re_password").value;
    let rePasswordNotice = document.getElementById("rePasswordNotice");
    let passwordInputFields = document.getElementsByClassName("passwordFields");
    console.log(passwordInputFields);
    if (!passwordValidated) {
        closeSpan(rePasswordNotice);
        removeBorder(passwordInputFields);
        return;
    }

    if (password != re_password && re_password.length != 0) {
        showSpan(rePasswordNotice, "비밀번호가 일치하지 않습니다.", "#FF0000");
        setBorderColor(passwordInputFields, "#FF0000")
    } else if (re_password.length != 0) {
        showSpan(rePasswordNotice, "비밀번호가 일치합니다!", "#00FF00");
        setBorderColor(passwordInputFields, "#00FF00")
        passwordMatches = true;
    }
}

function exit() {
    let electron = require('electron');
    electron.remote.getCurrentWindow().close();
}

function showSpan(span, message, color) {
    removeAllChildren(span);
    let txt = document.createTextNode(message);
    span.appendChild(txt);
    if (color) {
        span.style.color = color;
    }
    span.style.display = "inline-block";
}

// function showSpans(spans, message, color) {
//     for (let i = 0; i < spans; i++) {
//         showSpan(spans[i], message, color);
//     }
// }

function closeSpan(span) {
    span.style.display = "none";
}

function removeBorder(tag) {
    if (tag instanceof HTMLCollection) {
        for (let i = 0; i < tag.length; i++) {
            tag[i].style.border = "";
        }
    } else tag.style.border = "";
}

function setBorderColor(tag, color) {
    console.log(tag instanceof HTMLCollection);
    if (tag instanceof HTMLCollection) {
        console.log("Array")
        for (let i = 0; i < tag.length; i++) {
            tag[i].style.border = "1px solid" + color;
        }
    } else tag.style.border = "1px solid " + color;
}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function register() {
    const dialog = require('electron').remote.dialog;
    const currentWindow = require('electron').remote.getCurrentWindow();
    if (!emailValidated || !passwordValidated || !passwordMatches) {
        dialog.showMessageBox({
            type: 'error',
            buttons: ['OK'],
            message: '가입에 필요한 절차를 모두 밟아주세요!'
        });
        return;
    }

    const axios = require('axios');

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("nickname").value;

    axios({
            "method": "POST",
            "url": "http://localhost:5000/api/auth/signup",
            "data": {
                "email": email,
                "password": password,
                "nickname": nickname
            }
        })
        .then(response => {
            if (response.status == 201) {
                dialog.showMessageBox({
                    type: 'none',
                    buttons: ['OK'],
                    message: '가입이 완료되었습니다!'
                });
                currentWindow.emit('registered');
                currentWindow.close();
            } else {
                dialog.showMessageBox({
                    type: 'warning',
                    buttons: ['OK'],
                    message: 'Unknown Status Code :: ' + response.status
                });
            }
        })
        .catch(response => {
            if (!error.response) {
                dialog.showErrorBox("네트워크 오류!", "뭔가 문제가 발생했어요!");
            } else if (error.response.status == 409) {
                emailValidated = false;
                setBorderColor(document.getElementById("email"), "#ff0000");
                showSpan(document.getElementById("emailNotice"), "이미 사용중인 이메일입니다!", "#ff0000");
                dialog.showErrorBox("이런!", "이미 사용중인 이메일입니다!");
            } else {

            }
        })

}