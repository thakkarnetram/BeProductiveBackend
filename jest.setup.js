const mongoose = require('mongoose');
const User = require("./src/models/User");
const bcrypt = require("bcrypt");

let userAdded = false;
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
beforeAll(async () => {
    if (!userAdded) {
        require('dotenv').config({path:`.env.${process.env.NODE_ENV}`})
        const mongoUri = process.env.ATLAS_URI; // Replace with your MongoDB URI
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existingUser1 = await User.findOne({email: user1.email});
        const existingUser2 = await User.findOne({email: user2.email});
        if (!existingUser1 && !existingUser2) {
            const hashedPassword1 = await bcrypt.hash(user1.password, 10);
            const hashedPassword2 = await bcrypt.hash(user2.password, 10);
            const saveUser1 = new User({
                ...user1,
                password: hashedPassword1,
            });
            const saveUser2 = new User({
                ...user2,
                password: hashedPassword2,
            });
            await saveUser1.save();
            await saveUser2.save();
            userAdded = true;
        }
        const updatedUser1 = await User.findOneAndUpdate(
            {email: user1.email},
            {isEmailVerified: true}
        );
        const updatedUser2 = await User.findOneAndUpdate(
            {email: user2.email},
            {isEmailVerified: true}
        );
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});
