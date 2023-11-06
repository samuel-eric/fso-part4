const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
	const likes = blogs.map((blog) => blog.likes)
	const maxLike = Math.max(...likes)
	const result = blogs.find((blog) => blog.likes === maxLike)
	if (result) {
		delete result._id
		delete result.url
		delete result.__v
	}
	return result
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
}
