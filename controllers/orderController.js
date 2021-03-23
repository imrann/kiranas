 
const admin = require('firebase-admin');



exports.createOrder = async (req, res) => {
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
  
     

}

exports.getAllOrders = async (req, res) => {
    const order = req.body;
      await admin.firestore().collection('orders').add(order);
      let orders = [];
      snapshot.forEach(doc => {   
        
        let orderData = doc.data();
        orders.push({userID,userData});
      });
      res.status(200).send(JSON.stringify(orders));
}

exports.getOrderByFilter = async (req, res) => { 

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
 
 
}

exports.getOrderByFilterByUserID = async (req, res) => { 
 
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
 
}

exports.getOrdersByType = async (req, res) => {
     
    try {
        const snapshot =await admin.firestore().collection('orders').where('oUserID','==',req.params.userId).where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').orderBy('orderID','desc').limit(8).get();
        let orders = [];
        let message = "getOrdersByType";
        let lastOrderID;
        let lastOUpdateDate;
        if (!snapshot.empty) {
            lastOrderID = snapshot.docs[snapshot.docs.length - 1].data().orderID;
        lastOUpdateDate = snapshot.docs[snapshot.docs.length - 1].data().oUpdateDate;
      }
          snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          });
        res.status(200).send(JSON.stringify({message,lastOrderID,lastOUpdateDate,orders}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
}

exports.getPaginatedOrdersByType = async (req, res) => {
    const startAfterOrderID = req.params.lastSnapshotOrderID;
    const startAfterUpdateDate = parseInt(req.params.lastSnapshotUpdateDate);

    try {
        const snapshot =await admin.firestore().collection('orders').where('oUserID','==',req.params.userId).where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').orderBy('orderID','desc').startAfter(startAfterUpdateDate,startAfterOrderID).limit(8).get();
        let orders = [];
        let message = "getPaginatedOrdersByType";
        let lastOrderID;
        let lastOUpdateDate;
        if (!snapshot.empty) {
            lastOrderID = snapshot.docs[snapshot.docs.length - 1].data().orderID;
        lastOUpdateDate = snapshot.docs[snapshot.docs.length - 1].data().oUpdateDate;
      }
          snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          });
        res.status(200).send(JSON.stringify({message,lastOrderID,lastOUpdateDate,orders}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
}

exports.getOrdersOnlyByType = async (req, res) => {
     
    try {
        const snapshot =await admin.firestore().collection('orders').where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').orderBy('orderID','desc').limit(8).get();
        let orders = [];
        let message = "getOrdersOnlyByType";
        let lastOrderID;
        let lastOUpdateDate;
        if (!snapshot.empty) {
            lastOrderID = snapshot.docs[snapshot.docs.length - 1].data().orderID;
        lastOUpdateDate = snapshot.docs[snapshot.docs.length - 1].data().oUpdateDate;
      }
 

           snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          }); 
          
        res.status(200).send(JSON.stringify({message,lastOrderID,lastOUpdateDate,orders}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
}

exports.getPaginatedOrdersOnlyByType = async (req, res) => {
    const startAfterOrderID = req.params.lastSnapshotOrderID;
    const startAfterUpdateDate = parseInt(req.params.lastSnapshotUpdateDate);

    try {
        const snapshot =await admin.firestore().collection('orders').where('oStatus','==',req.params.type).orderBy('oUpdateDate','desc').orderBy('orderID','desc').startAfter(startAfterUpdateDate,startAfterOrderID).limit(8).get();
        let orders = [];
        let lastOrderID;
        let lastOUpdateDate;
        let message = "getPaginatedOrdersOnlyByType";
        if (!snapshot.empty) {
              lastOrderID = snapshot.docs[snapshot.docs.length - 1].data().orderID;
          lastOUpdateDate = snapshot.docs[snapshot.docs.length - 1].data().oUpdateDate;
        }
        
          snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
          });
        res.status(200).send(JSON.stringify({message,lastOrderID,lastOUpdateDate,orders}));
    } catch (error) {
        console.error("Error getting Paginated orders: ", error);
        let message = "Error getting Paginated orders";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
}

exports.getTotalOrdersByType = async (req, res) => {
     
    try {
        const snapshot =await admin.firestore().collection('orders').where('oStatus','==',req.params.type).get();
        let orders = [];
        let message = "getTotalOrdersByType";
 
           snapshot.forEach(doc => {   
            
            let orderData = doc.data();
            orders.push({orderData});
           });
        let ordersLength = orders.length;
          
        res.status(200).send(JSON.stringify({message,ordersLength}));
    } catch (error) {
        console.error("Error getting orders: ", error);
        let message = "Error getting orders";
        res.status(500).send(JSON.stringify({message,ordersLength:null}));
    }
}