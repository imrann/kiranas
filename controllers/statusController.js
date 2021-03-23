  
const admin = require('firebase-admin');



exports.updateOrderStatus = async (req, res) => {
    var oTrackingStatus;
    var oStatus;
    var oEstDelivaryTime;
    var t_Status;

    const now = new Date()  
const todaysDate = Math.round(now.getTime())
 

    switch(req.params.status) {
            case "Placed":
                oTrackingStatus = "Placed";
                oStatus = "Open";
            oEstDelivaryTime = "Waiting for order acceptance";
            t_Status = "Pending";
             break;
            case "Accepted":
                oTrackingStatus = "Accepted";
                oStatus = "Open";
            oEstDelivaryTime = req.params.est;
            t_Status = "Pending";
            break;
            case "Out for Delivery":
                oTrackingStatus = "Out for Delivery";
                oStatus = "Open";
            oEstDelivaryTime = "Will be delivered today ,Please call owner";
            t_Status = "Pending";
            break;
            case "Delivered":
                oTrackingStatus = "Delivered";
                oStatus = "Delivered";
            oEstDelivaryTime = "";
            t_Status = "Completed";
            break;
            case "Cancelled by owner":
                oTrackingStatus = "Cancelled by owner";
                oStatus = "Cancelled";
            oEstDelivaryTime = "";
            t_Status = "Cancelled";
            break;
            case "Cancelled by user":
                oTrackingStatus = "Cancelled by user";
                oStatus = "Cancelled";
            oEstDelivaryTime = "";
            t_Status = "Cancelled";
                break;
        default:
            oTrackingStatus = "c";
            oStatus = "a";
            oEstDelivaryTime = "d";
            t_Status = "";

    }     
   
    try {
        let message = "status cancelled";

        await  admin.firestore().collection('orders').doc(req.params.orderID).set({ "oStatus": oStatus, "oTrackingStatus": oTrackingStatus, "oEstDelivaryTime": oEstDelivaryTime ,"oUpdateDate":todaysDate}, { merge: true })

        const tdocRef = await admin.firestore().collection('transactions').where('t_OrderID', '==', req.params.orderID).get()
        
        await admin.firestore().collection('transactions').doc(tdocRef.docs[0].id).set({"t_Status": t_Status,"t_UpdationDate":todaysDate},{merge:true})
        res.status(200).send(JSON.stringify({message,result:""}));
    
    } catch (error) {
        let message = "error cancelling status";

    console.error("Error updating status: ", error);

res.status(500).send(JSON.stringify({message,result:""}));

}
   

    
  }