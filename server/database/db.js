import mongoose from "mongoose";

const Connection =async (
  username = "chalsijain38",
  password = "7KrGzt6oRiiunD2b"
) => {
  const URL = `mongodb+srv://chalsijain38:${password}@documenteditor.nouonyi.mongodb.net/?retryWrites=true&w=majority`;
  try{
  await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connected')
  }catch(e){
    console.log('Error occured',e);
  }
};
export default Connection;
