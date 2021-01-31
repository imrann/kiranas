const functions = require('firebase-functions');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const admin = require('firebase-admin');
const { merge } = require('./users');
 
  
router.use(cors({ origin: true }));

let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();
 
var todaysDate =  date + "-" + month + "-" + year;
 
  
//create a new product
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/createProduct
 
router.post('/createProduct', async (req, res) => {

    const product = req.body; 
    

    try {
        const docRef = await admin.firestore().collection('products').add(product)
        const productsUpdatedData = await admin.firestore().collection('products').doc(docRef.id).set({ "productID": docRef.id }, { merge: true })
      // const  productsCountData = await admin.firestore().collection('productsCount').doc("productsCount123").update({ productsCountList:admin.firestore.FieldValue.arrayUnion({ productID: docRef.id, productQty: product["productQty"] })})
        res.status(201).send();
    } catch (error) {
        console.error("Error adding product: ", error);

        res.status(500).send();

    }
  
    

    
});

//get All Products
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllProducts

router.get('/getAllProducts', async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('products').get();
        let products = [];
        let message = "getAllProducts";

        snapshot.forEach(doc => {   
          let productID = doc.id;
          let productData = doc.data();
          products.push({productID,productData});
        });
        res.status(200).send(JSON.stringify({message,result:products}));
    } catch (error) {
        console.error("Error getting User: ", error);
        let message = "Error getting Products";
        res.status(500).send(JSON.stringify({message,result:null}));
    }
  
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
 
    try {
        const snapshot = await
        admin.firestore().collection('products').orderBy('productName').startAt(req.params.productName.toUpperCase()).endAt(req.params.productName.toUpperCase() + "\uf8ff").get();
        let products = [];
        let message = "getProductByName";

    snapshot.forEach(doc => {
        let productID = doc.id;
        let productData = doc.data();
        products.push({ productID, productData });
    });
    res.status(200).send(JSON.stringify({message,result:products}));
    } catch (error) {
        console.error("Error getting Product by name: ", error);
        let message = "Error getting Products";
        res.status(500).send(JSON.stringify({message,result:null}));
    }
   
});





  
 
  //categoryFilterName
  //http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllproductCategory

router.get("/getAllproductCategory/:categoryFilterName", async (req, res) => {
    try {       
    let message = "success getting productFilterList";
    const snapshot = await
            admin.firestore().collection('productCategory').doc(req.params.categoryFilterName).get();
         const productFilterList = snapshot.data();
         
       
        res.status(200).send(JSON.stringify({message, productFilterList}));

    } catch (error) {
        console.error("Error getting productFilterList", error);
        let message = "Error getting productFilterList";
        res.status(500).send(JSON.stringify({message,productFilterList:null}));
    }

});

//update product category
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>

router.put("/updateProductCategory/:productCategory", async (req, res) => {
    await
        admin.firestore().collection('productCategory').doc('productCategoryList').update({
            productCategoryList : admin.firestore.FieldValue.arrayUnion(req.params.productCategory)
        });
    res.status(200).send();
});


//get product by productCategory
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>
router.get("/getProductByCategory/:productCategory?/:productDiscount?", async (req, res) => { 
 
   

    try {
        let message = "getAllProducts";

        var ids = req.params.productCategory.split(',');
        console.log(ids);
         
        var filterDiscount = "0";
        if (req.params.productDiscount !== "null") {
            filterDiscount = req.params.productDiscount;
        }
        var query = admin.firestore().collection('products')

        if (req.params.productCategory === "null" ) {
            query = query.where('productOffPercentage', '>=', filterDiscount);
        } else {
            query = query.where('productCategory', 'in', ids)
            .where('productOffPercentage', '>=', filterDiscount);
        }
     
        const snapshot = await query.get();
         let products= [];
        snapshot.forEach(doc => {
            let productID = doc.id;
            let productData = doc.data();
            products.push({productID, productData});
        });
    
    
        res.status(200).send(JSON.stringify({message,result:products}));
    } catch (error) {
        console.error("Error getting Products: ", error);
        let message = "Error getting Products";
        res.status(500).send(JSON.stringify({message,result:null}));
    }





  
 

  
});





  
module.exports = router;

 
