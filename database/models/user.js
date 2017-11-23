const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const uuid = require('uuid/v4');

let User = Schema({
    "email": { type: String, required: true, unique: true },
    "password": { type: String },
    "nickname": { type: String, required: true },
    "auth": { type: String, required: true },
    "asUser": [Schema.Types.ObjectId],
    "asAdmin": [Schema.Types.ObjectId]
}, {
        collection: "User"
    });


User.statics.create = function (email, password, nickname, _auth, _asUser, _asAdmin) {
    const secret = process.env.Lupin_Catcher_SECRET || "DEFAULT SECRET KEY!";
    const auth = _auth || "local";
    const asUser = _asUser || [];
    const asAdmin = _asAdmin || [];

    const cipher = crypto.createCipher('aes192', secret);
    let encryptedEmail = cipher.update(email, 'utf8', 'hex');
    encryptedEmail += cipher.final('hex');


    const encryptedPassword = crypto.createHmac('sha1', secret)
        .update(password)
        .digest('base64');


    return new this({
        "email": encryptedEmail,
        "password": encryptedPassword,
        nickname,
        auth,
        asUser,
        asAdmin
    }).save();
}

User.statics.findOneByEmail = function (_email) {
    const secret = process.env.Lupin_Catcher_SECRET || "DEFAULT SECRET KEY!";
    const cipher = crypto.createCipher('aes192', secret);
    let email = cipher.update(_email, 'utf8', 'hex');
    email += cipher.final('hex');
    return this.findOne({ email }).exec();
}

User.methods.verifyPassword = function (password) {
    const secret = process.env.Lupin_Catcher_SECRET || "DEFAULT SECRET KEY!";
    
    const encryptedPassword = crypto.createHmac('sha1', secret)
        .update(password)
        .digest('base64');
    return this.password == encryptedPassword;
}

User.statics.createRefreshToken = function () {
    const UserModel = this;
    return new Promise((resolve, reject)=>{
        while(true) {

            let refreshToken = uuid();
            UserModel.findOne({
                refreshToken
            }).then(user => {
                if(!user) {
                    resolve(refreshToken)
                    break;
                } else {
                    continue;
                }
            }).catch(err => {
                console.log(err)
                throw err;
            })
        }
    })
}
module.exports = mongoose.model('User', User);