import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import { sign } from 'crypto';

const _dirname = import.meta.dirname

const initializeTestDb = async () => {

    const sql = fs.readFileSync(path.resolve(_dirname, "../todo.sql"), "utf-8");
        pool.query(sql)
    }
    
    const insertTestUser = (email, password) => {
        hash(password, 10,  (error, hashedpassword) => {
            pool.query('INSERT INTO account (email, password) values ($1, $2)',
                [email, hashedpassword])
        })
    }      
    const getToken = async (email) => {
        return sign({user: email}, process.env.JWT_SECRET_KEY);
    }
    
    export {initializeTestDb, insertTestUser, getToken};