const port = process.env.PORT || 10000;
const server = require("http").Server();

var io = require("socket.io")(server);

var allqs = {};

io.on("connection", function(socket){
    
    socket.on("joinroom", function(data){
        console.log("Joining room", data);
        
        socket.join(data);
        socket.myRoom = data;
        
        if (!allqs[data]){
            allqs[data] = {
                qobj: {}
            };
        }
        
    });
    
    socket.on("answer", function(data){
       if (data == allqs[socket.myRoom].qobj.a) {
           var msg = "WRONG!";
           if(data == allqs[socket.myRoom].qobj.a){
               msg = "You've won at life!";
           }
           socket.emit("result", msg);
       }
    });
    
    socket.on("qsubmit", function(data){
        allqs[socket.myRoom].qobj = data;
       socket.to(socket.myRoom).emit("newq", data); 
    });

    socket.on("disconnect", function(){

    });
});

server.listen(port, (err)=>{
    if (err){
        return false;
    }
    
    console.log("Port is running");
})