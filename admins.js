const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));

 



router.put('/addAdmin/:phone', async (req, res) => {

     await admin.firestore().collection('admin').doc('adminUser').
        update({ adminUserList: admin.firestore.FieldValue.arrayUnion({ adminPhone: req.params.phone, adminRole:true }) });
        
       
    res.status(201).send();
});

router.delete('/addAdmin/:phone', async (req, res) => {

    await admin.firestore().collection('admin').doc('adminUser').
       update({ adminUserList: admin.firestore.FieldValue.arrayRemove({ adminPhone: req.params.phone, adminRole:true }) });
       
      
   res.status(201).send();
});


module.exports = router;
