 
const admin = require('firebase-admin');


exports.getAllUsers = async (req, res) => {
    const snapshot = await admin.firestore().collection('users').get();
    let users = [];
    snapshot.forEach(doc => {   
      let userID = doc.id;
      let userData = doc.data();
      users.push({userID,userData});
    });
    res.status(200).send(JSON.stringify(users));
}

exports.getUserById = async (req, res) => {
    try {
        const snapshot = await
        admin.firestore().collection('users').doc(req.params.id).get();
        let message = "getUserById";
        const userID = snapshot.id;
        const userData = snapshot.data();
        res.status(200).send(JSON.stringify({message,userData}));
    } catch (error) {
        console.error("Error getting User: ", error);
        let message = "Error getting User";
        res.status(500).send(JSON.stringify({message,userData:null}));
    }
   
}

exports.isUserAdmin = async (req, res) => {
    let message;
    let adminUserData;
    let admins = [];
    try {
        const snapshot = await
        admin.firestore().collection('admin').where("phoneNumber", "==", req.params.phoneNumber).get();
        
        snapshot.forEach(doc => {
         
          let adminsDetails = doc.data();
          admins.push(adminsDetails);
        });

        if (admins.length !== 0) {
            message = true;
            adminUserData = admins;
        } else {
            message = false;
            adminUserData = null;
        }
     
        res.status(200).send(JSON.stringify({message,adminUserData}));
    } catch (error) {
        console.error("Error checking isUserAdmin: ", error);
        let message = "Error checking isUserAdmin";
        res.status(500).send(JSON.stringify({message,adminUserData:null}));
    }
   
}

exports.createUser =  async (req, res) => {
    const user = req.body;
    try {
        await admin.firestore().collection('users').doc(req.params.userID).set(user);
        let message = "User Created"
        res.status(201).send(JSON.stringify({message,userData:user}));
    } catch (error){
        console.error("Error adding User: ", error);
        let message = "Error Creating User";
        res.status(500).send(JSON.stringify({message,userData:null}));
  }
    
}

exports.saveDeviceToken = async (req, res) => {
    const tokenDetails = req.body;

    try {
        await admin.firestore().collection(req.params.tokenCategory).add(tokenDetails);
        let message = "token Added"
        res.status(201).send(JSON.stringify({message}));
    } catch (error){
        console.error("Error adding token: ", error);
        let message = "Error adding token";
        res.status(500).send(JSON.stringify({message}));
  }
    
}

exports.getDeviceToken = async (req, res) => {
     
    try {
        const snapshot=  await admin.firestore().collection('deviceTokens').where('tokenDetails.userID', '==', req.params.userID).get();
        let message = "getDeviceToken"
        let token = [];
        snapshot.forEach(doc => {
          let docID = doc.id;
          let tokenData = doc.data();
          token.push({docID,tokenData});
        });
        res.status(201).send(JSON.stringify({message,token}));
    } catch (error){
        console.error("Error getting token: ", error);
        let message = "Error getting token";
        res.status(500).send(JSON.stringify({message,token:null}));
  }
    
}

exports.isUserPresent = async (req, res) => {

    const snapshot= await
        admin.firestore().collection('users').where('userPhone', '==', req.params.userPhoneNumber).get();
    console.log(req.params.userPhoneNumber);
    let users = [];
    snapshot.forEach(doc => {
      let userID = doc.id;
      let userData = doc.data();
      users.push({userID,userData});
    });
    if (users.length < 1) {
        console.log('new User');
         res.status(200).send(JSON.stringify({ isUserPresent:false }));
    } else {
        console.log('old User');
        res.status(200).send(JSON.stringify({ isUserPresent:true}));
    }
 
}

exports.updateAddress =  async (req, res) => {
    const body = req.body;

    try {
        await 
        admin.firestore().collection('users').doc(req.params.id).set({"userAddress": body},{merge:true});
        let message = "Address Updated"
        res.status(201).send(JSON.stringify({message,userData:body}));
    } catch (error){
        console.error("Error Updating Address: ", error);
        let message = "Error Updating Address";
        res.status(500).send(JSON.stringify({message,userData:null}));
  }
    
    res.status(200).send();
  }