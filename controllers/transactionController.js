 
const admin = require('firebase-admin');

 


exports.getAllTransactions = async (req, res) => {
 
    try {
        const snapshot =await admin.firestore().collection('transactions').orderBy('t_UpdationDate','desc').get();
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
}