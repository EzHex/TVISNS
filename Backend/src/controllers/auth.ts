import express from "express";
import {User, createUser, getUserByEmail, NewUser, getUserById} from "../db/schema/users";
import JwtTokenService from "../auth/JwtTokenService";
import {Roles} from "../db/schema/roles";
import bcrypt from 'bcryptjs';

interface IToken {
    refreshToken: string;
}

interface LoginUser {
    email : string;
    password : string;
}

export const Register = async (req: express.Request, res: express.Response) => {
    const user : NewUser = req.body;
    user.role = Roles.Owner;

    // Check if email already exists
    const isEmailAlreadyExist = await getUserByEmail(user.email!);

    if (isEmailAlreadyExist.length != 0) {
        return res.status(400).json({error: "Email already exists"});
    }

    user.password = bcrypt.hashSync(user.password!, 10);
    await createUser(user);
    res.status(201).json({message: "User created successfully"});
};

export const Login = async (req: express.Request, res: express.Response) => {
    const user : LoginUser = req.body;

    // Check if email exists
    const userFromDb = (await getUserByEmail(user.email!))[0];

    if (!userFromDb) {
        return res.status(400).json({error: "Invalid email or password"});
    }

    if (userFromDb.blocked) {
        return res.status(400).json({error: "User is blocked"});
    }

    if (!bcrypt.compareSync(user.password, userFromDb.password)) {
        return res.status(400).json({error: "Invalid email or password"});
    }

    const jwtTokenService = new JwtTokenService();
    const accessToken = jwtTokenService.CreateAccessToken(userFromDb.fullName, userFromDb.id, userFromDb.role);
    const refreshToken = jwtTokenService.CreateRefreshToken(userFromDb.id);

    res.status(200).json({
        "accessToken": accessToken,
        "refreshToken": refreshToken,
        "role": userFromDb.role
    });
};

export const AccessToken = async (req: express.Request, res: express.Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error: "Unauthorized"});
    }

    const token = authHeader.split(' ')[1];

    const jwtTokenService : JwtTokenService = new JwtTokenService();
    if (!jwtTokenService.TryParseRefreshToken(token)) {
        return res.status(400).json({error: "Invalid refresh token"});
    }

    const userId = jwtTokenService.GetUserIdFromRefreshToken(token);
    if (!userId) {
        return res.status(400).json({error: "Unauthorized"});
    }

    const user : User = (await getUserById(userId))[0];
    const accessToken = jwtTokenService.CreateAccessToken(user.fullName, user.id, user.role);
    const refreshToken = jwtTokenService.CreateRefreshToken(user.id);

    res.status(200).json({
        "accessToken": accessToken,
        "refreshToken": refreshToken,
        "role": user.role
    });
};