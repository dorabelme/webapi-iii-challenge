const express = 'express';

const server = express();
const userRoutes = require('./users/userRouter.js');

server.use(express.json());
server.use(logger);
server.use('/api/users', userRoutes);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `Method: ${req.method}, url: ${req.url}, timestamp: ${new Date().toISOString()}`
  );

  next();
}

module.exports = server;
