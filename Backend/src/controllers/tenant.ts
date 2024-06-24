import express from "express";
import JwtTokenService from "../auth/JwtTokenService";
import {getTenantApartmentPayments} from "../db/schema/apartmentPayments";
import {getTenantApartment} from "../db/schema/apartments";
import {getUtilityCounters} from "../db/schema/utilityCounters";

const jwtTokenService = new JwtTokenService();

export const GetTenantData = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});


    const apartment = (await getTenantApartment(id))[0];
    const counters = await getUtilityCounters(apartment.id);
    const payments = await getTenantApartmentPayments(id);

    res.status(200).json({
        counters: counters,
        payments: payments
    })
}
