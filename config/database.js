import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`[server] MongoDB Connection Establised: ` + conn.connection.host);
    } catch(err) {
        console.log(err);
    }
}
export default connectDB;