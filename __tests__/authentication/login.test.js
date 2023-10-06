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

beforeAll(async () => {
    await User.deleteMany({})
    const hashedPassword = await bcrypt.hash(loginUser.password, 10);
    const saveUser = new User({
        ...loginUser,
        password: hashedPassword
    });
    await saveUser.save()
    const updatedUser = await User.findOneAndUpdate({email: loginUser.email}, {isEmailVerified: true})
},15000)


// Login TEST
describe("POST /auth/api/v1/login", () => {
    test("Should Login User", async () => {
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            const response = await request(app)
                .post("/auth/api/v1/login")
                .set(headers)
                .send(loginUserTest);
            console.log(response.body); // Log the response body
            expect(response.statusCode).toBe(200);
        } catch (error) {
            console.log("Error during login test:", error);
            throw error; // Rethrow the error to fail the test
        }
    });
    test('Should Return Email,Password Is Empty', async () => {
        const res = await request(app).post('/auth/api/v1/login');
        expect(res.status).toBe(400);
    });
});