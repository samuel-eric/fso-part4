const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
	if (!request.body.title || !request.body.url) {
		response.status(400).end()
	} else {
		const blog = new Blog({ ...request.body, likes: request.body.likes || 0 })
		const result = await blog.save()
		response.status(201).json(result)
	}
})

blogRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	await Blog.findByIdAndDelete(id)
	response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const body = request.body

	const updatedNote = await Blog.findByIdAndUpdate(id, body, {
		new: true,
	})
	response.json(updatedNote)
})

module.exports = blogRouter
