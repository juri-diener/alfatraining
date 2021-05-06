'use strict';
// MODULES
const express = require('express');

// IMPORTS
const databaseLayer = require('./model/Database');
const productRouter = require('./routes/productRouter.js');
const userRouter = require('./routes/userRouter.js');

// VARIABLES
const server = express();
let dbLayer;

// MIDDLEWARE
server.use(express.static('public', {
  extensions: ['html', 'htm']
}));

server.use(express.json());

// ROUTES
server.use(productRouter);
server.use(userRouter);

// INIT
const init = () => {

  server.listen(80, err => {
    if (err) {
      console.log(err);
      return;
    }

    dbLayer = new databaseLayer.Database('http://admin:couchdb@localhost:5984');
    dbLayer.connect();
    dbLayer.createCollections();

    console.log('server running');
  });

}

// INITIAL CALL
init();