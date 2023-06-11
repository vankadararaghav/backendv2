import mongoose from "mongoose";
import user from "./user.js";
const taskSchema = mongoose.Schema(
    {
        user_id: {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: user,
                 },
        task :  String

    }
)

const task = new mongoose.model("task",taskSchema);

export default task;