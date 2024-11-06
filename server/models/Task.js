import { pool } from "../helpers/db.js";


const selectAllTasks = async () => {
    return pool.query('SELECT * FROM task');
}

const InsertTask = async (description) => {
    return pool.query('INSERT INTO task (description) VALUES ($1) returning *', [description]);
}

const DeleteTask = async (id) => {
    return pool.query('DELETE FROM task WHERE id = $1', [id]);
}

export { selectAllTasks, InsertTask, DeleteTask };