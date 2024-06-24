import JwtTokenService from "../auth/JwtTokenService";
import express from "express";
import {ApartmentPayment, createApartmentPayment, getApartmentPayments} from "../db/schema/apartmentPayments";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const jwtTokenService = new JwtTokenService();
export const  GetPayments = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});



    // const payments = await getApartmentPayments();

    res.status(200).json();
}

export const  CreatePayment = async (req: express.Request, res: express.Response) => {
    const id = jwtTokenService.GetUserIdFromAccessToken(req.headers.authorization!.split(' ')[1]);

    if (typeof(id) !== "number")
        return res.status(401).json({error: "Unauthorized"});

    const payment : ApartmentPayment = req.body;
    payment.apartmentId = parseInt(req.params.apartmentId);

    const createResult = await createApartmentPayment(payment);

    res.status(201).json(createResult[0]);
}

export const HandleStripePayment = async (req: express.Request, res: express.Response) => {
    const payment = req.body;
    await stripe.checkout.sessions.create({
        payment_method_types: ['card', "paypal"],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: "Rent",
                    },
                    unit_amount: payment.paymentAmount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5173/tenant',
        cancel_url: 'http://localhost:5173/tenant',
        metadata: {
            order_id: payment.apartmentId,
        }
    })
    .then((session) => {
        res.status(200).json({id: session.id});
    })
    .catch((error) => {
        res.status(500).json(error);
    });
}