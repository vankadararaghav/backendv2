import mongoose from "mongoose";

const userSchema = mongoose.Schema({
     name : String,
     email : {
         type:String,
         unique:true,
     },
     password : String,
})

const user = new mongoose.model("user",userSchema);

export default user;