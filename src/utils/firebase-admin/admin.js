const firebaseAdmin = require('firebase-admin');
const devAccount = require('../../be-productive-dev-firebase-adminsdk-fbsvc-cea0a40335.json');
firebaseAdmin.initializeApp({
    credential:firebaseAdmin.credential.cert(devAccount)
})

module.exports = firebaseAdmin;
