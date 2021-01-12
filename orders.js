const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));
 
//create a new order and transaction
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/orders/createOrder/<transactionMode>

router.post('/createOrder/:transactionMode', async (req, res) => {
    const order = req.body;
    const orderProd = req.body['o_Products'];
 
    await admin.firestore().collection('orders').add(order).then(async function(docRef) {
        const get = await docRef.get();
        if (req.params.transactionMode === "COD") {
             await admin.firestore().collection('transactions').add(
                {
                    "t_Date": get.data()['o_Dop'],
                    "t_Mode" : req.params.transactionMode,
                    "t_OrderID" :docRef.id ,
                    "t_Party" :  get.data()['o_UserName'] + "("+get.data()['o_UserPhone']+")",
                    "t_Status" : "Pending",
                     "t_TransactionAction": "Creadited",
                     "t_BillAmt": get.data()['o_BillTotal']['totalAmt'],
                     "t_CreationDate":get.data()['createDate'],
                    "t_UpdationDate": get.data()['createDate']
                }
            );
        }
       

      }).catch(function(error) {
          console.error("Error adding document: ", error);
          res.status(500).send();
    });

    res.status(201).send();
});

//get All orders
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/orders/getAllOrders

router.get('/getAllOrders', async (req, res) => {
    const order = req.body;
      await admin.firestore().collection('orders').add(order);
      let orders = [];
      snapshot.forEach(doc => {   
        
        let orderData = doc.data();
        orders.push({userID,userData});
      });
      res.status(200).send(JSON.stringify(orders));
});


module.exports = router;
