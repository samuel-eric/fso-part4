const Blog = require('../models/blog')

const initialBlogs = [
	{
		title: 'Test1',
		author: 'Samuel',
		url: 'www.test1.com',
		likes: 22,
	},
	{
		title: 'Test2',
		author: 'Eric',
		url: 'www.test2.com',
		likes: 23,
	},
]

const blogsInDB = async () => {
	const blogs = await Blog.find({})
	return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDB }
