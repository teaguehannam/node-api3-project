const express = require('express');
const db = require("./userDb");
const router = express.Router();

//Get requests
//http://localhost:4000/api/users/
router.get('/', (req, res) => {
    db.get(req.query)
    .then((posts) => {
        res.status(200).json(posts);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "Error retrieving posts"});
    });
});


router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    db.getUserPosts(req.params.id)
    .then((posts) => {
        if(posts){
            res.status(200).json(posts);
        }else{
            res.status(404).json({ message: "Post not found" });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error getting page"});
    })
});

//Post requests
router.post('/', validateUser, (req, res) => {
    db.insert(req.body)
    .then(() => { res.status(201).json(req.body) })
    .catch((err) => { 
        console.log(err);
        res.status(500).json({message: "Problem saving to database"}); 
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => { 

});

//Delete request
router.delete('/:id', validateUserId, (req, res) => {
    db.remove(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
        console.log(err);
        res.status(500).json({ message:"Error deleting" })
    })
});

//Put / Update request
router.put('/:id', validateUserId, validateUser, (req, res) => {
    db.update(req.params.id, req.body)
    .then(res.status(200).json(req.body))
    .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error updating" });
    })
});

//Middleware
function validateUserId(req, res, next) {
    const id  = req.params;
    console.log("ID to get: ", id);
    db.getById(id)
    .then(user => {
        if(user){
            req.user = user;
            next();
        }else{
            console.log("Requesting user: ", user);
            res.status(404).json({message:"User ID not found"});
        }
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json({message: "Couldn't validate user"});
    })
}

function validateUser(req, res, next) {
  const body = req.body;
  if(!body || body === {}){
    res.status(400).json({ message: "Add user in request" });
  }else{
    next();
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  if(!body || body === {}){
    res.status(400).json({ message: "Add post in request" });
  }else{
    next();
  }
}

module.exports = router;
