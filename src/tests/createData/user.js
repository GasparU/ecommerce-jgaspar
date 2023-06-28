const User = require('../../models/User')

const user = async ()=> {
    const userCreate={
        firstName: "Mayra",
        lastName: "Calderon",
        email: "mayra@mayra.com",
        password: "123456",
        phone: "123456789"
    }
    await User.create(userCreate)
}

module.exports =user