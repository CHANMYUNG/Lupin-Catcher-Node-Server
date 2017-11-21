let mongoose = require('mongoose');

module.exports = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/Lupin-Catcher");
    mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error.'));
    mongoose.connection.on('open', () => {
        console.log("CONNECTED TO DATABASE");
    })
    mongoose.connection.on('disconnected', () => {
        console.log('DISCONNECTED FROM DATABASE')
    });
}