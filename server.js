/**
 * Created by sangeeta on 3/8/17.
 */

const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require ('http');
const server = http.Server(app);
const io = socket(server);

let chats=[];
let clients ={};


io.on("connection", function(conn){
    console.log('A client has connected' + conn.id)

    //io.to(conn.id).emit('chatlog',chats)

    conn.emit('chatlog',chats);

    conn.on("sign_up",function(data){
        clients[data] = conn.id;
        console.log(clients);
    });

    conn.on("send_msg", function (data){

        if(data.msg.charAt(0)=="@"){
            let toUser = data.msg.split(" ",1)[0].substring(1);
            let msg = data.msg.substring(data.msg.indexOf(" ") + 1);

            io.to(clients[toUser]).emit("rcv_msg", data.user + ": " + msg);
        }

        else {
            chats.push(data);
            io.emit("rcv_msg", data.user + ": " + data.msg)
        }
        //chats.push(data);
        //io.emit("rcv_msg",data.user + ": " + data.msg);
        //conn.broadcast.emit("rcv_msg",data)
    })

    conn.on("disconnect", function (data){
        console.log("A user disconnected")
    })

})

app.use('/',express.static(__dirname+ "/public"));

server.listen(3456, function (){
    console.log('Server Started on port 3456');
})
