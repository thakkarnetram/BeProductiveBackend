const request = require('supertest');
const app = require('../app');
const authController = require('../src/controllers/authController');
const Notes = require('../src/models/Notes')
const Todos = require('../src/models/Todos')
const User = require('../src/models/User');

const loginUser = {
    name: "Loggin@1",
    username: "testuser4",
    email: "testuser2555@gmail.com",
    password: "Test@12345"
}
const testuser1 = {
    name: "TestUser1",
    username: "testuser@2",
    email: "testuser24@gmail.com",
    password: "Test@12345"
}
const testuser2 = {
    name: "TestUser1",
    username: "testuser@2",
    email: "testuser2@gmail.com",
    password: "Tes123"
}
beforeAll(async () => {
    console.log("OK")
    await Notes.deleteMany({})
    await User.deleteMany({})
    const  saveUser = new User(loginUser);
    await saveUser.save()
    const updatedUser = await  User.findOneAndUpdate({email: loginUser.email}, {isEmailVerified: true})
})

describe('POST /auth/api/v1/signup', () => {
    test("Sign up user", async () => {
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await request(app)
            .post("/auth/api/v1/signup")
            .set(headers)
            .send(testuser1);

        // Log headers, testuser1, and response for debugging
        console.log("Headers:", JSON.stringify(headers));
        console.log("Test User:", JSON.stringify(testuser1));
        console.log("Response:", response.body);

        expect(response.statusCode).toBe(201);
    });
    it('should return all fields are required', async () => {
        const res = await request(app).post('/auth/api/v1/signup');
        expect(res.status).toBe(400);
    });
    it('should return Password is not strong', async () => {
        const res = await request(app)
            .post('/auth/api/v1/signup').send(testuser2);
        expect(res.status).toBe(400);
    });
});


describe('GET /user/api/v1/notes', () => {
    it('should return notes', async () => {
        // Get a valid JWT token
        const email = "devilgfx1875@gmail.com"
        const token = authController.signToken(email, process.env.SECRET_KEY);
        console.log(token)
        const response = await request(app)
            .get('/user/api/v1/notes')
            .set('Authorization', `Bearer ${token}`);
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        // Assuming your notes have certain properties like _id, title, description, etc.
        const notes = response.body;
        expect(notes.every(note => note.hasOwnProperty('_id'))).toBe(true);
        expect(notes.every(note => note.hasOwnProperty('title'))).toBe(true);
        expect(notes.every(note => note.hasOwnProperty('description'))).toBe(true);
        expect(notes.every(note => note.hasOwnProperty('email'))).toBe(true);
        expect(notes.every(note => note.hasOwnProperty('createdAt'))).toBe(true);
        // You can add more specific assertions based on your actual response structure
        console.log(notes);
    });
    it('should return 401 without a valid JWT', async () => {
        const response = await request(app).get('/user/api/v1/notes');
        // Assertions
        expect(response.status).toBe(401);
    });
});
