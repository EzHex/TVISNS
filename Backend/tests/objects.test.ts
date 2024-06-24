import request from "supertest";
import {describe, test, expect, afterAll, expectTypeOf, beforeEach} from "vitest";
import {seedDatabase} from "../src/db/seedDatabase";
import {Roles} from "../src/db/schema/roles";
import JwtTokenService from "../src/auth/JwtTokenService";
import app from "./backendTest";
import {deleteObject} from "../src/db/schema/objects";

const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteObject(1110);
})


describe.sequential("Objects", () => {
    describe.sequential("Create", async () => {
        const res = await agent
            .post(`/apartments/${1000}/rooms/${1000}/objects`)
            .send({
                id: 1110,
                title: "Stalas",
                description: "Geras stalas",
                image: "",
                grade: 5,
                ownerId: 1000,
                roomId: 1000
            })
    
        test("Status 201", () => {
            expect(res.status).toEqual(201);
        })
    })
    
    describe.sequential("Get", async () => {
        const res = await agent
            .get(`/apartments/${1000}/rooms/${1000}/objects`)
    
        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })
    
        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })
    
    describe.sequential("Update", async () => {
        const res = await agent
            .put(`/apartments/${1000}/rooms/${1000}/objects/${1000}`)
            .send({
                title: "Arbatinukas",
                description: "Geras arbatinukas",
                image: "",
                grade: 5,
                ownerId: 1000,
                roomId: 1000
            })
    
        test("Status 200", () => {
            expect(res.status).toEqual(200);

        })
    
        test("Message", () => {
            expect(res.body.message).toEqual("Object updated successfully");
        })
    })
    
    describe.sequential("Delete", async () => {
        const res = await agent
            .delete(`/apartments/${1000}/rooms/${1000}/objects/${1001}`)
    
        test("Status 204", () => {
            expect(res.status).toEqual(204);
        })
    })
})
