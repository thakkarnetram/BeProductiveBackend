const mongoose = require('mongoose');
const User = require("./src/models/User");
const bcrypt = require("bcrypt");

let userAdded = false;
let user = {
    name: "First User",
    username: "first1",
    email: "firstUser123@gmail.com",
    password: "Test@123"
}
beforeAll(async () => {
    if (!userAdded) {
        const mongoUri = process.env.ATLAS_URI; // Replace with your MongoDB URI
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const saveUser = new User({
                ...user,
                password: hashedPassword,
            });
            await saveUser.save();
            userAdded = true;
        }
        const updatedUser = await User.findOneAndUpdate(
            { email: user.email },
            { isEmailVerified: true }
        );
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});
