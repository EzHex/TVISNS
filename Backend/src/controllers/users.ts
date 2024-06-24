import express from 'express';
import {
    createUser,
    deleteUser,
    getUserByEmail,
    getUserById,
    getUsers,
    NewUser,
    updateUser,
    User
} from '../db/schema/users';
import {Roles} from "../db/schema/roles";
import { faker } from '@faker-js/faker';
import {getApartmentById, updateApartment} from "../db/schema/apartments";
import bcrypt from "bcryptjs";
import JwtTokenService from "../auth/JwtTokenService";
import {CreateContract} from "./contract";
import {deleteContract} from "../db/schema/contract";

const jwtTokenService = new JwtTokenService();

export const GetAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users.filter(user => user.role !== Roles.Admin));
    } catch (e) {
        return res.status(400).json({error: e});
    }
}

export const CreateTenant = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const user : NewUser = req.body;

    if (!user.email) {
        return res.status(400).json({error: "Email is required"});
    }

    const isEmailAlreadyExist = await getUserByEmail(user.email!);

    if (isEmailAlreadyExist.length > 0) {
        return res.status(400).json({error: "Email already exists"});
    }

    user.role = Roles.Tenant;
    const openPassword = faker.internet.password({length: 12, memorable: true});
    user.password = bcrypt.hashSync(openPassword, 10);

    const createdUser = await createUser(user);

    if(!createdUser) {
        return res.status(400).json({error: "Failed to create user"});
    }

    let apartment = (await getApartmentById(parseInt(req.params.apartmentId)))[0];
    apartment.tenantId = createdUser[0].id;
    await updateApartment(parseInt(req.params.apartmentId), apartment);
    await CreateContract(parseInt(req.params.apartmentId));

    return res.status(201).json({
        id: createdUser[0].id,
        email: createdUser[0].email,
        password: openPassword
    });
}

export const DeleteTenant = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    let apartment = (await getApartmentById(parseInt(req.params.apartmentId)))[0];
    await deleteContract(apartment.tenantId!);
    await deleteUser(apartment.tenantId!);

    return res.status(204).json();
}

export const UpdateUser = async (req: express.Request, res: express.Response) => {
    const user : User = req.body;
    const id : number = parseInt(req.params.id);

    try {
        await updateUser(id, user);
        return res.status(200).json({message: "User updated successfully"});
    }
    catch (e) {
        return res.status(400).json({error: e});
    }

}

export const BlockUser = async (req: express.Request, res: express.Response) => {
    const id : number = parseInt(req.params.id);
    const user : User = (await getUserById(id))[0];

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    if (user.role === Roles.Admin) {
        return res.status(400).json({error: "Admin cannot be blocked"});
    }

    user.blocked = true;
    try {
        await updateUser(id, user);
        return res.status(200).json({message: "User blocked successfully"});
    }
    catch (e) {
        return res.status(400).json({error: e});
    }
}

export const UnblockUser = async (req: express.Request, res: express.Response) => {
    const id : number = parseInt(req.params.id);
    const user : User = (await getUserById(id))[0];

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    if (user.role === Roles.Admin) {
        return res.status(400).json({error: "Admin cannot be blocked"});
    }

    user.blocked = false;
    try {
        await updateUser(id, user);
        res.status(200).json({message: "User unblocked successfully"});
    }
    catch (e) {
        res.status(400).json({error: e});
    }
}