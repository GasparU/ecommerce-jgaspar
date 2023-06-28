const sequelize = require('../utils/connection');
const user = require('./createData/user')
require('../models/Category')

const main = async() => {
    try{
        await sequelize.sync({ force: true });
        await user()
        console.log("Me ejecute :D ")
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();