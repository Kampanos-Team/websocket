import express from "express"
import socketio from "socket.io"
import http from "http"
import cors from "cors"

const app = express()
app.use(cors())

const httpServer = http.createServer(app)
const io = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`new connection ${socket.id}`)

  socket.on("join room", (roomName:string, callback:any) => {
    socket.join(roomName)
    callback(roomName)
    console.log(roomName)
  })

  socket.on("send data", ({content, roomName}) => {
    const payload = {       
      content,
      roomName,
    }
    io.to(roomName).emit("new data", payload)
    console.log(payload)
    
  })

  socket.on("disconnect",() =>{
    console.log("disconnected")
  })

})

httpServer.listen(3333,  () => console.log("server started at http://localhost:3333"))