import {afterAll, beforeAll, describe, expect, test} from "vitest";
import {seedDatabase} from "../src/db/seedDatabase";
import {Roles} from "../src/db/schema/roles";
import JwtTokenService from "../src/auth/JwtTokenService";
import request from "supertest";
import app from "./backendTest";
import {deleteUser, getUserByEmail} from "../src/db/schema/users";

const jwtTokenService = new JwtTokenService()

const agent = request.agent(app)
    .set('Authorization', `Bearer ${jwtTokenService.CreateAccessToken("Jonas", 1000, Roles.Owner)}`);

afterAll(async () => {
    await getUserByEmail("testOwner@gmail.com")
        .then(async (user) => {
            await deleteUser(user[0].id);
        })
})

describe.sequential("Auth tests", () => {
    describe.sequential("Register user", async () => {
        const res = await agent
            .post('/auth/register')
            .send({
                email: "testOwner@gmail.com",
                password: "password",
                fullName: "testOwner",
            })

        test("Status code 201", () => {
            expect(res.status).toBe(201);
        })

        test("User created successfully", () => {
            expect(res.body).toEqual({message: "User created successfully"});
        })
    })

    describe.sequential("Login user", async () => {
        const res = await agent
            .post('/auth/login')
            .send({
                email: "Jonas@tvisns.com",
                password: "password",
            })

        test("Status code 200", () => {
            expect(res.status).toBe(200);
        })

        test("Access token is not empty", () => {
            expect(res.body.accessToken).toBeDefined();
        })

        test("Refresh token is not empty", () => {
            expect(res.body.refreshToken).toBeDefined();
        })

        test("Role is 'Owner'", () => {
            expect(res.body.role).equals(Roles.Owner);
        })
    })

    describe.sequential("Get access token", async () => {
        const refreshToken = jwtTokenService.CreateRefreshToken(1000);

        const res = await agent
            .get('/auth/access-token')
            .set('Authorization', `Bearer ${refreshToken}`)

        test("Status code 200", () => {
            expect(res.status).toBe(200);
        })

        test("Access token is not empty", () => {
            expect(res.body.accessToken).toBeDefined();
        })

        test("Refresh token is not empty", () => {
            expect(res.body.refreshToken).toBeDefined();
        })

        test("Role is 'Owner'", () => {
            expect(res.body.role).equals(Roles.Owner);
        })
    })
})