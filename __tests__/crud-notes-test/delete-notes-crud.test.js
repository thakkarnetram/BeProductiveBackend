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
let user1 = {
    name: "First User",
    username: "first1",
    email: "firstUser123@gmail.com",
    password: "Test@123"
}
let user2 = {
    name: "Second User",
    username: "Second1",
    email: "SecondUser@gmail.com",
    password: "Second@123"
}
const fakeUser = {
    name: "Fake User",
    username: "fake1",
    email: "fake123@gmail.com",
    password: "Fake@123"
}
// Notes TEST [ CRUD Operations ]
describe('DELETE /user/api/v1/notes/delete/:_id', () => {
    test("Should Return 200 Note Deleted ", async () => {
        const token = authController.signToken(user1.email, process.env.SECRET_KEY);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        const note = await Notes.find({email: user1.email})
        const noteID = note[0]._id;
        const response = await request(app)
            .delete(`/user/api/v1/notes/delete/${noteID}`)
            .set(headers)
        expect(response.status).toBe(200)
        expect(response.body.message).toContain(`Note deleted for ${user1.email}`)
    })
    test("Should Return 401 Unauthorized To Update This ", async () => {
        const token = authController.signToken(user2.email, process.env.SECRET_KEY);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        const note2 = await Notes.find({email: user1.email})
        console.log(note2)
        // const noteID = note2[0]._id;
        const response = await request(app)
            .delete(`/user/api/v1/notes/delete/${note2}`)
            .set(headers)
        console.log(JSON.stringify(response.body.message, null, 2))
        expect(response.status).toBe(401)
        expect(response.body.message).toContain('Unauthorized to delete this')
    })
});