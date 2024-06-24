import  request  from "supertest";
import { beforeEach, afterAll, describe, expect, expectTypeOf, test } from "vitest";
import JwtTokenService from "../src/auth/JwtTokenService";
import { Roles } from "../src/db/schema/roles";
import { deleteRoom } from "../src/db/schema/rooms";
import { seedDatabase } from "../src/db/seedDatabase";
import app from "./backendTest";

const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteRoom(1010);
})

describe.sequential("Rooms", () => {
    describe.sequential("Create", async () => {
        const res = await agent
            .post(`/apartments/${1000}/rooms`)
            .send({
                apartmentId: 1000,
                area: 15,
                grade: 8,
                id: 1010,
                name: "Miegamasis",
                ownerId: 1000,
                roomType: "Bedroom",
                windowDirection: "West"
            })
    
        test("Status 201", () => {
            expect(res.status).toEqual(201);
        })
    })
    
    describe.sequential("Get", async () => {
        const res = await agent
            .get(`/apartments/${1000}/rooms`)
    
        test("Status 200", () => {
            expect(res.status).toEqual(200)
        })
    
        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })
    
    describe.sequential("Update", async () => {
        const res = await agent
            .put(`/apartments/${1000}/rooms/${1001}`)
            .send({
                apartmentId: 1000,
                area: 15,
                grade: 8,
                name: "Miegamasis",
                ownerId: 1000,
                roomType: "Bedroom",
                windowDirection: "East"
            })
    
        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })
    
        test("Window direction east", () => {
            expect(res.body.windowDirection).toEqual("East");
        })
    })
    
    describe.sequential("Delete", async () => {
        const res = await agent
            .delete(`/apartments/${1000}/rooms/${1001}`)
    
        test("Status 204", () => {
            expect(res.status).toEqual(204)
        })
    })
})