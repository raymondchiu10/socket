const port = process.env.PORT || 10000;
const server = require("http").Server();


var io = require("socket.io")(server);

// var allUsers = [];
//var allusers1 = [];
//var allusers2 = [];

var allusers = {};
var allstickers = {};

io.on("connection", function(socket){
    console.log("Connected");
//    allUsers.push(socket.id);
//    console.log(allUsers);
    
//    socket.emit("yourid", socket.id);
//    
//    io.emit("userjoined", allUsers);
    
    socket.on("stick", function(data) {
        allstickers[this.myRoom].push(data);
        
        io.to(this.myRoom).emit("newsticker", allstickers[this.myRoom]);
    });
    
    socket.on("joinroom", function(data){
        console.log(data);
        socket.join(data);
        
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if (!allusers[data]) {
            allusers[data] = [];
        }
        
        if (!allstickers[data]) {
            allstickers[data] = [];
        }
        
        allusers[data].push(socket.id);
        io.to(data).emit("userjoined", allusers[data]);
        io.to(data).emit("newsticker", allstickers[data]);
    });
    
    socket.on("mymove", function(data){
//        socket.broadcast.emit("newmove", data);
        socket.to(this.myRoom).emit("newmove", data);
    });
    
    socket.on("disconnect", function(){
//        var index = allUsers.indexOf(socket.id);
//        allUsers.splice(index, 1);
//        io.emit("userjoined", allUsers);
        if (this.myRoom){
            var index = allusers[this.myRoom].indexOf(socket.id);
            allusers[this.myRoom].splice(index, 1);
            io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
            
        }
        
    });
});

server.listen(port, (err)=>{
    if (err){
        return false;
    }
    
    console.log("Port is running");
})