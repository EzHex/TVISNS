import  request  from "supertest";
import { beforeEach, afterAll, describe, test, expect, expectTypeOf } from "vitest";
import JwtTokenService from "../src/auth/JwtTokenService";
import { Roles } from "../src/db/schema/roles";
import { seedDatabase } from "../src/db/seedDatabase";
import app from "./backendTest";
import { deleteReading } from "../src/db/schema/readings";

const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteReading(1100);
})

describe.sequential("Readings", () => {
    describe.sequential("Create", async () => {
        const res = await agent
            .post(`/utility/counters/${1000}/readings`)
            .send({
                counterId: 1100,
                date: "2022-01-01",
                value: 100
            })

        test("Status code 201", () => {
            expect(res.status).toEqual(201);
        })
    })

    describe.sequential("Get", async () => {
        const res = await agent
            .get(`/utility/counters/${1000}/readings`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })
})