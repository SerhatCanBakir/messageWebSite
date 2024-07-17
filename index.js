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
    res.sendFile(__dirname + "/HtmlFiles/login.html");
})

app.get('/client', (req, res) => {
    res.sendFile(__dirname + '/HtmlFiles/client.html')

})

io.on('connection', (socket) => {

    socket.on('login',(object)=>{
     
    })



    socket.on('joinRoom', async (object) => {
        let a = JWtfunc.TokenData(object.token);
        if (a == false) {
            socket.emit('hata', 'token dogrulanamadi')
        } else {
            let roomLogObj = { room: object.room, user: a.username }
            let room = await DBfunc.roomFindOrCreate(roomLogObj);
            if (room) {
                socket.join(object.room);
            } else {
                socket.emit('hata', 'oda baglantisinda hata olustu')
            }
        }
        socket.on('openRoom', async (roomid) => {
            let mesajlar = await DBfunc.takeMessage(roomid);
            socket.emit('loadMessage', mesajlar);
        })

        socket.on('mesaj', async (object) => {
            let userdata = JWtfunc.TokenData(object.token);
            if (userdata == false) {
                socket.emit('hata', 'gecersiz token');
            } else {
                let mesageObj = { user: userdata.username, msj: object.msj };
                let add = await DBfunc.addMesage(mesageObj);
                io.to(object.room).emit('mesaj', (mesageObj))
            }
        })




    })


})


server.listen(port, () => {
    console.log("app ${port} de dinleniyor");
})







