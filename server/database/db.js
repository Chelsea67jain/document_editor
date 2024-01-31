import mongoose from "mongoose";
import colors from 'colors';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.MONGO_URL;

const connectDB=async()=>{
try{
  var conn=await mongoose.connect(URI,{
useNewUrlParser:true,
useUnifiedTopology:true
  })
  console.log(`Mongodb connected:${conn.connection.host}`.yellow.bold)

}catch(error){
  console.log(`Error:${error.message}`.red.bold)
  process.exit();
}
}
export default connectDB;
