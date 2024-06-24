import jwt from 'jsonwebtoken'
import express from "express";
import "dotenv/config";
import {User} from "../db/schema/users";

export const Authorize = (expectedRoles : string[]) => (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({error: 'Not authenticated.'});
    }

    const token = authHeader!.split(' ')[1];
    if (!token) {
        return res.status(403).json({error: 'Not authenticated.'});
    }

    let decodedToken : User;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as User;
        if (!decodedToken) {
            return res.status(403).json({error: 'Not authenticated.'});
        }

        if (!expectedRoles.includes(decodedToken.role)) {
            return res.status(403).json({error: 'Not authorised.'});
        }

        next();
    } catch (error) {
        return res.status(403).json({error: 'Not authenticated.'});
    }
}