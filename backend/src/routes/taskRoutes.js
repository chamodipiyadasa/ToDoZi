import express from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/task/create',protect, createTask);

router.get('/tasks', protect, getTasks);

router.get('/task/:id',protect, getTask );

router.put('/task/:id', protect, updateTask);

router.delete('/task/:id', protect, deleteTask);

export default router;