const express = 'express';

const postDb = require('./postDb.js');
const userDb = require('../users/userDb.js');

const router = express.Router();

router.post('/', validateUserId, validatePost, (req, res) => {
    const user = req.body;

    userDb.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving user to database." });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const post = req.body;

    postDb.inster(post)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving post to the database." });
        });
});

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

router.get('/:id', validateUserId, (req, res) => {
    
});

router.get('/:id/posts', validateUserId, (req, res) => {

});

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

router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const editedUser = req.body;

    userDb.update(id, editedUser)
        .then(edited => {
            res.status(200).json(editedUser);
        })
        .catch(err => {
            res.status(500).json({ error: "User could not be updated." })
        });
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;

    userDb.get(id)
        .then(user => {
            console.log(user);
            if (!user) {
                res.status(404).json({ error: "Invalid user ID." })
            } else {
                req.user = user;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "User could not be retrieved." });
        });
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: "User data is missing." });
    } else if (!req.body.name) {
        res.status(400).json({ error: "Required name field is missing." });
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: "Post data is missing." });
    } else if (!req.body.text) {
        res.status(400).json({ error: "Required text field is missing." });
    } else if (!req.body.user_id) {
        res.status(400).json({ error: "Required user ID field is missing." });
    } else {
        next();
    }
};

module.exports = router;
