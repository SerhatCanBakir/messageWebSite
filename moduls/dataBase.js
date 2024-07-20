const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const MongoIp = 'mongodb+srv://serhatcanbakir2534:SerhatWpDeneme@serhatwp.35jh1l9.mongodb.net/?retryWrites=true&w=majority&appName=SerhatWp';
mongoose.connect(MongoIp).then(console.log('MongoServerina baglandi')).catch(err => { console.log(err) });


// şemaların tanımlanması 
const newUserSchema = new Schema({
    userName: { type: String },
    password: { type: String },
    rooms: { type: [String] },

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

//user modelinin tanımlanması
const User = mongoose.model('user', newUserSchema);



// kullanıcı girişi eğer doğru ise kullanıcı bilgisini değil ise false döndürür
async function login(object) {
    let user = await User.findOne({ userName: object.userName })
    let hexpas = crypto.createHash('sha256').update(object.password).digest('hex');
    if (user == null) {
        return false;
    } else {
        if (user.password == hexpas) {
            return user;
        } else { return null }

    }
}

//kayıt olma fonksiyonu kullanıcı hali hazırda varsa false yoksa true döndürür
async function register(object) {
    let log = await login(object);
    if (log == false) {

        let sifre = crypto.createHash('sha256').update(object.password).digest('hex');
        const NewUser = new User({
            'userName': object.userName,
            'password': sifre,
            'rooms': [],
        });
        let save = await NewUser.save();
        return true;
    } else {
        return false;
    }
}
// eğer oda yoksa oluşturur varsa odaya kullanıcıyı ekler 
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
    return true;

}

// odaya mesaj ekler 
async function addMesage(obj) {
    const message = await mongoose.model(obj.room, newMessageSchema);
    let now = new Date();
    let newMessage = new messege({
        user: obj.user,
        msg: obj.msg,
        date: now,
    })
    a = await newMessage.save();
}
// odadaki önceki mesajları alır 
async function takeMessage(roomId) {
    const message = await mongoose.model(roomId, newMessageSchema);
    let msj = await message.find(roomId);
    msj.sort((a, b) => { a.date - b.date });
    return msj;
}

async function addRoomToUser(room, userInfo) {
    userInfo.rooms.push(room);
    let a = await User.updateOne({ userName: userInfo.userName }, { rooms: userInfo.rooms });
    return true;
}

module.exports = {
    login,
    register,
    roomFindOrCreate,
    addMesage,
    takeMessage,
    addRoomToUser,
}