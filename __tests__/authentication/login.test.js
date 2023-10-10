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
beforeAll(async () => {
    await User.deleteMany({})
    const hashedPassword = await bcrypt.hash(loginUser.password, 10);
    const saveUser1 = new User({
        ...loginUser,
        password: hashedPassword
    });
    await saveUser1.save()
    const saveUser2 = new User(testuser5);
    await saveUser2.save()
    const updatedUser = await User.findOneAndUpdate({email: loginUser.email}, {isEmailVerified: true})
},25000)

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
            // console.log(response.body);  Log the response body
            expect(response.statusCode).toBe(200);
        } catch (error) {
            console.log("Error during login test:", error);
            throw error; // Rethrow the error to fail the test
        }
    });
    test("Should Return Email Format Not Valid " , async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const res = await request(app)
            .post("/auth/api/v1/login")
            .set(headers)
            .send(loginUser4)
        expect(res.status).toBe(400)
    })
    test('Should Return Email,Password Is Empty', async () => {
        const res = await request(app).post('/auth/api/v1/login');
        expect(res.status).toBe(400);
    });
    test("Should Return Email Not Verified",async ()=> {
        const headers = {
            "Content-Type":"application/json"
        }
        const res = await request(app)
            .post('/auth/api/v1/login')
            .set(headers)
            .send(testuser5)
        expect(res.status).toBe(401)
    })
    test("Should Return Password Is Invalid ", async ()=>{
        const headers = {
            "Content-Type":"application/json"
        }
        const res = await request(app)
            .post("/auth/api/v1/login")
            .set(headers)
            .send(loginUser2)
        expect(res.status).toBe(401)
    })
    test("Should Return Invalid Credentials" , async () => {
        const headers = {
            "Content-Type":"application/json"
        }
        const res = await request(app)
            .post("/auth/api/v1/login")
            .set(headers)
            .send(loginUser3)
        expect(res.status).toBe(401)
    })
});