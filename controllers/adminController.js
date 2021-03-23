 const admin = require('firebase-admin');


exports.addAdmin = async (req, res) => {

    await admin.firestore().collection('admin').doc('adminUser').
       update({ adminUserList: admin.firestore.FieldValue.arrayUnion({ adminPhone: req.params.phone, adminRole:true }) });
       
      
   res.status(201).send();
}

exports.deleteAdmin =  async (req, res) => {

    await admin.firestore().collection('admin').doc('adminUser').
       update({ adminUserList: admin.firestore.FieldValue.arrayRemove({ adminPhone: req.params.phone, adminRole:true }) });
       
      
   res.status(201).send();
}