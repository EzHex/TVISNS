import {afterAll, beforeEach, describe, expect, expectTypeOf, test} from "vitest";
import JwtTokenService from "../src/auth/JwtTokenService";
import request from "supertest";
import app from "./backendTest";
import {Roles} from "../src/db/schema/roles";
import { deleteUtilityCounter } from "../src/db/schema/utilityCounters";
import { seedDatabase } from "../src/db/seedDatabase";

const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteUtilityCounter(1015)
})

describe.sequential("Counters", () => {
    describe.sequential("Create", async () => {
        const res = await agent
            .post(`/utility/counters/${1000}`)
            .send({
                apartmentId: 1000,
                counterType: "gas",
                id: 1015,
                title: "Dujų skaitiklis"
            })

        test("Status code 201", () => {
            expect(res.status).toEqual(201);
        })
    })

    describe.sequential("Get", async () => {
        const res = await agent
            .get(`/utility/counters/${1000}`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })
})