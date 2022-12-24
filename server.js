require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username: 'Simon',
        post: "Post1",
        password: 'Passw0rd',
    },{
        username: 'John',
        post: "Post2",
        password: 'penis',
    }
]
app.get('/posts', authenticateToken, (req, res) => {
    // response: posts of authenticated user
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    // authenticate user
    const username = req.body.username
    const user = { name: username}

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ access_token: access_token })

})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    // token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(3000)