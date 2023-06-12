import mongoose from "mongoose";
import user from "./user.js";
const taskSchema = mongoose.Schema(
    {
        user_id: {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: user,
                 },
        task :  String,
        isDone: Boolean,
    }
)

const taskNewVersion = new mongoose.model("task",taskSchema);
export default taskNewVersion;