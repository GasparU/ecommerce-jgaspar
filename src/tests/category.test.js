const request = require('supertest')
const app = require('../app')

const BASE_URL_USERS = '/api/v1/users/login'
const BASE_URL = '/api/v1/categories'
let TOKEN
let categoryId

beforeAll(async()=>{
    const user = {
        email: "mayra@mayra.com",
        password: "123456",
    }
    const res = await request(app)
        .post(BASE_URL_USERS)
        .send(user)

    TOKEN = res.body.token
})

test("POST ->'BASE_URL', should return status 201 and res.body.name === body.name ", async()=>{
    const category = {
        name: "computers"
    }

    const res = await request(app)
        .post(BASE_URL)
        .send(category)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(201)
    expect(res.body.name).toBe(category.name)
})

test("GET -> 'BASE_URL' should return status 200 and res.body.length === 1", async()=>{
    const res = await request(app)
        .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
})