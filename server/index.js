//const server=require('socket.io'); This code is used in ES5 but we can use the below code in ES6
import { Server } from "socket.io";
import connectDB from  './database/db.js'
import { getDocument,updateDocument } from  "./controller/document_controller.js";
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const app=express();

connectDB();
dotenv.config();
app.use(cors());

const PORT=process.env.PORT
console.log(`Server connected to port:${PORT}`.yellow.bold)

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
// Deployement

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log('Dirname:',__dirname);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}



