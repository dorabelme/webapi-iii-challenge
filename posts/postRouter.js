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


// GET post by id
router.get('/:id', validatePostId, (req, res) => {
    const { id } = req.params.id;
    postDb.getById(id)
        .then(post => {
            if (post) {
                res.status(201).json(post);
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be retrieved from the database." });
        });

});

// DELETE post by id
router.delete('/:id', validatePostId, (req, res) => {
    const { id } = req.params;
    postDb.getById(id)
        .then(post => {
            if (post) {
                postDb.remove(id)
                    .then(res.status(200).json(post))
                    .catch(err => res.status(500).json({ error: "The post could not be removed." }))
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be retrieved from the database." });
        });
});


// PUT post by id
router.put('/:id', validatePostId, (req, res) => {
    const { id } = req.params;
    const newPost = req.body;

    if (newPost.text) {
        postDb.getById(id)
            .then(post => {
                if (post) {
                    postDb.update(id, newPost)
                        .then(res.status(200).json(post))
                        .catch(err => res.status(500).json({ error: "The post was modified but could not be retrieved" }))
                } else {
                    res.status(500).json({
                        error: "The post could not be modified."
                    });
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The post could bot be retrieved from the database."});
            })
    } else {
        res.status(400).json({ error: "Please provide text for the post." });
    }
                

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