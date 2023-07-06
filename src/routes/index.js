const express = require('express');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const routerCart = require('./cart.router');
const routerPurchase = require('./purchase.router');
const routerProductImg = require('./productImg.router');
const router = express.Router();
const verifyJWT = require('../utils/verifyJWT')

// colocar las rutas aquí
router.use('/users', routerUser)
router.use('/categories', routerCategory)
router.use('/products', routerProduct)
// si todas las peticiones de routerCart (get, post, update, delete) estan protegidas, no hace falta proteger una por una, se protege la principal como aquí con routerCart y routerPurchase.
router.use('/cart', verifyJWT, routerCart)
router.use('/purchase', verifyJWT, routerPurchase)
router.use('/product_images', routerProductImg)


module.exports = router;