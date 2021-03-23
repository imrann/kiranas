 const express = require('express');
const userController = require('./../controllers/userController');

var router = express.Router();
const cors = require('cors');
  
  
router.use(cors({ origin: true }));
 

//routes

//get All Users
//http://localhost:5001/kiranas-c082f/us-central1/user
router.get('/getAllUsers', userController.getAllUsers);
  
//get users by userID
//http://localhost:5001/kiranas-c082f/us-central1/user/<userID>
router.get("/getUserById/:id", userController.getUserById)

//check if user is admin
router.get("/isUserAdmin/:phoneNumber", userController.isUserAdmin)


  
//create a new user
//http://localhost:5001/kiranas-c082f/us-central1/user
router.post('/createUser/:userID',userController.createUser);


//save device token forn FCM
router.post('/saveDeviceToken/:tokenCategory', userController.saveDeviceToken);

router.get('/getDeviceToken/:userID', userController.getDeviceToken);
  
//check if user already present in the system
//http://localhost:5001/kiranas-c082f/us-central1/user/isUserPresent/<userPhoneNumber>
router.get("/isUserPresent/:userPhoneNumber", userController.isUserPresent);

//update user address by userID
//http://localhost:5001/kiranas-c082f/us-central1/user/updateAddressByUserID/<userID>
router.put("/updateAddress/:id",userController.updateAddress);

  
module.exports = router;

 
