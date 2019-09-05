const express = require('express');

const postDb = require('../posts/postDb.js');
const userDb = require('../users/userDb.js');

const router = express.Router();

// POST a user
router.post('/', validateUser, (req, res) => {
    const user = req.body;
    const { name } = req.body;
    if (user.name && user.name !== "") {
        userDb.insert({name})
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving user to database." });
        });
    } else {
        res.status(400).json({ error: "Please provide name for user." });
    }
});


// POST
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const post = req.body;

    postDb.insert(post)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving post to the database." });
        });
});

// GET users
router.get('/', (req, res) => {
    userDb.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Users could not be retrieved." });
        });

});

// GET user by id
router.get('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    res.status(200).json(req.user);
    // userDb.getById(id)
    //     .then(user => {
    //         console.log(user);
    //         if (user) {
    //             res.status(200).json(user);
    //         } else {
    //             res.status(404).json({ error: "The user with the specified ID does not exist." });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(404).json({ error: "There was an error retrieving the user from the database." });
    //     });
});

// GET user by id posts
router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    userDb.getById(id)
        .then(user => {
            console.log(user);
            if (user) {
                userDb.getUserPosts(id)
                    .then(posts => res.status(200).json(posts))
                    .catch(err => res.status(500).json({ error: "There was an error retrieving the user's posts." }))
            }
            // else {
            //     res.status(404).json({ error: "The user with the specified ID does not exist." });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ error: "There was an error retrieving the user from the database." });
        });
});

// DELETE user by id
router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    userDb.remove(id)
        .then(user => {
            res.status(204).json(req.user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "User could not be removed." });
        });

});

// PUT user by id
router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    userDb.update(id, { name })
        .then(updated => {
            if (updated) {
                userDb.getById(id)
                    .then(user => {
                        res.status(200).json(user)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "User could not be retrieved" });
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while updating the user." });
        });
    
    // userDb.getById(id)
    //     .then(user => {
    //         if (user) {
    //             userDb.update(id, { name })
    //                 .then(updated => {
    //                     res.status(200).json(updated);
    //                 });
    //         } else {
    //             res.status(404).json({ error: "The user with the specified ID does not exist." });
    //     }
    //     })
    //     .catch(err => {
    //         res.status(500).json({ error: "User could not be updated." })
    //     });
});



//custom middleware
function validateUserId(req, res, next) {
    const { id } = req.params;

    userDb.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({error: "Invalid user id."})
        }
        })
        
    // userDb.get(id)
    //     .then(user => {
    //         console.log(user);
    //         if (!user) {
    //             res.status(404).json({ error: "Invalid user id." })
    //         } else {
    //             req.user = user;
    //             next();
    //         }
    //     })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "User could not be retrieved." });
        });
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: "Missing user data." });
    } else if (!req.body.name) {
        res.status(400).json({ error: "Missing required name field." });
    } else if (typeof req.body.name !== "string") {
        res.status(400).json({ error: "Name must be a string." });
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: "Missing post data." });
    } else if (!req.body.text) {
        res.status(400).json({ error: "Missing required text field." });
    } else if (!req.body.user_id) {
        res.status(400).json({ error: "Missing required user ID." });
    } else {
        next();
    }
};

module.exports = router;
