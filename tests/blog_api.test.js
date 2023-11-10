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

describe('accessing all blogs', () => {
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

	test('there is property named id in blog post', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body[0].id).toBeDefined()
	})
})

describe('adding blog', () => {
	test('a blog can be added', async () => {
		const newBlog = {
			title: 'new blog',
			author: 'new blog author',
			url: 'https://newblog.com',
			likes: 7,
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDB()
		const titles = blogsAtEnd.map((blog) => blog.title)
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
		expect(titles).toContain('new blog')
	})

	test('a blog can be added without input for like property', async () => {
		const newBlog = {
			title: 'new blog without like',
			author: 'new blog author',
			url: 'https://newblog.com',
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDB()
		const titles = blogsAtEnd.map((blog) => blog.title)
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
		expect(titles).toContain('new blog without like')
		expect(blogsAtEnd.find((blog) => blog.title === newBlog.title).likes).toBe(
			0
		)
	})

	test('a blog can not be added without title', async () => {
		const newBlog = {
			author: 'author without title',
			url: 'https://newblog.com',
			likes: 7,
		}

		await api.post('/api/blogs').send(newBlog).expect(400)

		const blogsAtEnd = await helper.blogsInDB()
		const authors = blogsAtEnd.map((blog) => blog.author)
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		expect(authors).not.toContain(newBlog.author)
	})

	test('a blog can not be added without url', async () => {
		const newBlog = {
			title: 'new blog without url',
			author: 'author without url',
			likes: 7,
		}

		await api.post('/api/blogs').send(newBlog).expect(400)

		const blogsAtEnd = await helper.blogsInDB()
		const titles = blogsAtEnd.map((blog) => blog.title)
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		expect(titles).not.toContain(newBlog.title)
	})
})

describe('delete a blog', () => {
	test('a blog can be deleted if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDB()
		const blogToBeDeleted = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204)

		const blogsAtEnd = await helper.blogsInDB()
		const titles = blogsAtEnd.map((blog) => blog.title)
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
		expect(titles).not.toContain(blogToBeDeleted.title)
	})
})

describe('update a blog', () => {
	test('a blog can be updated if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDB()
		const blogToBeUpdated = blogsAtStart[0]
		const updateBlog = { ...blogToBeUpdated, likes: 100 }

		await api
			.put(`/api/blogs/${blogToBeUpdated.id}`)
			.send(updateBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDB()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		expect(
			blogsAtEnd.find((blog) => blog.id === blogToBeUpdated.id).likes
		).toBe(100)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
