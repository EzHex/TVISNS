import express from "express";
import JwtTokenService from "../auth/JwtTokenService";
import {createUtilityCounter, deleteUtilityCounter, getUtilityCounters} from "../db/schema/utilityCounters";
import {createReading, deleteReading, getReadings} from "../db/schema/readings";

const jwtTokenService = new JwtTokenService();

export const GetCounters = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const counters = await getUtilityCounters(parseInt(req.params.apartmentId));

    return res.status(200).json(counters);
}

export const CreateCounter = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const counter = req.body;
    counter.apartmentId = parseInt(req.params.apartmentId);

    const newCounter = await createUtilityCounter(counter);

    if (!newCounter)
        return res.status(400).json({error: "Failed to create counter"});

    return res.status(201).json(newCounter[0]);
}

export const DeleteCounter = async (req: express.Request, res: express.Response) => {
    const userId = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(userId) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const id = parseInt(req.params.counterId);
    await deleteUtilityCounter(id);

    return res.status(204).json({message: "Counter deleted successfully"});
}

export const GetReadings = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const readings = await getReadings(parseInt(req.params.counterId));

    return res.status(200).json(readings.sort((a, b) => a.id > b.id ? -1 : 1));
}

export const CreateReading = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const reading = req.body;
    const newReading = await createReading(reading);

    if (!newReading)
        return res.status(400).json({error: "Failed to create reading"});

    return res.status(201).json({
        id: newReading[0].id,
        date: newReading[0].date,
        value: newReading[0].value,
    });
}

export const DeleteReading = async (req: express.Request, res: express.Response) => {
    const userId = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(userId) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const id = parseInt(req.params.id);
    await deleteReading(id);

    return res.status(204).json({message: "Reading deleted successfully"});
}