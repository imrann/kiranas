const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));
 
//get All Users
//http://localhost:5001/kiranas-c082f/us-central1/user

router.get('/getAllUsers', async (req, res) => {
    const snapshot = await admin.firestore().collection('users').get();
    let users = [];
    snapshot.forEach(doc => {   
      let userID = doc.id;
      let userData = doc.data();
      users.push({userID,userData});
    });
    res.status(200).send(JSON.stringify(users));
});
  
//get users by userID
//http://localhost:5001/kiranas-c082f/us-central1/user/<userID>

router.get("/getUserById/:id", async (req, res) => {
    const snapshot = await
    admin.firestore().collection('users').doc(req.params.id).get();
    const userID = snapshot.id;
    const userData = snapshot.data();
    res.status(200).send(JSON.stringify({userID,userData}));
})
  
//create a new user
//http://localhost:5001/kiranas-c082f/us-central1/user

router.post('/createUser', async (req, res) => {
    const user = req.body;
    console.log(req.body['userPhone']);
     await admin.firestore().collection('users').add(user);
    res.status(201).send();
});
  
//check if user already present in the system
//http://localhost:5001/kiranas-c082f/us-central1/user/isUserPresent/<userPhoneNumber>

router.get("/isUserPresent/:userPhoneNumber", async (req, res) => {

    const snapshot= await
        admin.firestore().collection('users').where('userPhone', '==', req.params.userPhoneNumber).get();
    console.log(req.params.userPhoneNumber);
    let users = [];
    snapshot.forEach(doc => {
      let userID = doc.id;
      let userData = doc.data();
      users.push({userID,userData});
    });
    if (users.length < 1) {
        console.log('new User');
         res.status(200).send(JSON.stringify({ isUserPresent:false }));
    } else {
        console.log('old User');
        res.status(200).send(JSON.stringify({ isUserPresent:true}));
    }
 
});

//update user address by userID
//http://localhost:5001/kiranas-c082f/us-central1/user/updateAddressByUserID/<userID>

router.put("/updateAddress/:id", async (req, res) => {
    const body = req.body;
    await 
        admin.firestore().collection('users').doc(req.params.id).set({"userAddress": body},{merge:true});
    res.status(200).send();
  });

  
module.exports = router;

 
