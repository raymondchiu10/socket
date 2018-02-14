const port = process.env.PORT || 10000;
const server = require("http").Server();


var io = require("socket.io")(server);

// var allUsers = [];
//var allusers1 = [];
//var allusers2 = [];

var allusers = {};

io.on("connection", function(socket){
    console.log("Connected");
//    allUsers.push(socket.id);
//    console.log(allUsers);
    
//    socket.emit("yourid", socket.id);
//    
//    io.emit("userjoined", allUsers);
    
    socket.on("joinroom", function(data){
        console.log(data);
        socket.join(data);
        
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if (!allusers[data]) {
            allusers[data] = [];
        }
        allusers[data].push(socket.id);
        io.to(data).emit("userjoined", allusers[data]);
    });
    
    socket.on("mymove", function(data){
//        socket.broadcast.emit("newmove", data);
        socket.to(this.myRoom).emit("newmove", data);
    });
    
    socket.on("disconnect", function(){
//        var index = allUsers.indexOf(socket.id);
//        allUsers.splice(index, 1);
//        io.emit("userjoined", allUsers);
        
        var index = allusers[this.myRoom].indexOf(socket.id);
        allusers[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
        
    });
});

server.listen(port, (err)=>{
    if (err){
        return false;
    }
    
    console.log("Port is running");
})