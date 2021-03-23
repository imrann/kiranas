 const express = require('express');
const adminController = require('./../controllers/adminController');

var router = express.Router();
const cors = require('cors');
  
  
router.use(cors({ origin: true }));

 



router.put('/addAdmin/:phone', adminController.addAdmin);

router.delete('/deleteAdmin/:phone',adminController.deleteAdmin);


module.exports = router;
