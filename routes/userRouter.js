// MODULES
const express = require('express');
const databaseLayer = require('../model/Database');

// VARIABLES
const router = express.Router();
const dbLayer = new databaseLayer.Database;

// ROUTES
router.post('/signup', (req, res) => {
  dbLayer.signup({
    email: req.body.email,
    password: req.body.password
  }).then(data => res.send(JSON.stringify(data))).catch(console.log);
});

router.post('/signin', (req, res) => {
  dbLayer.signin({
    email: req.body.email,
    password: req.body.password
  }).then(data => res.send(JSON.stringify(data))).catch(console.log);
});

router.post('/logout', (req, res) => {
  res.send(JSON.stringify(dbLayer.logout(req.body.token)));
});

router.post('/isAuth', (req, res) => {
  res.send(JSON.stringify(dbLayer.isAuth(req.body.token)));
});

router.post('/isAdmin', (req, res) => {
  dbLayer.isAdmin(req.body)
    .then(data => res.send(JSON.stringify(data)))
    .catch(console.log);
});

router.post('/checkout', (req, res) => {
  dbLayer.checkout(req.body)
    .then(dbres => res.send(JSON.stringify({ ok: dbres.ok })))
    .catch(console.log);
});

router.post('/getCheckout', (req, res) => {
  dbLayer.getCheckout(req.body.userId)
    .then(data => res.send(JSON.stringify(data)))
    .catch(console.log);
});

router.post('/loginToBackend', (req, res) => {
  dbLayer.signinToBackend(req.body)
    .then(data => res.send(JSON.stringify(data)))
    .catch(console.log)
});

module.exports = router;