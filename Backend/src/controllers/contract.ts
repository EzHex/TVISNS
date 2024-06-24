import express from "express";
import JwtTokenService from "../auth/JwtTokenService";
import {createContract, getContract, updateContract} from "../db/schema/contract";
import {NewContract} from "../db/schema/contract";
import {getApartmentById} from "../db/schema/apartments";

const jwtTokenService = new JwtTokenService();

export const GetContract = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartmentId = parseInt(req.params.apartmentId);
    const contract = (await getContract(apartmentId))[0];

    res.status(200).json(contract);
}


export const CreateContract = async (apartmentId: number) => {
    const apartment = (await getApartmentById(apartmentId))[0];

    const contract: NewContract = {
        todayDate: new Date().toISOString().split('T')[0],
        ownerFullName: "",
        tenant: "",
        area: apartment.area,
        address: `${apartment.street}, ${apartment.houseNumber}`,
        city: `${apartment.residence}`,
        rent: 0,
        endDate: new Date().toISOString().split('T')[0],
        payRentBeforeDay: 0,
        payUtilityBeforeDay: 0,
        apartmentId: apartmentId,
        tenantId: apartment.tenantId!
    };

    await createContract(contract);
}

export const UpdateContract = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const apartmentId = parseInt(req.params.apartmentId);
    const apartment = (await getApartmentById(apartmentId))[0];
    const contract = (await getContract(apartmentId))[0];
    const newContract: NewContract = req.body;
    newContract.apartmentId = apartmentId;
    newContract.tenantId = apartment.tenantId!;
    await updateContract(contract.id, newContract);

    res.status(200).json({message: "Contract updated"});
}