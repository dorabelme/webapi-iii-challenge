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

router.get('/:id', validatePostId, (req, res) => {

});

router.delete('/:id', validatePostId, (req, res) => {

});

router.put('/:id', validatePostId, (req, res) => {

});


// custom middleware
function validatePostId(req, res, next) {
    const { id } = req.params;
    postDb.get(id)
        .then(post => {
            console.log(user);
            if (!post) {
                res.status(404).json({ error: "Invalid post ID." })
            } else {
                req.post = post;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Post could not be retrieved." });
        });
};


module.exports = router;