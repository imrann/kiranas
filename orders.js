const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));

// let date_ob = new Date();

// // adjust 0 before single digit date
// let date = ("0" + date_ob.getDate()).slice(-2);

// // current month
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// // current year
// let year = date_ob.getFullYear();
 
// var todaysDate =  date + "-" + month + "-" + year;

 
//create a new order and transaction
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/orders/createOrder/<transactionMode>

router.post('/createOrder/:transactionMode', async (req, res) => {
    const order = req.body;
    const orderProd = req.body['oProducts'];
    const now = new Date()  
    var todaysDate = Math.round(now.getTime())

    try {
        let message = "order created";

        const docRef = await admin.firestore().collection('orders').add(order)
        const getData = await docRef.get()
        const productsUpdatedData = await admin.firestore().collection('orders').doc(docRef.id).set({ "orderID": docRef.id }, { merge: true })
        const transactionData = await admin.firestore().collection('transactions').add(
            {
                 
                "t_Mode": req.params.transactionMode,
                "t_OrderID": docRef.id,
                "t_Party": getData.data()['oUserName'] +"  "+"(" + getData.data()['oUserPhone'] + ")",
                "t_Status": "Pending",
                "t_TransactionAction": "Creadited",
                "t_BillAmt": getData.data()['oBillTotal']['totalAmt'],
                "t_CreationDate": todaysDate,
                "t_UpdationDate": todaysDate
            }
        )
        
        res.status(201).send(JSON.stringify({message,result:""}));

    } catch (error) {
        let message = "order creation error";

        console.error("Error creating orders: ", error);

        res.status(500).send(JSON.stringify({message,result:""}));

}
  
    

     
 
    //       admin.firestore().collection('orders').add(order).then(function(docRef) {
           
    //            docRef.get().then(function(getData) {
    //               admin.firestore().collection('transactions').add(
    //                 {
    //                     "t_Date": getData.data()['o_Dop'],
    //                     "t_Mode" : req.params.transactionMode,
    //                     "t_OrderID" :docRef.id ,
    //                     "t_Party" :  getData.data()['o_UserName'] + "("+getData.data()['o_UserPhone']+")",
    //                     "t_Status" : "Pending",
    //                      "t_TransactionAction": "Creadited",
    //                      "t_BillAmt": getData.data()['o_BillTotal']['totalAmt'],
    //                      "t_CreationDate":getData.data()['o_Dop'],
    //                     "t_UpdationDate": getData.data()['o_Dop']
    //                 }
    //             );
    //             res.status(201).send();
    //          }).catch(function(error) {
    //             console.error("Error adding document: ", error);
    //             res.status(500).send();
    //       });
           
         
    //     res.status(201).send();


    //   }).catch(function(error) {
    //       console.error("Error adding document: ", error);
    //       res.status(500).send();
    // });

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


router.get('/getOrdersByType/:userId/:type', async (req, res) => {
     
    try {
        const snapshot =await admin.firestore().collection('orders').where('oUserID','==',req.params.userId).where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').get();
        let orders = [];
        let message = "getOrdersByType";
          snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          });
        res.status(200).send(JSON.stringify({message,orders}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
});



router.get("/getOrderByFilter/dop/:dop?/dod/:dod?/doc/:doc?/trackingStatus/:trackingStatus?/status/:status", async (req, res) => { 

    var dop = parseInt(req.params.dop);
    var dopPlusOne = parseInt(req.params.dop) + 86400000;

    var dod = parseInt(req.params.dod);
    var dodPlusOne = parseInt(req.params.dod) + 86400000;

    var doc = parseInt(req.params.doc);
    var docPlusOne = parseInt(req.params.doc) + 86400000;

    try {
        let message = "getOrderByFilter";

 
        var query = admin.firestore().collection('orders')


        
        switch (req.params.status) {
            case "Open":       
            console.log("here11");

                if (req.params.dop !== "null" && req.params.trackingStatus !== "null") { 
                    console.log("here1");
                    query = query.where('oDop', '>=', dop).where('oDop', '<', dopPlusOne).where('oTrackingStatus', '==', req.params.trackingStatus).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
                } else if ((req.params.dop !== "null")  && (req.params.trackingStatus === "null")) {
                    query = query.where('oDop', '>=', dop).where('oDop', '<', dopPlusOne).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
                }else   {
                   query = query.where('oTrackingStatus', '==', req.params.trackingStatus).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
               }           
                
                break;
            case "Delivered":
                console.log("here2");

                if ((req.params.dop !== "null") && (req.params.dod !== "null")) {
                    console.log("here21");
                   query = query.where('oUpdateDate', '>=', dod).where('oUpdateDate', '<', dodPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                } else if ((req.params.dop !== "null") && (req.params.dod === "null")) {
                    console.log("here22");
                     query = query.where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                } else {
                    console.log("here23");
                     query = query.where('oUpdateDate', '>=', dod).where('oUpdateDate', '<', dodPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
               }
                
                break;
            case "Cancelled":
               
                console.log("here3");
                   if ((req.params.dop !== "null")  && (req.params.doc !== "null")) {
                       query =query.where('oUpdateDate', '>=', doc).where('oUpdateDate', '<', docPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                    } else if ((req.params.dop !== "null")  && (req.params.doc === "null")) {
                        query = query.where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                    }else   {
                       query =  query.where('oUpdateDate', '>=', doc).where('oUpdateDate', '<', docPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                   }
                   break;
        
            default:
                break;
       }
        
       const snapshot = await query.get();



       switch (req.params.status) {
        case "Open": {
         let orders= [];
         snapshot.forEach(docu => {
              let orderData = docu.data();
              orders.push({orderData});
         });
     
     
         res.status(200).send(JSON.stringify({message,orders}));
     }
             
              
         break;
        case "Delivered": {
         let orders= []; 
         snapshot.forEach(docu => {
             let orderData= docu.data();
             if ((req.params.dop !== "null")) {
                 if ((orderData['oDop'] >= dop) &&  (orderData['oDop'] < dopPlusOne)) {
                     orders.push({ orderData });
  
                 } 
             } else {
                 orders.push({ orderData });
             }
            
             
         });
         res.status(200).send(JSON.stringify({message,orders}));
     }
        
         break;
        case "Cancelled": {
         let orders= [];
         snapshot.forEach(docu => {
             let orderData = docu.data();
             if ((req.params.dop !== "null")) {
                 if ((orderData['oDop'] >= dop) && (orderData['oDop'] < dopPlusOne)) {
                     orders.push({orderData});
                 }
             }else {
                 orders.push({orderData});

             }
             
            
             
         });
         res.status(200).send(JSON.stringify({message,orders}));
         
     }
        
            break;
 
     default:
         break;
}
    
     
 
    } catch (error) {
        console.error("Error getting Orders: ", error);
        let message = "Error getting Orders";
        res.status(500).send(JSON.stringify({message,orders:null}));
    }
 
 
});


router.get("/getOrderByFilterByUserID/dop/:dop?/dod/:dod?/doc/:doc?/trackingStatus/:trackingStatus?/status/:status/userId/:userId", async (req, res) => { 
 
    var dop = parseInt(req.params.dop);
    var dopPlusOne = parseInt(req.params.dop) + 86400000;

    var dod = parseInt(req.params.dod);
    var dodPlusOne = parseInt(req.params.dod) + 86400000;

    var doc = parseInt(req.params.doc);
    var docPlusOne = parseInt(req.params.doc) + 86400000;

    try {
        let message = "getOrderByFilterByUserID";

 
        var query = admin.firestore().collection('orders')


        
        switch (req.params.status) {
            case "Open":       
            console.log("here11");

                if (req.params.dop !== "null" && req.params.trackingStatus !== "null") { 
                    console.log("here1");
                    query = query.where('oDop', '>=', dop).where('oDop', '<', dopPlusOne).where('oTrackingStatus', '==', req.params.trackingStatus).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
                } else if ((req.params.dop !== "null")  && (req.params.trackingStatus === "null")) {
                    query = query.where('oDop', '>=', dop).where('oDop', '<', dopPlusOne).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
                }else   {
                   query = query.where('oTrackingStatus', '==', req.params.trackingStatus).where('oStatus', '==', req.params.status).orderBy('oDop', 'desc');
               }           
                
                break;
            case "Delivered":
                console.log("here2");

                if ((req.params.dop !== "null") && (req.params.dod !== "null")) {
                    console.log("here21");
                   query = query.where('oUpdateDate', '>=', dod).where('oUpdateDate', '<', dodPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                } else if ((req.params.dop !== "null") && (req.params.dod === "null")) {
                    console.log("here22");
                     query = query.where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                } else {
                    console.log("here23");
                     query = query.where('oUpdateDate', '>=', dod).where('oUpdateDate', '<', dodPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
               }
                
                break;
            case "Cancelled":
               
                console.log("here3");
                   if ((req.params.dop !== "null")  && (req.params.doc !== "null")) {
                       query =query.where('oUpdateDate', '>=', doc).where('oUpdateDate', '<', docPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                    } else if ((req.params.dop !== "null")  && (req.params.doc === "null")) {
                        query = query.where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                    }else   {
                       query =  query.where('oUpdateDate', '>=', doc).where('oUpdateDate', '<', docPlusOne).where('oStatus', '==', req.params.status).orderBy('oUpdateDate', 'desc');
                   }
                   break;
        
            default:
                break;
       }
        
       const snapshot = await query.where('oUserID', '==', req.params.userId).get();



       switch (req.params.status) {
           case "Open": {
            let orders= [];
            snapshot.forEach(docu => {
                 let orderData = docu.data();
                 orders.push({orderData});
            });
        
        
            res.status(200).send(JSON.stringify({message,orders}));
        }
                
                 
            break;
           case "Delivered": {
            let orders= []; 
            snapshot.forEach(docu => {
                let orderData= docu.data();
                if ((req.params.dop !== "null")) {
                    if ((orderData['oDop'] >= dop) &&  (orderData['oDop'] < dopPlusOne)) {
                        orders.push({ orderData });
     
                    } 
                } else {
                    orders.push({ orderData });
                }
               
                
            });
            res.status(200).send(JSON.stringify({message,orders}));
        }
           
            break;
           case "Cancelled": {
            let orders= [];
            snapshot.forEach(docu => {
                let orderData = docu.data();
                if ((req.params.dop !== "null")) {
                    if ((orderData['oDop'] >= dop) && (orderData['oDop'] < dopPlusOne)) {
                        orders.push({orderData});
                    }
                }else {
                    orders.push({orderData});

                }
                
               
                
            });
            res.status(200).send(JSON.stringify({message,orders}));
            
        }
           
               break;
    
        default:
            break;
   }
    
     
 
    } catch (error) {
        console.error("Error getting Orders: ", error);
        let message = "Error getting Orders";
        res.status(500).send(JSON.stringify({message,orders:null}));
    }
 
});


router.get('/getOrdersOnlyByType/:type', async (req, res) => {
     
    try {
        const snapshot =await admin.firestore().collection('orders').where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').get();
        let orders = [];
        let message = "getOrdersByType";
          snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          });
        res.status(200).send(JSON.stringify({message,orders}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
});
 

module.exports = router;
