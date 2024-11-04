import { hash, compare } from 'bcrypt';
import { insertUser, selectUserByEmail, createUserObject } from "../models/user.js";
import { ApiError } from '../helpers/Apierror.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;


const postRegistration = async (req, res, next) => {
   
    try{
        if(!req.body.email || req.body.email.length === 0) 
            return next(new ApiError(400, 'invalid email for user'));


        if(!req.body.password || req.body.password.length < 8) 
            return next(new ApiError(400, 'Password must be at least 8 characters long'));
        
        const userFromDb = await insertUser(req.body.email, hash(req.body.password, 10));
        const user = userFromDb.rows[0];
        return res.status(201).json(createUserObject(user.id, user.email ));
    }
    catch (error) {
        next(error);
    }
    
}

const postLogin = async (req, res, next) => {
    const invalid_cedential_message = "Invalid Credentials";
    try{
        const userFromDb = await selectUserByEmail(req.body.email);
        if(userFromDb.rows.length === 0) return next(new ApiError(invalid_cedential_message ));

        const user = userFromDb.rows[0];
        if(!await compare(req.body.password, user.password)) return next(new ApiError(invalid_cedential_message, 401 ));

    const token = sign(req.body.email, process.env.JWT_SECRET_KEY);
    return res.status(200).json(createUserObject(user.id, user.email, token));
    }
    catch (error) {
        next(error);
    }
}


export { postRegistration, postLogin };