import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  dueDate:{
    type: Date,
    default:Date.now,
  },
  status: {
    type: String,
    enum: ["active" , "inactive"],
    default: "active",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
  
}, { timestamps: true });

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
