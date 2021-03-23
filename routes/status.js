 const express = require('express');
const statusController = require('./../controllers/statusController');

var router = express.Router();
const cors = require('cors');
  
  
router.use(cors({ origin: true }));

//routes
router.put("/updateOrderStatus/:orderID/:status/:est?", statusController.updateOrderStatus);
 


module.exports = router;
