const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoIp = 'mongodb+srv://serhatcanbakir2534:SerhatWpDeneme@serhatwp.35jh1l9.mongodb.net/?retryWrites=true&w=majority&appName=SerhatWp';
mongoose.connect(MongoIp).then(console.log('MongoServerina baglandi')).catch(err => { console.log(err) });

const newUserSchema = new Schema({
'userName':{type:String},
'password':{type:String},
'rooms':{type:[String]},

});

const newMessageSchema = new Schema({
 'user':{type:String},
 'msg':{type:String},
 'room':{type:String},
 'date':{type:Date},
})

