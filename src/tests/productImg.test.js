const request = require('supertest')
const app = require('../app')
const path = require('path')
const BASE_URL_USERS = '/api/v1/users/login'
const BASE_URL_PRODUCT_IMG = '/api/v1/product_images'
let TOKEN
let productImgid

beforeAll(async()=>{
    const user = {
        email: "mayra@mayra.com",
        password: "123456"
    }

    const res = await request(app)
        .post(BASE_URL_USERS)
        .send(user)

    TOKEN = res.body.token
            
})

test("POST -> 'BASE_URL_PRODUCT_IMG' should return status code 201 and rest.body.url and res.body.filename to be defined",async()=>{
    const imagePath = path.join(__dirname, '..','public','cocina.jpg')


    const res = await request(app)
        .post(BASE_URL_PRODUCT_IMG)
        .set("Authorization", `Bearer ${TOKEN}`)
        .attach('image',imagePath )


    productImgid = res.body.id
    expect(res.status).toBe(201)
    expect(res.body.url).toBeDefined()
    expect(res.body.filename).toBeDefined()
})

test("GET -> 'BASE_URL_PRODUCT_IMG', sholud status code 200 and res.body.length === 1", async()=>{

    const res = await request(app)
        .get(BASE_URL_PRODUCT_IMG)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)

})

test("DELETE ->'BASE_UR' should status code 200 and res.body.length ===1   ",async()=>{

    const res = await request(app)
        .delete(`${BASE_URL_PRODUCT_IMG}/${productImgid}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

})