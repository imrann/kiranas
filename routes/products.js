 const express = require('express');
const productController = require('./../controllers/productController');
var router = express.Router();
const cors = require('cors');
 
 
 
  
router.use(cors({ origin: true }));

//routes
  
//create a new product
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/createProduct 
router.post('/createProduct', productController.createProduct);

//get All Products
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllProducts
router.get('/getAllProducts',productController.getAllProducts);


//discontinue or continue products
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/deleteProduct/<productID>
router.put("/deleteProduct/:id", productController.deleteProduct);
  
//upfate product by productID
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProduct/<productID>
router.put("/updateProduct/:id",productController.updateProduct);


//getProductByID
router.get("/getProductByID/:productID", productController.getProductByID);
  

router.get("/getProductByName/:productName/:productLimit", productController.getProductByName);


//categoryFilterName
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/getAllproductCategory
router.get("/getAllproductCategory/:categoryFilterName", productController.getAllproductCategory);

//update product category
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>
router.put("/updateProductCategory/:productCategory", productController.updateProductCategory);


//get product by productCategory
//http://localhost:5001/kiranas-c082f/us-central1/kiranas/api/products/updateProductCategory/<productCategory>
router.get("/getProductByCategory/:productCategory?/:productDiscount?", productController.getProductByCategory);





  
module.exports = router;

 
