const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
 
  
router.use(cors({ origin: true }));

let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();
 
var todaysDate =  date + "-" + month + "-" + year;


router.put("/updateOrderStatus/:orderID/:status/:est?", async (req, res) => {
    var o_TrackingStatus;
    var o_Status;
    var o_EstDelivaryTime;
    var t_Status;


    switch(req.params.status) {
            case "Placed":
                o_TrackingStatus = "Placed";
                o_Status = "Open";
            o_EstDelivaryTime = "will be given by owner after accepting the order";
            t_Status = "Pending";
             break;
            case "Accepted":
                o_TrackingStatus = "Accepted";
                o_Status = "Open";
            o_EstDelivaryTime = req.params.est;
            t_Status = "Pending";
            break;
            case "Out for Delivary":
                o_TrackingStatus = "Out for Delivary";
                o_Status = "Open";
            o_EstDelivaryTime = "will be delivered today ,Please call owner";
            t_Status = "Pending";
            break;
            case "Delivered":
                o_TrackingStatus = "Delivered";
                o_Status = "Delivered";
            o_EstDelivaryTime = "";
            t_Status = "Completed";
            break;
            case "Cancelled by owner":
                o_TrackingStatus = "Cancelled by owner";
                o_Status = "Cancelled";
            o_EstDelivaryTime = "";
            t_Status = "Cancelled";
            break;
            case "Cancelled by user":
                o_TrackingStatus = "Cancelled by user";
                o_Status = "Cancelled";
            o_EstDelivaryTime = "";
            t_Status = "Cancelled";
                break;
        default:
            o_TrackingStatus = "c";
            o_Status = "a";
            o_EstDelivaryTime = "d";
            t_Status = "";

    }     
   
    try {
        await  admin.firestore().collection('orders').doc(req.params.orderID).set({ "o_Status": o_Status, "o_TrackingStatus": o_TrackingStatus, "o_EstDelivaryTime": o_EstDelivaryTime }, { merge: true })

        const tdocRef = await admin.firestore().collection('transactions').where('t_OrderID', '==', req.params.orderID).get()
        
        await admin.firestore().collection('transactions').doc(tdocRef.docs[0].id).set({"t_Status": t_Status,"t_UpdationDate":todaysDate},{merge:true})
        res.status(200).send();
    
} catch (error) {
    console.error("Error updating status: ", error);

res.status(500).send();

}
   

    
  });
 


module.exports = router;
