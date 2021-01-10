const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
const { merge } = require('./users');
 
  
router.use(cors({ origin: true }));
 
  
//create a new product
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/createProduct
 
router.post('/createProduct', async (req, res) => {

    const product = req.body;
    await admin.firestore().collection('products').add(product).then(async function(docRef){
        await admin.firestore().collection('products').doc(docRef.id).set({ "productID": docRef.id }, { merge: true }).then(async function () {
            var docID = docRef.id;
            await admin.firestore().collection('productsCount').doc("productsCount123").update({ productsCountList:admin.firestore.FieldValue.arrayUnion({ productID: docRef.id, productQty: product["productQty"] })});
         });
      }).catch(function(error) {
        console.error("Error adding product: ", error);
    });
    res.status(201).send();
});

//get All Products
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllProducts

router.get('/getAllProducts', async (req, res) => {
    const snapshot = await admin.firestore().collection('products').get();
    let products = [];
    snapshot.forEach(doc => {   
      let productID = doc.id;
      let productData = doc.data();
      products.push({productID,productData});
    });
    res.status(200).send(JSON.stringify(products));
});

//discontinue or continue products
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/deleteProduct/<productID>

router.put("/deleteProduct/:id", async (req, res) => {
    const actionOnProduct = req.body["discontinue"];

    await 
        admin.firestore().collection('products').doc(req.params.id).set({"discontinue": actionOnProduct},{merge:true});
    res.status(200).send();
});
  
//upfate product by productID
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProduct/<productID>
router.put("/updateProduct/:id", async (req, res) => {
    const body = req.body;
     await 
        admin.firestore().collection('products').doc(req.params.id).set(body,{merge:true});
    res.status(200).send();
});
  

router.get("/getProductByName/:productName/:productLimit", async (req, res) => {
 
    const snapshot = await
        admin.firestore().collection('products').orderBy('productName').startAt(req.params.productName.toUpperCase()).endAt(req.params.productName.toUpperCase() + "\uf8ff").get();
    //where('productName', '==', req.params.productName)
    let products = [];
    snapshot.forEach(doc => {
        let productID = doc.id;
        let productData = doc.data();
        products.push({ productID, productData });
    });
    res.status(200).send(JSON.stringify(products));
});


//search product by product name
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getProductByName/<productname>/<productLimit>

router.get("/getProductByName/:productName/:productLimit", async (req, res) => {
 
    const snapshot = await
        admin.firestore().collection('products').orderBy('productName').startAt(req.params.productName.toUpperCase()).endAt(req.params.productName.toUpperCase() + "\uf8ff").get();
    //where('productName', '==', req.params.productName)
    let products = [];
    snapshot.forEach(doc => {
        let productID = doc.id;
        let productData = doc.data();
        products.push({ productID, productData });
    });
    res.status(200).send(JSON.stringify(products));
});
  
 
  //getAll product category
  //http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllproductCategory

router.get("/getAllproductCategory", async (req, res) => {
 
    const snapshot = await
        admin.firestore().collection('productCategory').get();
    //where('productName', '==', req.params.productName)
    let productCategory = [];
    snapshot.forEach(doc => {
        let productCategoryData = doc.data();
        productCategory.push(productCategoryData);
    });
    res.status(200).send(productCategory[0]['productCategory']);
});

//update product category
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>

router.put("/updateProductCategory/:productCategory", async (req, res) => {
    await
        admin.firestore().collection('productCategory').doc('productCategory123').update({
            productCategory: admin.firestore.FieldValue.arrayUnion(req.params.productCategory)
        });
    res.status(200).send();
});


//get product by productCategory
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>
router.get("/getProductByCategory/:productCategory", async (req, res) => {
 
    const snapshot = await
        admin.firestore().collection('products').where('productCategory','==',req.params.productCategory).get();
    //where('productName', '==', req.params.productName)
    let products= [];
    snapshot.forEach(doc => {
        let productData = doc.data();
        products.push(productData);
    });


    res.status(200).send(JSON.stringify(products));
});





  
module.exports = router;

 
