import asyncHandler from 'express-async-handler';
import TaskModel from '../../models/Task/TaskModel.js';

export const createTask = asyncHandler(async (req, res) => {
 try {
  const { title, description, dueDate, status, priority } = req.body;
  if (!title || title.trim() === "") {
    res.status(400).json({ message : "Title is required" });
  }
  if(!description || description.trim() === ""){
    res.status(400).json({ message : "Description is required" });
  }
  const task = new TaskModel ({
    title,
    description,
    dueDate,
    status,
    priority,
    user: req.user._id, // Assuming req.user is populated by the protect middleware
  });
  await task.save(); 
  res.status(201).json({
    message: "Task created successfully",
    task,
  });

 } catch (error) {
  console.error("Error creating task:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
  
 }
});

export const getTasks = asyncHandler(async (req, res) => {

  try {
    const userId = req.user._id; // Assuming req.user is populated by the protect middleware

    if(!userId) {
      return res.status(400).json({ message: "User not found" });
    }
    const tasks = await TaskModel.find({ user: userId }); 

    res.status(200).json({
      message: "Tasks retrieved successfully",
      length: tasks.length,
      tasks,
    });
    
  } catch (error) {
     console.error("Error creating task:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
    
  }
});


export const getTask = asyncHandler(async (req, res) => {

  try {
    const userId = req.user._id; // Assuming req.user is populated by the protect middleware
    const {id} = req.params; // Assuming the task ID is passed as a URL parameter

    if (!id)  {
    res.status(400).json({ message: "please provide task id" });
    }
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if(!task.user.equals(userId)) {
      return res.status(401).json({ message: "You are not authorized to view this task" });
    }
    res.status(200).json(task);

  } catch (error) {
      console.error("Error creating task:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
    
  }
})

export const updateTask = asyncHandler(async (req, res) => {
 try {
  
  const userId = req.user._id; 
  const { id } = req.params; // Assuming the task ID is passed as a URL parameter

  const { title, description, dueDate, status, priority ,completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please provide task id" });
  }
  const task = await TaskModel.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  //check if the task belongs to the user
  if (!task.user.equals(userId)) {
    return res.status(401).json({ message: "You are not authorized to update this task" });
  }
  //update the task
  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.status = status || task.status;
  task.priority = priority || task.priority;
  task.completed = completed !== undefined ? completed : task.completed; // Assuming completed is a boolean field

  await task.save();

  res.status(200).json({
    message: "Task updated successfully",
    task,
  });

 } catch (error) {

   console.error("Error creating task:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
  
 }
});


export const deleteTask = asyncHandler(async (req, res) => {
  try {
     const userId = req.user._id; 
     const { id } = req.params;

     const task = await TaskModel.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      //check if the task belongs to the user
      if (!task.user.equals(userId)) {
        return res.status(401).json({ message: "You are not authorized to delete this task" });
      }
      await TaskModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Task deleted successfully" });
    
  } catch (error) {
      console.error("Error creating task:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
    
  }});