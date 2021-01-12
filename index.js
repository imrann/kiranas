const functions = require("firebase-functions");
const express = require('express');
const app = express();
const admin = require('firebase-admin');
admin.initializeApp();
 
 
var users = require('./users.js');
var products = require('./products.js');
var orders = require('./orders.js');
var status = require('./status.js');



//both index.js and things.js should be in same directory
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/status', status);

    
exports.kiranas= functions.https.onRequest(app); 


 

 
