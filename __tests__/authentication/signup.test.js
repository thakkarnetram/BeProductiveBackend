const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');
const bcrypt = require("bcrypt")

// DUMMY MODELS
const loginUser = {
    name: "Loggin@1",
    username: "loginUser1",
    email: "loginuser1@gmail.com",
    password: "Test@12345"
}
const loginUserTest = {
    email: "loginuser1@gmail.com",
    password: "Test@12345"
}
const testuser1 = {
    name: "TestUser1",
    username: "testuser@2",
    email: "testuser1@gmail.com",
    password: "Test@12345"
}
const testuser2 = {
    name: "TestUser2",
    username: "testuser@3",
    email: "testuser2@gmail.com",
    password: "Tes123"
}
const testuser3 = {
    name: "TestUser3",
    username: "testuser@3",
    email: "testuser2@gmail.com",
    password: "Tes123"
}

beforeAll(async () => {
    await User.deleteMany({})
})

// Sign Up TEST
describe('POST /auth/api/v1/signup', () => {
    test("User Signed Up, Verify Email", async () => {
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await request(app)
            .post("/auth/api/v1/signup")
            .set(headers)
            .send(testuser1);

        expect(response.statusCode).toBe(201);
    });
    test('Should Return Name,Username,Email,Password Is Empty', async () => {
        const res = await request(app).post('/auth/api/v1/signup');
        expect(res.status).toBe(400);
    });

    test('Should Return Password Is Not 6 Char [1 number, 1 special char, 1 upper case]', async () => {
        const res = await request(app)
            .post('/auth/api/v1/signup')
            .send(testuser2);
        expect(res.status).toBe(400);
    });

    test('Should Return Email Already Exists', async () => {
        const res = await request(app)
            .post('/auth/api/v1/signup')
            .send(testuser3);
        expect(res.status).toBe(400);
    });
},40000);
