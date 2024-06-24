import request from "supertest";
import { beforeEach, afterAll, describe, test, expect, expectTypeOf } from "vitest";
import JwtTokenService from "../src/auth/JwtTokenService";
import { deleteApartment } from "../src/db/schema/apartments";
import { Roles } from "../src/db/schema/roles";
import { seedDatabase } from "../src/db/seedDatabase";
import app from "./backendTest";


const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteApartment(1010);
})

describe.sequential("Apartments", () =>{
    describe.sequential("Create", async () =>{
        const res = await agent
            .post("/apartments")
            .send({
                area: 100,
                floor: 5,
                heating: "Gas",
                houseNumber: "15C",
                id: 1010,
                microDistrict: "Kaunas",
                ownerId: 1000,
                residence: "Kaunas",
                roomNumber: 12,
                street: "Studentų g.",
                tenantId: 1003,
                title: "15C Rūmai",
                type: "Block",
                year: "1990-01-01"
            })

        test("Status code 201", () =>{
            expect(res.status).toEqual(201);
        })
    })

    describe.sequential("Get", async () => {
        const res = await agent
            .get('/apartments')

        test("Status 200", () => {
            expect(res.status).toEqual(200)
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })

    describe.sequential("Update", async () => {
        const res = await agent
            .put(`/apartments/${1001}`)
            .send({
                area: 80,
                floor: 5,
                heating: "Wood",
                houseNumber: "15B",
                id: 1001,
                microDistrict: "Kaunas",
                ownerId: 1000,
                residence: "Kaunas",
                roomNumber: 12,
                street: "Studentų g.",
                tenantId: 1003,
                title: "15B Rūmai",
                type: "Block",
                year: "1990-01-01"
            })

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Heating wood", () => {
            expect(res.body.heating).toEqual("Wood");
        })

        test("Area 80", () => {
            expect(res.body.area).toEqual(80);
        })
    })

    describe.sequential("Delete", async () => {
        const res = await agent
            .delete(`/apartments/${1001}`)

        test("Status 204", () => {
            expect(res.status).toEqual(204)
        })
    })
})