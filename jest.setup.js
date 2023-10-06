const mongoose = require('mongoose');

beforeAll(async () => {
    const mongoUri = process.env.ATLAS_URI; // Replace with your MongoDB URI
    console.log(mongoUri)
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
