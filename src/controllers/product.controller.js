const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
    const {category} = req.query
    const where = {}
    if(category) where.categoryId = category
    // si en petición no se pasa query (no filtramos nada) el where es vacio (where = { } ), pero si existe filtrado por query, se convierte en where = {categoryId : 3} (en postman se filtro por id = 3 con '/api/v1/products?category=3'), por ello, podemos reemplazas where : {categoryId : 3} por where : where, y esto a su ves en where.
    console.log(where)
    const results = await Product.findAll({
        include:[Category, ProductImg],
        where                         // where : where  // where:{categoryId:category}   (probar con const pepito ={} en la linea 7 y de para recordar un console.log(pepito o where))
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await Product.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.findByPk(id, {include:[Category, ProductImg]});
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Product.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const setImages = catchError(async(req, res)=>{
    const {id} = req.params  
    const product = await Product.findByPk(id)

    await product.setProductImgs(req.body)
    const images = await product.getProductImgs()

    return res.json(images)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setImages
}