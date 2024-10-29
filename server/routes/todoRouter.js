import express from 'express';
import { pool } from '../helpers/db.js';
import { emptyOrRows } from '../helpers/utils.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json(emptyOrRows(result));
    });
});

router.post('/create', (req, res, next) => {
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *',
        [req.body.description],
        (error, result) => {
            if (error) {
                return next(error);
            }
            return res.status(200).json(emptyOrRows(result));
        }
    );
});

router.delete('/delete/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM task WHERE id = $1',
        [id],
        (error, result) => {
            if (error) {
                return next(error);
            }
            return res.status(200).json(emptyOrRows(result));
        }
    );
});

export default router;
