const express = 'express';
const postDb = require('./postDb.js');
const userDb = require('../users/userDb.js');

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body);
    postDb.get()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Posts could not be retrieved." })
        });
});

router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = router;