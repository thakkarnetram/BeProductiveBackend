const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const Note = require('./src/models/Notes'); // Adjust the path accordingly

async function seedDatabase() {
    const client = new MongoClient("mongodb://localhost:27017/test-database", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();

        // Connect Mongoose to the database
        await mongoose.connect("mongodb://localhost:27017/test-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Insert dummy note using Mongoose model
        const dummyNote1 = new Note({
            title: 'Dummy Note',
            description: 'This is a dummy note for testing purposes.',
            email: 'firstUser123@gmail.com', // Provide a valid email
        });
        const dummyNote2 = new Note({
            title: 'Dummy Note 2 ',
            description: 'This is a dummy note for testing purposes 2 .',
            email: 'firstUser123@gmail.com', // Provide a valid email
        });
        // Save the dummy note to the database
        await dummyNote1.save();
        await dummyNote2.save();

        console.log('Inserted dummy note into the database.');
    } finally {
        // Close MongoDB client and Mongoose connection
        await client.close();
        await mongoose.disconnect();
    }
}

seedDatabase();
