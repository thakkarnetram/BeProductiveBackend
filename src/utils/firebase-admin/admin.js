const firebaseAdmin = require('firebase-admin');
const devAccount = require('../../be-productive-dev-sdk-admin.json');
firebaseAdmin.initializeApp({
    credential:firebaseAdmin.credential.cert(devAccount)
})

module.exports = firebaseAdmin;
