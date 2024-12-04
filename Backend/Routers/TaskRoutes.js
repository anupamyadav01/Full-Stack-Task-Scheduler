import express from "express";
import { CreateTask, editTask, deleteTask, getAllTask, getTaskById, stopTask,startTask} from "../Controllers/TaskController.js";

const router =express.Router();
console.log('server running till here ')

router.post("/createTask", CreateTask);
router.put("/editTask", editTask);
router.post("/deleteTask", deleteTask);
router.get("/getAllTasks", getAllTask);
router.get("/getTaskById", getTaskById);
router.post("/stopTask", stopTask);
router.post("/startTask", startTask);
export default router;