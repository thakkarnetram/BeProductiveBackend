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
describe('GET /auth/api/v1/verify',() => {
    test("Should Return 401 If Email Is Not Provided ", async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await request(app)
            .get('/auth/api/v1/verify')
            .set(headers)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', 'Email not found');
        // console.log(JSON.stringify(response.body, null, 2));
    });
    test("Should Return 404 If User Not Found ", async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await request(app)
            .get("/auth/api/v1/verify")
            .set(headers)
            .query({email:"dummymail@gmail.com"})
        expect(response.status).toBe(404)
        // console.log(JSON.stringify(response.body, null, 2));
    });
    test("Should Render Verified EJS If User Found", async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await request(app)
            .get("/auth/api/v1/verify?email=firstUser123@gmail.com")
            .set(headers)
        console.log(JSON.stringify(response.body, null, 2));
        expect(response.status).toBe(200);
        expect(response.text).toContain('User Verified');
        expect(response.text).toContain('Your account has been successfully verified.');
    })
});