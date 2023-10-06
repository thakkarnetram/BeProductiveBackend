const request = require('supertest');
const app = require('../../app');
const authController = require('../../src/controllers/authController');
const Notes = require('../../src/models/Notes')
const Todos = require('../../src/models/Todos');
const User = require('../../src/models/User');
const bcrypt = require("bcrypt");

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
    email: "testuser3@gmail.com",
    password: "Tes123"
}
const testuser4 = {
    name: "TestUser4",
    username: "testuser@4",
    email: "testuser4@gmail.com",
    password: "Test@1234"
}

beforeAll(async () => {
    await Notes.deleteMany({})
    const hashedPassword = await bcrypt.hash(testuser4.password, 10);
    const saveUser = new User({
        ...testuser4,
        password: hashedPassword
    });
    await saveUser.save()
    const updatedUser = await User.findOneAndUpdate({email: testuser4.email}, {isEmailVerified: true})
})

// Notes TEST [ CRUD Operations ]
describe('GET /user/api/v1/notes', () => {
    it('should return notes', async () => {
        // Get a valid JWT token
        const token = authController.signToken(testuser4.email, process.env.SECRET_KEY);
        console.log(token)
        const response = await request(app)
            .get('/user/api/v1/notes')
            .set('Authorization', `Bearer ${token}`);
        console.log(response.body)
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
        const notes = response.body;
    });
    it('should return 401 without a valid JWT', async () => {
        const response = await request(app).get('/user/api/v1/notes');
        expect(response.status).toBe(401);
    });
});

