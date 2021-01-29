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
    try {
        const snapshot = await
        admin.firestore().collection('users').doc(req.params.id).get();
        let message = "getUserById";
        const userID = snapshot.id;
        const userData = snapshot.data();
        res.status(200).send(JSON.stringify({message,userData}));
    } catch (error) {
        console.error("Error getting User: ", error);
        let message = "Error getting User";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
   
})
  
//create a new user
//http://localhost:5001/kiranas-c082f/us-central1/user

router.post('/createUser/:userID', async (req, res) => {
    const user = req.body;
    try {
        await admin.firestore().collection('users').doc(req.params.userID).set(user);
        let message = "User Created"
        res.status(201).send(JSON.stringify({message,userData:user}));
    } catch (error){
        console.error("Error adding User: ", error);
        let message = "Error Creating User";
        res.status(500).send(JSON.stringify({message,userData:null}));
  }
    
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

    try {
        await 
        admin.firestore().collection('users').doc(req.params.id).set({"userAddress": body},{merge:true});
        let message = "Address Updated"
        res.status(201).send(JSON.stringify({message,userData:body}));
    } catch (error){
        console.error("Error Updating Address: ", error);
        let message = "Error Updating Address";
        res.status(500).send(JSON.stringify({message,userData:null}));
  }
    
    res.status(200).send();
  });

  
module.exports = router;

 
