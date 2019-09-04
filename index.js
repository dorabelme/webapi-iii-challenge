// code away!
const express = require('express');

const userRoutes = require('./users/userRouter.js');
const postRoutes = require('./posts/postRouter.js');

const server = express();
server.use(express.json());

server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);

server.listen(8000, () => console.log("API is running on port 8000."));