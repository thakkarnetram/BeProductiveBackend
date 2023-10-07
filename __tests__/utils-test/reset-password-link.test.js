const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');

// DUMMY MODELS
const loginUser = {
    name: "Loggin@1",
    username: "loginUser1",
    email: "loginuser1@gmail.com",
    password: "Test@12345"
}
const loginUser2 = {
    name: "Loggin@1",
    username: "loginUser1",
    email: "loginuser1@gmail.com",
    password: "Test@1234"
}
const loginUser3 = {
    name: "Loggin@3",
    username: "loginUser3",
    email: "loginuser3@gmail.com",
    password: "Test@1234"
}
const loginUser4 = {
    name: "Loggin@3",
    username: "loginUser3",
    email: "loginuser3mailcom",
    password: "Test@1234"
}
const loginUserTest = {
    email: "loginuser1@gmail.com",
    password: "Test@12345"
}
const testuser5 = {
    name: "TestUser5",
    username: "testuser@5",
    email: "testuser5@gmail.com",
    password: "Test@12345"
}
const testuser6 = {}
const testuser7 = {
    email: "testuser7@gmail.com"
}
describe('POST /auth/api/v1/reset', () => {
    test("Should Return 400 Email Not Provided ", async () => {
        const headers = {
            "Content-Type": "application/json"
        }
        const response = await request(app)
            .post("/auth/api/v1/reset")
            .set(headers)
            .send(testuser6)
        expect(response.status).toBe(400)
    })
    test("Should Return 400 User Not Found ", async () => {
        const headers = {
            "Content-Type": "application/json"
        }
        const response = await request(app)
            .post("/auth/api/v1/reset")
            .set(headers)
            .send(testuser7)
        expect(response.status).toBe(404)
    });
    test("Should Return 200 Sent Password Reset Link To User ", async () => {
        const headers = {
            "Content-Type" : "application/json"
        }
        const response = await request(app)
            .post("/auth/api/v1/reset")
            .set(headers)
            .send({email: "firstUser123@gmail.com"})
        expect(response.status).toBe(200)
        console.log(response.body)
    })
});
