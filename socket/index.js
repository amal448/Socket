
const io=require("socket.io")(8800,{
    cors:{
        origin:["http://localhost:5173"],
    }
});

let users=[];

const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId ===userId) &&
    users.push({userId,socketId})
}

io.on("connection",(socket)=>{
    console.log("a user connected.")
    // io.emit("welcome","hello this is socket server !")
    socket.on("addUser",(userId)=>{
        console.log("socket.id,",socket.id)
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    }) 

        //sender
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log("senderId",senderId)
        console.log("receiverId",receiverId)
        console.log("text",text)

        const user=getUser(receiverId)

        if (user && user.socketId) {

        io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
    
        })
    }
    })
//    disconnect 
    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
    })
})

const getUser =(userId)=>{
    console.log("userId",userId)
    return users.find((user) =>user.userId ===userId) 
}




const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId !==socketId)
}



