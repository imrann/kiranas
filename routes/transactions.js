 const express = require('express');
const transactionController = require('./../controllers/transactionController');
var router = express.Router();
const cors = require('cors');
  
  
router.use(cors({ origin: true }));
 
//routes


//get All Users
//http://localhost:5001/kiranas-c082f/us-central1/user

router.get('/getAllTransactions', transactionController.getAllTransactions);
  
 

  
module.exports = router;

 
