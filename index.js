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
    res.sendFile(__dirname + '/HtmlFiles/client.html')

})

app.get('/register',(req,res)=>{
    res.sendFile(__dirname + '/HtmlFiles/register.html');
})

io.on('connection', (socket) => {

    socket.on('Oda al',async (token)=>{
        console.log(token);
        JWtfunc.TokenData(token,(user)=>{
            console.log(user);
        if(user!=false  && user!=undefined){
            if(user.rooms==null){
                user.rooms=[];
            }
        socket.emit('odalar',user.rooms);}
        else{socket.emit('hata','token doldu')}
        });
        
    })

    socket.on('oda ekle',({oda,token})=>{
        JWtfunc.TokenData(token,async (user)=>{if(user!=false){
        if(user.rooms.includes(oda)){
            //pass
            console.log('oda var');
            socket.emit('devam','calisti');
        }else{
        var a = await DBfunc.addRoomToUser(oda,user);} 
        if(a){
            socket.emit('devam','calisti');
        }
       }else{socket.emit('hata','gecersiz token')}});
       
    })

    socket.on('login',async(object)=>{
     let user = await DBfunc.login(object);
     
     if(user!= false && user!=null && user!= undefined){
     let token = JWtfunc.createToken(JSON.stringify(user));
     socket.emit('token',token);
     }else{
        socket.emit('hata','hatali giris');
     }
    })

    socket.on('register',async(object)=>{
       let temp = await DBfunc.register(object);
       if(temp){
        socket.emit('sucsess',null);
       }else{
        socket.emit('hata','kullanici halihazirda var')
       }
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
    console.log("app "+port+" de dinleniyor");
})







