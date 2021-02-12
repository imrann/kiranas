const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));
 
//get All Users
//http://localhost:5001/kiranas-c082f/us-central1/user

router.get('/getAllTransactions', async (req, res) => {
 
    try {
        const snapshot =await admin.firestore().collection('transactions').orderBy('t_UpdationDate').get();
        let transactions = [];
        let message = "getAllTransactions";
          snapshot.forEach(doc => {   
            
            let transData = doc.data();
            transactions.push({transData});
          });
        res.status(200).send(JSON.stringify({message,transactions}));
    } catch (error) {
        console.error("Error getting transactions: ", error);
        let message = "Error getting transactions";
        res.status(500).send(JSON.stringify({message,transactions:null}));
    }
});
  
 

  
module.exports = router;

 
