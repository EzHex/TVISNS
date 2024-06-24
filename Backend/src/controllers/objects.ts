import {createObject, deleteObject, getObjectById, getObjects, updateObject} from "../db/schema/objects"
import path from "path";
import express from "express";
import JwtTokenService from "../auth/JwtTokenService";
import fileUpload from "express-fileupload";
import {getTenantApartment} from "../db/schema/apartments";
import {getRooms} from "../db/schema/rooms";
import {
    createFailure,
    getFailure,
    getFailures,
    getTenantFailures,
    NewFailure,
    updateFailure
} from "../db/schema/failures";
import {fail} from "node:assert";

const jwtTokenService = new JwtTokenService();

interface ISmallRoom {
    roomName: string;
    objects: ISmallObject[];
}

interface ISmallObject {
    id: number,
    title: string,
}


export const GetAllObjects = async (req: express.Request, res: express.Response) => {
    const id = req.params.roomId;

    const objects = await getObjects(parseInt(id));

    return res.status(200).json(objects);
}

export const GetObject = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const object = (await getObjectById(parseInt(req.params.objectId)))[0];

    if (object.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    return res.status(200).json(object);
}

export const GetObjectImage = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const object = (await getObjectById(parseInt(req.params.id)))[0];

    if (object.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    if (object.image.startsWith("https://"))
    {
        return res.sendFile(object.image);
    }

    return res.sendFile(path.resolve(object.image));
}

export const CreateObject = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    // save files to disk
    if (req.files) {
        const image = req.files.image as fileUpload.UploadedFile;
        const myPath = `${__dirname}/../../public/images/${new Date().getTime()}${path.extname(image.name)}`;

        image.mv(myPath, async (err: any) => {
            if (err) {
                return res.status(422).json({error: "Error uploading image"});
            }

            const object = req.body;
            object.ownerId = id;
            object.image = myPath;

            const newObj = await createObject(object);

            if (!newObj) {
                return res.status(400).json({error: "Failed to add object"});
            }

            return res.status(201).json(newObj[0]);
        });
        return;
    }

    const object = req.body;
    object.ownerId = id;
    object.image = "";

    const newObj = await createObject(object);

    if (!newObj) {
        return res.status(400).json({error: "Failed to add object"});
    }

    return res.status(201).json(newObj[0]);
}

export const UpdateObject = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    if (req.files) {
        const image = req.files.image as fileUpload.UploadedFile;
        const myPath = `${__dirname}/../../public/images/${new Date().getTime()}${path.extname(image.name)}`;

        image.mv(myPath, async (err: any) => {
            if (err) {
                return res.status(422).json({error: "Error uploading image"});
            }

            const newObject = req.body;
            newObject.image = myPath;
            const object = (await getObjectById(parseInt(req.params.id)))[0];

            if (object.ownerId !== id) {
                return res.status(403).json({error: "Forbidden"});
            }

            await updateObject(parseInt(req.params.id), newObject);
            return res.status(200).json({message: "Object updated successfully"});
        });
        return;
    }

    const newObject = req.body;
    const object = (await getObjectById(parseInt(req.params.id)))[0];

    if (object.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    newObject.image = object.image;
    await updateObject(parseInt(req.params.id), newObject);

    return res.status(200).json({message: "Object updated successfully"});
}

export const DeleteObject = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const object = (await getObjectById(parseInt(req.params.id)))[0];

    if (object.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    await deleteObject(parseInt(req.params.id));

    res.status(204).json();
}

export const GetAllTenantRooms = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartment = (await getTenantApartment(id))[0];
    const rooms = await getRooms(apartment.id);

    return res.status(200).json(rooms);
}

export const GetAllTenantObjects = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const objects = await getObjects(parseInt(req.params.roomId));
    const modifiedObjects = objects.map(object => ({
        id: object.id,
        title: object.title
    }));
    return res.status(200).json(modifiedObjects);
}

export const CreateFailure = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const failure: NewFailure = req.body;
    failure.tenantId = id;
    failure.apartmentId = (await getTenantApartment(id))[0].id;

    await createFailure(failure);

    return res.status(201).json();
}

export const GetTenantFailures = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const failures = await getTenantFailures(id);

    return res.status(200).json(failures);
}

export const GetAllApartmentFailures = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const failures = await getFailures(parseInt(req.params.apartmentId));

    return res.status(200).json(failures);
}

export const UpdateFailure = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    if (req.body.failureState !== "IN_PROGRESS" && req.body.failureState !== "DONE")
        return res.status(422).json({error: "Invalid failure state"});

    const failure = await getFailure(parseInt(req.params.id));
    failure[0].failureState = req.body.failureState;

    await updateFailure(parseInt(req.params.id), failure[0]);

    return res.status(200).json();
}