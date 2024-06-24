import express from "express";
import {createRoom, deleteRoom, getRoomById, getRooms, NewRoom, Room, updateRoom} from "../db/schema/rooms";
import JwtTokenService from "../auth/JwtTokenService";

const jwtTokenService = new JwtTokenService();

export const GetAllRooms = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartmentId = req.params.apartmentId;

    const rooms = await getRooms(parseInt(apartmentId));

    res.status(200).json(rooms);
}

export const CreateRoom = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const room : NewRoom = req.body;
    room.ownerId = id;
    room.apartmentId = parseInt(req.params.apartmentId);

    const createdRoom = await createRoom(room);

    if (!createdRoom){
        return res.status(400).json({error: "Failed to add room"});
    }

    res.status(201).json(createdRoom[0]);
}

export const UpdateRoom = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const newRoom : NewRoom = req.body;
    const room = (await getRoomById(parseInt(req.params.id)))[0];

    if (room.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    const updatedRoom = await updateRoom(parseInt(req.params.id), newRoom);

    res.status(200).json(updatedRoom[0]);
}

export const DeleteRoom = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const room = (await getRoomById(parseInt(req.params.id)))[0];

    if (room.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    await deleteRoom(parseInt(req.params.id));

    res.status(204).json({message: "Room removed successfully"});
}