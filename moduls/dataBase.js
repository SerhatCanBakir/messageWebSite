const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const MongoIp = 'mongodb+srv://serhatcanbakir2534:SerhatWpDeneme@serhatwp.35jh1l9.mongodb.net/?retryWrites=true&w=majority&appName=SerhatWp';
mongoose.connect(MongoIp).then(console.log('MongoServerina baglandi')).catch(err => { console.log(err) });

const newUserSchema = new Schema({
    'userName': { type: String },
    'password': { type: String },
    'rooms': { type: [String] },

});

const newMessageSchema = new Schema({
    user: { type: String },
    msg: { type: String },
    date: { type: Date },
})

const newRoomSchema = new Schema({
    roomid: { type: String },
    description: { type: String },
    Users: { type: [String] },
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

async function roomFindOrCreate(obj) {
    const Room = mongoose.model(obj.room, newRoomSchema)
    let roomid = await Room.find({ roomid: obj.room });
    if (roomid == null) {
        let newRoom = new Room({
            roomid: obj.room,
            description: null,
            Users: obj.user,
        })
        let a = await newRoom.save();

    } else {
        let userExist = roomid.Users.includes(obj.user);
        if (userExist) {
            //do nothing
        } else {
            roomid.Users.push(obj.user);
            let hold = await Room.updateOne({ roomid: obj.room }, { Users: roomid.Users }, (err, res) => {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                  console.log('kullanici eklendi');
                }


            })

        }
    }

}


async function addMesage(obj){
  const message = await  mongoose.model(obj.room,newMessageSchema);
   let now = new Date();
   let newMessage = new messege({
    user:obj.user,
    msg:obj.msg,
    date:now,
})
a = await newMessage.save();
}

async function takeMessage(roomId){
    const message = await  mongoose.model(roomId,newMessageSchema);
    let msj = await message.find(roomId);
    msj.sort((a,b)=>{a.date-b.date});
    return msj;
}