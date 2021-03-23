const functions = require("firebase-functions");
const express = require('express');
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const morgan = require('morgan');
 
admin.initializeApp();
 

 
var users = require('./routes/users.js');
var products = require('./routes/products.js');
var orders = require('./routes/orders.js');
var status = require('./routes/status.js');
var admins = require('./routes/admins.js');
var transactions = require('./routes/transactions.js');

 
app.use(cors({ origin: true }));  
app.use(morgan('dev'));

app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/status', status);
app.use('/api/admins', admins);
app.use('/api/transactions', transactions);

app.use((req, res, next) => {
    const error = new Error('Oops! ,Not Found');
    error.status = 404;
    next(error);
    
});



    
exports.kiranas= functions.https.onRequest(app); 


 

 
