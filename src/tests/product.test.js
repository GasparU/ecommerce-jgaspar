const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
require('../models')

const BASE_URL_USERS = '/api/v1/users/login'
const BASE_URL_PRODUCTS = '/api/v1/products'
let TOKEN

let category
let productId

beforeAll(async()=>{
    const user = {
        email: "mayra@mayra.com",
        password: "123456"
    }

    const res = await request(app)
        .post(`${BASE_URL_USERS}`)
        .send(user)
    
    TOKEN = res.body.token
})

test("POST -> 'BASE_URL' should return status code 201 and rest.body.title === body.title", async()=>{
    
    const categoryBody = {
        name: "Tech"
    }

    category = await Category.create(categoryBody)

    const product = {
        title: "Xiaomi12",
        description: "lorem12",
        price: "189.98",
        categoryId : category.id
    }

    const res = await request(app)
        .post(BASE_URL_PRODUCTS)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)

        productId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body.title).toBe(product.title)

})

test("GET ->'BASE_UR' should status code 200 and res.body.length ===1 to be defined",async()=>{
    const res = await request(app)
        .get(BASE_URL_PRODUCTS)


    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toBeDefined()
})

test("GET ->'BASE_UR?category = category.id' should status code 200 and res.body.length ===1 to be defined",async()=>{
    const res = await request(app)
        .get(`${BASE_URL_PRODUCTS}?category=${category.id}`)


    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toBeDefined()
})

test("GET ONE ->'BASE_UR' should status code 200 and res.body.length === body.title   ",async()=>{
    const res = await request(app)
        .get(`${BASE_URL_PRODUCTS}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe("Xiaomi12")
})

test("PUT ->'BASE_UR' should status code 204",async()=>{
    const product = {
        title: "Samsung"
    }

    const res = await request(app)
        .put(`${BASE_URL_PRODUCTS}/${productId}`)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe(product.title)
})

test("DELETE ->'BASE_UR' should status code 200 and res.body.length ===1   ",async()=>{

    const res = await request(app)
        .delete(`${BASE_URL_PRODUCTS}/${productId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
    await category.destroy()
})