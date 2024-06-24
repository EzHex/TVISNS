import express from 'express';
import {
    createApartment,
    deleteApartment,
    getApartmentById,
    getApartments,
    NewApartment,
    updateApartment
} from "../db/schema/apartments";
import JwtTokenService from "../auth/JwtTokenService";
import {createContract, NewContract} from "../db/schema/contract";

const jwtTokenService = new JwtTokenService();

const emptyContract: NewContract = {
    address: "",
    apartmentId: 0,
    area: 0,
    city: "",
    endDate: new Date().toISOString().split('T')[0],
    ownerFullName: "",
    payRentBeforeDay: 25,
    payUtilityBeforeDay: 25,
    rent: 0,
    tenant: "",
    tenantId: -1,
    todayDate: new Date().toISOString().split('T')[0]
}

export const GetAllApartments = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartments = await getApartments(id);

    res.status(200).json(apartments);
}

export const CreateApartment = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartment : NewApartment = req.body;
    apartment.ownerId = id;

    const newApartment = await createApartment(apartment);

    if (!newApartment){
        return res.status(400).json({error: "Failed to add apartment"});
    }

    await createContract({
        ...emptyContract,
        apartmentId: newApartment[0].id,
        area: newApartment[0].area,
        address: `${newApartment[0].street} ${newApartment[0].houseNumber}, ${newApartment[0].residence}`,
        city: newApartment[0].residence,
    })

    res.status(201).json(newApartment[0]);
}

export const UpdateApartment = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const newApartment : NewApartment = req.body;
    const apartment = (await getApartmentById(parseInt(req.params.id)))[0];

    if (!apartment){
        return res.status(404).json({error: "Apartment not found"});
    }

    if (apartment.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    const updatedApartment = await updateApartment(parseInt(req.params.id), newApartment);

    res.status(200).json(updatedApartment[0]);
}

export const DeleteApartment = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartmentId = parseInt(req.params.id);
    const apartment = (await getApartmentById(apartmentId))[0];
    if (apartment.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    await deleteApartment(apartmentId);

    res.status(204).json({message: "Apartment removed successfully"});
}

export const GenerateAdText = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartmentId = parseInt(req.params.apartmentId);
    const apartment = (await getApartmentById(apartmentId))[0];
    if (apartment.ownerId !== id) {
        return res.status(403).json({error: "Forbidden"});
    }

    const adText : string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut lacinia turpis, ut fringilla leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce eget lacus at nibh pulvinar interdum id ut enim. Cras luctus semper massa, non maximus tortor faucibus a. Aliquam sollicitudin viverra erat at mollis. Aenean sit amet consequat lectus. Nullam quis sodales ligula, eu dapibus magna. `;

    var textBuilder : string[] = [];
    textBuilder.push("");


    res.status(200).json({adText});
}

const basicObjects : string[] = ["Table", "Chair", "Sofa", "Bed", "Cupboard", "Wardrobe", "Desk", "TV", "Other"];