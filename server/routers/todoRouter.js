import { Router } from 'express';
import { getTasks, postTask, DeleteTask } from '../controllers/TaskController.js';

const router = Router();

router.get('/', getTasks);


router.post('/create', postTask);


router.delete('/delete/:id', DeleteTask);


export default router;