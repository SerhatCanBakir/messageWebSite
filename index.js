const exp = require("express");
const app = exp();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;
const ip = '192.168.1.69';
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/HtmlFiles/login.html");
})

app.get('/client', (req, res) => {
    res.sendFile(__dirname + '/HtmlFiles/client.html')

})

io.on('connection', (socket) => {
    console.log(socket.id + "   'li kullanici baglantı kurdu");

    socket.on('Oda', (Oda) => {
        socket.join(Oda);
        console.log(socket.id + "   odaya katıldı  " + Oda);

    })

    socket.on('TopluMesaj', (obj) => {
        io.to(obj.Oda).emit('Mesaj', obj.nick + ': ' + obj.msj);
        
    })

    socket.on('disconnect', () => {
        console.log(socket.id + "    'id li kullanici ayrildi");
    })
})



server.listen(port, ip, () => {
    console.log("app ${port} de dinleniyor");
})







