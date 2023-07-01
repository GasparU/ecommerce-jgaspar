const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const fs = require('fs');
const path = require('path');


const getAll = catchError(async(req, res) => {
    const result = await ProductImg.findAll()
    return res.json(result)
});

const create = catchError(async(req, res) => {
    const url = req.protocol + "://" + req.headers.host + "/uploads/" + req.file.filename; // req.protocol = http o https (segun sea el render o cualquier otro espacio de alojamiento)   // req.headers.host = localhost:8080  // req.file.filename = archivo.jpg
    console.log(req.protocol)
	const filename = req.file.filename;

    const body = {url, filename}
    const result = await ProductImg.create(body);
    return res.status(201).json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const image = await ProductImg.findByPk(id);
		if(!image) return res.sendStatus(404);
    fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', image.filename));
    await image.destroy();
    return res.sendStatus(204);
});



module.exports = {
    getAll,
    create,
    remove
}