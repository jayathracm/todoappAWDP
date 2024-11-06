import { pool } from "../helpers/db.js";
import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const { sign } = jwt;

const router = Router();


router.post("/register", async (req, res, next) => {
    hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) {
            return next(error);
        }
        try {
            pool.query(
                "INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *",
                [req.body.email, hashedPassword],
                (error, result) => {
                    if (error) {
                        return next(error);
                    }
                    res.status(201).json({ id: result.rows[0].id, email: result.rows[0].email });

                }
            );
        } catch (error) {
            return next(error);
        }
    });
});

router.post("/login", (req, res, next) => {
    const invalid_message = "Invalid Credentials";

    try {
        pool.query(
            "SELECT * FROM account WHERE email = $1",
            [req.body.email],
            (error, result) => {
                console.log(req.body.email)
                if (error) {
                    return next(error);
                }
                if (result.rowCount === 0) return next(new Error(invalid_message));

                const user = result.rows[0];

                compare(req.body.password, user.password, (error, match) => {
                    if (error) {
                        return next(error);
                    }
                    if (!match) return next(new Error(invalid_message));

                    const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY, {
                        expiresIn: "1h"
                    });
                    res.status(200).json(
                        { 
                            'id': user.id,
                            'email': user.email,
                            'token': token
                        }
                    );
                });
            }
        );
    } catch (error) {
        return next(error);
    }
});


export default router;