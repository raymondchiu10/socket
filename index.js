const port = process.env.PORT || 10000;
const server = require("http").Server();


var io = require("socket.io")(server);

var allUsers = [];

io.on("connection", function(socket){
    console.log("Connected");
    allUsers.push(socket.id);
    console.log(allUsers);
    
    socket.emit("yourid", socket.id);
    
    io.emit("userjoined", allUsers);
    
    socket.on("mymove", function(data){
        socket.broadcast.emit("newmove", data);
})
    
    socket.on("disconnect", function(){
        var index = allUsers.indexOf(socket.id);
        allUsers.splice(index, 1);
        io.emit("userjoined", allUsers);
    })
});

server.listen(port, (err)=>{
    if (err){
        return false;
    }
    
    console.log("Port is running");
})