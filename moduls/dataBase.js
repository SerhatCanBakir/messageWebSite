const mongoose = require('mongoose');
const crypto = require('crypto');
const { log } = require('console');
const { ReturnDocument } = require('mongodb');
const Schema = mongoose.Schema;
const MongoIp = 'mongodb+srv://serhatcanbakir2534:SerhatWpDeneme@serhatwp.35jh1l9.mongodb.net/?retryWrites=true&w=majority&appName=SerhatWp';
mongoose.connect(MongoIp).then(console.log('MongoServerina baglandi')).catch(err => { console.log(err) });

const newUserSchema = new Schema({
    'userName': { type: String },
    'password': { type: String },
    'rooms': { type: [String] },

});

const newMessageSchema = new Schema({
    'user': { type: String },
    'msg': { type: String },
    'room': { type: String },
    'date': { type: Date },
})


const User = mongoose.model('user', newUserSchema);

async function login(object) {
    let user = await User.findOne({ 'userName': object.userName })
    let hexpas = crypto.createHash('sha256').update(object.password).digest('hex');
    if (user.password === hexpas) {
        return user;
    } else {
        return false;
    }
}


async function register(object) {
    let log = await login(object);
    if (log != false) {
        let sifre = crypto.createHash('sha256').update(object.password).digest('hex');
        const NewUser = new User({
            'userName': object.userName,
            'password': sifre,
            'rooms': null,
        });
        let save = await NewUser.save();
    } else {
        return false;
    }
}
