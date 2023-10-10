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
let user = {
    name: "First User",
    username: "first1",
    email: "firstUser123@gmail.com",
    password: "Test@123"
}
const fakeUser = {
    name: "Fake User",
    username: "fake1",
    email: "fake123@gmail.com",
    password: "Fake@123"
}
// Notes TEST [ CRUD Operations ]
describe('POST /user/api/v1/notes/add', () => {
    test("Should Return 201 Note Created ", async () => {
        const token = authController.signToken(user.email, process.env.SECRET_KEY);
        const note = {
            title: "Test Note",
            description: "Note Test Description"
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        const response = await request(app)
            .post("/user/api/v1/notes/add")
            .set(headers)
            .send({title: note.title, description: note.description})
        expect(response.status).toBe(201)
        expect(response.body.message).toContain("Note added!")
        const notes = response.body;
    });
    test("Should Return 401 No Token Found ", async () => {
        const headers = {
            "Content-Type": "application/json"
        }
        const note = {
            title: "Test Note",
            description: "Note Test Description"
        }
        const response = await request(app)
            .post("/user/api/v1/notes/add")
            .set(headers)
            .send({title: note.title, description: note.description})
        expect(response.status).toBe(401)
        expect(response.body.message).toContain("No Token Found")
    })
    test("Should Return 404 User With Given Token Not Found ", async () => {
        const token = authController.signToken(fakeUser.email, process.env.SECRET_KEY);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        const note = {
            title: "Test Note",
            description: "Note Test Description"
        }
        const response = await request(app)
            .post("/user/api/v1/notes/add")
            .set(headers)
            .send({title: note.title, description: note.description})
        expect(response.status).toBe(404)
        expect(response.body.message).toContain("The user with the given token does not exist")
    })
});