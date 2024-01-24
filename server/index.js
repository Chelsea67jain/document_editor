//const server=require('socket.io'); This code is used in ES5 but we can use the below code in ES6
import { Server } from "socket.io";
import Connection from "./database/db.js";
import { getDocument,updateDocument } from "./controller/document_controller.js";

Connection();
const PORT=9000;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection',socket=>{
  socket.on('get-document',async documentId=>{
    const data=""
    var document=await getDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document',document.data);
  socket.on('send-changes',delta=>{
    socket.broadcast.to(documentId).emit('receive-changes',delta);
  })
  socket.on('save-changes',async data=>{
    return updateDocument(documentId,data)
  })

})
})



