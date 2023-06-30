const { getAll, create } = require('../controllers/purchase.controller');
const express = require('express');
const veridyJWT = require('../utils/verifyJWT')

const routerPurchase = express.Router();

routerPurchase.route('/')
    .get(veridyJWT, getAll)
    .post(veridyJWT, create);

module.exports = routerPurchase;