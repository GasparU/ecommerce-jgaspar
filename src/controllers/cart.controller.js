const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
    const user = req.user
    const results = await Cart.findAll({
        include: [
            {
                model: Product,
                include: [Category, ProductImg]
            }
        ], // 1. Trae todos los productos que se han comprado (post) 
        where: {userId: user.id}  // 2. Detecta el uduario registrado. Por eso trae los productos solo de el usuario registrado. Pero en postman, un get all traera elementos vacios, por lo que debemos modificar el Create.
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id  // 3. Con el usuario asignado al momento de crear, ya se puede hacer peticiones get all de productos solo de ese usuario registrado, sino en postman en Post, traera el userId = null. De ahí la importancia de registrar el usuario conjuntamente con la cantidad (quantity) y el producto (productId). Al crear, tanto quantity, productId pasarán a ese usuario registrado.
    const {quantity, productId} = req.body
    const body = {userId, quantity, productId}
    const result = await Cart.create(body);
    return res.status(201).json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const userId = req.user.id   // 4. se trae el usuario registrado (logeado) en base a su id.
    const result = await Cart.destroy({ where: {
        id, 
        userId  // 5. para poder eliminar un cart, se pasa por parámetro adicionalmente el userId del usuario logeado, a fin de que otro usuario logeado no pueda eliminar un cart de un usuario logeado distinto. (recordar que es userId : userId, pero se reduce a userId.)
    } });
    if(!result) res.sendStatus(404)
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    delete req.body.userId
    delete req.body.productId
    const result = await Cart.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = { 
    getAll,
    create,
    remove,
    update
}