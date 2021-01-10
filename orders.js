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
    var initiateOrderTransaction = true;
    
 
   

    await admin.firestore().runTransaction(async t => {

            const productCountListRef = admin.firestore().collection('productsCount').doc('productsCount123')
       return t.get(productCountListRef).then(inventoryProdDoc => {
            orderProd.forEach(orderProdDoc => {
                var ff = inventoryProdDoc.data().productsCountList;
             
                // ff.forEach(element => {
                    
                    
                // });  
                if (orderProdDoc['productQty'] > 5) {
                    ta = t.update(productCountListRef , { productsQty: "5" })
                } else {
                    res.status(500).send("Sorry! Some Product Quantity is not available than what you selected.");
                    //                     throw 'Sorry! Some Product Quantity is not available than what you selected.';
                }

            });return ta;

        });
     
        
    }).then(result =>{
        console.log('Transaction success!',result)
        res.status(200).send("Success");

    }).catch(error =>{
        console.log('Transaction failure:', error)
        res.status(500).send("something went wrong, Please try again later!");

    });

       
        
        

       
    //     orderProd.forEach(async prod => {  
    //         const productRef =  admin.firestore().collection('products').doc(prod['productID'])
    //             t.get(productRef).then(doc =>{
    //                 const newProductQty = doc.data().productQty -  prod['productQty'] ;
    //                 console.log(doc.data().productQty);
    //               if (doc.data().productQty >= prod['productQty']) {
                        
    //                   t.update(productRef, { productQty: newProductQty })
    //                   res.status(500).send("ss");
    //                 } else {
    //                     res.status(500).send("Sorry! Some Product Quantity is not available than what you selected.");
    //                     throw 'Sorry! Some Product Quantity is not available than what you selected.';
    //                   }
    //             })
              

    //     });
    //   }).then(result =>{
    //     console.log('Transaction success!',result)
    //     res.status(200).send("Success");

    // }).catch(error =>{
    //     console.log('Transaction failure:', error)
    //     res.status(500).send("something went wrong, Please try again later!");

    // });

// try {
//     const res = await admin.firestore().runTransaction(async t => {
//         orderProd.forEach(async prod => {   
//             const doc = await t.doc(prod['productID']).get(productRef);
//             const newProductQty = doc.data().productQty -  prod['productQty'] ;
//             console.log(doc.data().productQty);
//                 if (doc.data().productQty >= prod['productQty']) {
//                     t.update(productRef, { productQty: newProductQty });
//                    } else {
//                     throw 'Sorry! Some Product Quantity is not available than what you selected.';
//                   }

//            });
//         });
//                  console.log('Transaction success', res);
//         } catch (e) {
//                 console.log('Transaction failure:', e);
//                 res.status(500).send();

//             }
    


    
    // await admin.firestore().collection('orders').add(order).then(async function(docRef) {
    //     const get = await docRef.get();
    //     if (req.params.transactionMode === "COD") {
    //          await admin.firestore().collection('transactions').add(
    //             {
    //                 "t_Date": get.data()['o_Dop'],
    //                 "t_Mode" : req.params.transactionMode,
    //                 "t_OrderID" :docRef.id ,
    //                 "t_Party" :  get.data()['o_UserName'] + "("+get.data()['o_UserPhone']+")",
    //                 "t_Status" : "Pending",
    //                  "t_TransactionAction": "Creadited",
    //                 "t_BillAmt": get.data()['o_BillTotal']['totalAmt']  
    //             }
    //         );
    //     }
       

    //   }).catch(function(error) {
    //       console.error("Error adding document: ", error);
    //       res.status(500).send();
    // });

    // res.status(201).send();
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
