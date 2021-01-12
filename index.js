const functions = require("firebase-functions");
const express = require('express');
const app = express();
const admin = require('firebase-admin');
admin.initializeApp();
 
 
var users = require('./users.js');
var products = require('./products.js');
var orders = require('./orders.js');
var status = require('./status.js');
var admins = require('./admins.js');



app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/status', status);
app.use('/api/admins', admins);

    
exports.kiranas= functions.https.onRequest(app); 


 

 
