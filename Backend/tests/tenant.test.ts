import request from "supertest";
import { beforeEach, afterAll, describe, expect, test, expectTypeOf } from "vitest";
import JwtTokenService from "../src/auth/JwtTokenService";
import { Roles } from "../src/db/schema/roles";
import { seedDatabase } from "../src/db/seedDatabase";
import app from "./backendTest";
import { deleteFailure } from "../src/db/schema/failures";


const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Tomas", 1003, Roles.Tenant)}`);

beforeEach(async () => {
    await seedDatabase();
})

afterAll(async () => {
    await deleteFailure(1010)
})

describe.sequential("Tenants", () => {
    describe.sequential("Get tenant data", async () => {
        const res = await agent
            .get(`/tenant`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect object", () => {
            expectTypeOf(res.body).toHaveProperty("counters");
            expectTypeOf(res.body).toHaveProperty("payments");
        })
    })

    describe.sequential("Get tenant rooms", async () => {
        const res = await agent
            .get(`/tenant/rooms`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })

    describe.sequential("Get tenant objects", async () => {
        const res = await agent
            .get(`/tenant/rooms/${1000}/objects`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })

    describe.sequential("Create failure report", async () => {
        const res = await agent
            .post(`/tenant/failures`)
            .send({
                description: "Neveikia Orkaitė",
                objectId: 1135,
                id: 1010,
            })

        test("Status 201", () => {
            expect(res.status).toEqual(201);
        })
    })

    describe.sequential("Get failures", async () => {
        const res = await agent
            .get(`/tenant/failures`)

        test("Status 200", () => {
            expect(res.status).toEqual(200);
        })

        test("Expect array", () => {
            expectTypeOf(res.body).toBeArray;
        })
    })

})