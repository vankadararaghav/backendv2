import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import User from "./models/user.js";
import cookieParser from "cookie-parser";
import MongoDBStore from 'connect-mongodb-session';
import Task from "./models/Task.js";
import cors from 'cors';

const app = express();

app.use(cors());

dotenv.config();
connectDB();

const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;





// Routes...





app.get("/",(req,res)=>{
   res.send("Hii I am working");
})

app.post("/login",(req,res)=>{
     

    var hashing = async () => {
          console.log("password  " + req.body.password);
          var new_user = {
              email : req.body.email,
              password : req.body.password
          };
        var data_found = await User.find(new_user);
        console.log(data_found);
        
        if(data_found.length!=0)
        {  
            console.log("data found" + data_found[0].email);
            var  data  = await Task.find({user_id: data_found[0]._id});
            return  res.send({
                        "status":true,
                        "message":"Successfully Login",
                        "id":data_found[0]._id
                        })
        }
        else{
          return res.send({
           "status": false,
           "message":"Email and password are not matching"
         })
        }
    }
    hashing();
})

app.post("/signup",(req ,res) => {

   let name = req.body.name;
   let email = req.body.email;
   // let hash = "";

   console.log("signup" + req.body.password);

   let hashing =  async () => {

      try{
       let newUser = new User({
         name,
         email,
         "password": req.body.password,
       });
      var response = await  newUser.save();
      return res.json({
          "message" : "Successfully created account"
      });
    }
    catch(error){
        return res.json({
           "status": false,
           "message": "You have already an account",
        })
    }
};  

hashing();
})

app.post("/addtask",(req,res)=>{

  console.log(req.headers.id);

  if(!req.headers.id)
  {
     return  res.json({
       "status" : false,
       "message": "Please Login"
    });
  }
    async function addTask(){
           var id = req.headers.id;
           var user = await User.findOne({_id:id});
           var task = {
                "user_id": user._id,
                "task":  req.body.task
           }
           var addedTask  =   await Task(task).save();
           res.send({
             "status": true,
             "data" : addedTask,
             "message": "stored successfully"
           })
         }
    addTask();
})

app.put("/editdata",(req,res)=>{

  console.log("hello");
console.log(req.headers.id);

  if(!req.headers.id)
  {
     return  res.json({
       "status" : false,
       "message": "Please Login"
    });
  }
  console.log("world")
  console.log(req.body);
  async function editData(){
       console.log(req.body);
       var id = req.headers.id;
       var user  = await  User.findOne({_id:id});
       console.log("user"+user);
       var _id = new mongoose.Types.ObjectId(req.body.id);
       console.log({user_id:user._id,_id});
       var result = await Task.findOneAndUpdate({user_id:user._id,_id},{task:req.body.task});

       console.log(result);
       var modified_data = await Task.find({user_id:user._id,_id:req.body.id});
       return  res.json({
           status : true,
           modified_data,
       }
       )
  }   
  editData();
});

app.delete("/removetask/:id",(req,res)=>{
  console.log(req.headers.id);

  if(!req.headers.id)
  {
     return  res.json({
       "status" : false,
       "message": "Please Login"
    });
  }

    async function RemoveTask(){
       console.log("executing remove task");
       let id = req.headers.id;
       let user = await User.findOne({_id:id});
       console.log("ID:",req.query,req.params);
       console.log({user_id:user._id,_id:req.params.id});
       var allTasks = await Task.find({});
       console.log("All TaSks")
       console.log(allTasks);
      const result  = await Task.deleteOne({_id:req.params.id});
       return res.json({
        "status": true,
        "message": "successfully deleted",
       });
    }

    RemoveTask();
  
});

app.delete("/removeall",(req,res)=>{
  console.log("remove all");
  console.log(req.headers.id);

  if(!req.headers.id)
  {
     return  res.json({
       "status" : false,
       "message": "Please Login"
    });
  }
  async function removeAll(){
        
       let user = await User.findOne({_id:req.headers.id}); 
       let result = await Task.deleteMany({user_id:user._id})
       console.log(result);
       return res.json({
        "status":true,
        "message": "Successfully deleted All",
       })
  }
  removeAll();
})

app.get("/getalltasks",(req,res)=>{

 
  console.log(req.headers.id);

  if(!req.headers.id)
  {
     return  res.json({
       "status" : false,
       "message": "Please Login"
    });
  }
    async function getAllData(){
      console.log("Started");

      let user = await User.findOne({_id:req.headers.id});
       
      let result = await Task.find({user_id:user._id});
      console.log(result);

      res.json({
         "status":true,
         "data": result,
      })
    }
    getAllData();
})

app.listen(port,"0.0.0.0",()=>{
    console.log(`[server] Server started @${port}`)
})

