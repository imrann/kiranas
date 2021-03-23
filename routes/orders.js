 const orderController = require('./../controllers/orderController');

const express = require('express');
var router = express.Router();
const cors = require('cors');
  
   
router.use(cors({ origin: true }));

//routes


router.post('/createOrder/:transactionMode', orderController.createOrder);

router.get('/getAllOrders',orderController.getAllOrders );

router.get("/getOrderByFilter/dop/:dop?/dod/:dod?/doc/:doc?/trackingStatus/:trackingStatus?/status/:status",orderController.getOrderByFilter);

router.get("/getOrderByFilterByUserID/dop/:dop?/dod/:dod?/doc/:doc?/trackingStatus/:trackingStatus?/status/:status/userId/:userId", orderController.getOrderByFilterByUserID);

router.get('/getOrdersByType/:userId/:type', orderController.getOrdersByType);

router.get('/getPaginatedOrdersByType/:userId/:type/:lastSnapshotOrderID/:lastSnapshotUpdateDate', orderController.getPaginatedOrdersByType);

router.get('/getOrdersOnlyByType/:type',orderController.getOrdersOnlyByType);

router.get('/getPaginatedOrdersOnlyByType/:type/:lastSnapshotOrderID/:lastSnapshotUpdateDate', orderController.getPaginatedOrdersOnlyByType);

router.get('/getTotalOrdersByType/:type', orderController.getTotalOrdersByType);


 

module.exports = router;
