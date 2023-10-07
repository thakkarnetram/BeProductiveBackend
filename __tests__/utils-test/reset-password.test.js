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
describe('GET /auth/api/v1/reset/:_id' ,() => {
    test("Should Return 404 User Not Found " , async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const userId = "76nnr3";
        const response = await request(app)
            .get(`/auth/api/v1/reset/${userId}`)
            .set(headers)
        expect(response.status).toBe(404);
        console.log(JSON.stringify(response.body));
    });
});

// describe('POST /auth/api/v1/reset/:_id', () => {
//
// });