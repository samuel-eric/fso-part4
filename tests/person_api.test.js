const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = blogObjects.map((blogObj) => blogObj.save())
	await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('number of blogs returned is the same as initialBlogs length', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body.length).toBe(helper.initialBlogs.length)
})

afterAll(async () => {
	await mongoose.connection.close()
})
