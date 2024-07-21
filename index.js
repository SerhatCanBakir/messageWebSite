const exp = require("express");
const app = exp();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;
const DBfunc = require('./moduls/dataBase');
const JWtfunc = require('./moduls/JWTfunc');
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/HtmlFiles/register.html");
})

app.get('/client', (req, res) => {
    res.sendFile(__dirname + '/HtmlFiles/Client.html')

})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/HtmlFiles/register.html');
})

app.get('/room',(req,res)=>{
    res.sendFile(__dirname+'/HtmlFiles/room.html');
})

io.on('connection', (socket) => {

    socket.on('Oda al', async (token) => {
        console.log(token);
        JWtfunc.TokenData(token, (user) => {
            console.log(user);
            if (user != false && user != undefined) {
                if (user.rooms == null) {
                    user.rooms = [];
                }
                socket.emit('odalar', user.rooms);
            }
            else { socket.emit('hata', 'token doldu') }
        });

    })

    socket.on('oda ekle', ({ oda, token }) => {
        JWtfunc.TokenData(token, async (user) => {
            if (user != false) {
                if (user.rooms.includes(oda)) {
                    //pass
                    console.log('oda var');
                    socket.emit('devam', 'calisti');
                } else {
                    var a = await DBfunc.addRoomToUser(oda, user);
                }
                if (a) {
                    socket.emit('devam', 'calisti');
                }
            } else { socket.emit('hata', 'gecersiz token') }
        });

    })

    socket.on('login', async (object) => {
        let user = await DBfunc.login(object);

        if (user != false && user != null && user != undefined) {
            let token = JWtfunc.createToken(JSON.stringify(user));
            socket.emit('token', token);
        } else {
            socket.emit('hata', 'hatali giris');
        }
    })

    socket.on('register', async (object) => {
        let temp = await DBfunc.register(object);
        if (temp) {
            socket.emit('sucsess', null);
        } else {
            socket.emit('hata', 'kullanici halihazirda var')
        }
    })



   /* socket.on('oda kontrol', ({ roomid, token }) => {
        JWtfunc.TokenData(token, async (user) => {
            if (user != false) {
                let a = await DBfunc.roomFindOrCreate({ room: roomid, user: user.userName });
                socket.emit('basarili', 'oda konturolu basarili');
            } else { socket.emit('hata', 'gecersiz token'); }
        })
    })*/

    socket.on('gecmis mesajlar', async (roomid) => {
        let a = await DBfunc.takeMessage(roomid);
        if(a==null){
            console.log(a);
            socket.emit('hata','mesaj alinamadi')
        }
        socket.emit('eski mesaj', a);
    })

    socket.on('odaya katil', (roomid) => {
        socket.join(roomid)
    })

    socket.on('mesaj', ({ roomid, token ,msj})=> {
    JWtfunc.TokenData(token,async(user)=>{
        if(user!=false){
            let a = await DBfunc.addMesage({room:roomid,user:user.userName,msg:msj})
            io.to(roomid).emit('mesaj',user.userName+' : '+ msj );
        }
    })
    })

})


server.listen(port, () => {
    console.log("app " + port + " de dinleniyor");
})







