const exp = require("express");
const app = exp();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;
//const ip = '';
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/HtmlFiles/login.html");
})

app.get('/client', (req, res) => {
    res.sendFile(__dirname + '/HtmlFiles/client.html')

})




server.listen(port,() => {
    console.log("app ${port} de dinleniyor");
})







