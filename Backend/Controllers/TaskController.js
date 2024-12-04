import cron from 'node-cron';
import {Task} from '../Models/taskModel.js'
import {sendEmail} from '../Config/SendMail.js'
import {scheduleTask} from '../Config/cronConfig.js'
import { v4 as uuidv4 } from 'uuid';


let tasks = [];
export const CreateTask = async (req, res) => {
    try {
         const { name, schedule, email, message,expiration } = req.body;
        console.log("req body is ",req.body)
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All the mandetory fields are required.' });
        }
        const taskId=uuidv4();
        console.log("generated taskid ",taskId)
        // Add task to in-memory tasks array (optional: save to DB instead)
        tasks.push({ name, schedule, email, message });
        const task = new Task({
           taskId,
            name,
            schedule,
            email,
            message,          
            expiration:""
        });
        await task.save();    
        scheduleTask(task);
        console.log("task created sucessfully ")
        res.status(201).json({ message: 'Task created and scheduled successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const editTask = async (req, res) => {
    try {
      const { uuid, name, schedule, email, message } = req.body;
  
      // Find the task by UUID
      const task = await Task.findOne({ uuid });
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }
  
      // Update task details
      task.name = name || task.name;
      task.schedule = schedule || task.schedule;
      task.email = email || task.email;
      task.message = message || task.message;
      
      await task.save(); // Save updated task
  
      res.status(200).json({ message: 'Task updated successfully.' });
    } catch (error) {
      console.error('Error editing task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  export const deleteTask = async (req, res) => {
    try {
      const { uuid } = req.body;
      const task = await Task.findOneAndDelete({ uuid });
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }
  
      // Optionally, delete associated logs (if needed)
      await TaskLog.deleteMany({ taskId: task._id });
  
      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
   

  export const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTaskById = () => {
    console.log('Cron job executed at:', new Date().toLocaleString());
    }

 export const stopTask = async (req, res) => {
        try {
          const { uuid } = req.body;
          const task = await Task.findOne({ uuid });
          if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
          }
          // Update task status to "stopped"
          task.status = 'stopped';
          await task.save();
      
          res.status(200).json({ message: 'Task stopped successfully.' });
        } catch (error) {
          console.error('Error stopping task:', error);
          res.status(500).json({ message: 'Server error' });
        }
      };
      



 export const startTask = async (req, res) => {
        try {
          const { uuid } = req.body;
          const task = await Task.findOne({ uuid });
          if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
          }
          // Update task status to "stopped"
          task.status = 'active';
          await task.save();
      
          res.status(200).json({ message: 'Task Activated successfully.' });
        } catch (error) {
          console.error('Error stopping task:', error);
          res.status(500).json({ message: 'Server error' });
        }
      };
      