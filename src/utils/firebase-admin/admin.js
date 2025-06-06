const firebaseAdmin = require('firebase-admin');
const devAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
firebaseAdmin.initializeApp({
    credential:firebaseAdmin.credential.cert(devAccount)
})

module.exports = firebaseAdmin;
