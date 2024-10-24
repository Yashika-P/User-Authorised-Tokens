const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

require('dotenv').config();

const posts = [
    {
        name: "Yashika",
        title: "post 1"
    },
    {
        name: "Kalai",
        title: "post 2"
    }
];

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN); 
    
    res.json({ accessToken: accessToken })

})

app.get("/posts",authenticateToken, (req, res) => {
    //console.log(req.user.name);
    res.json(posts.filter(post => post.name === req.user.name));
})
app.listen(3000);