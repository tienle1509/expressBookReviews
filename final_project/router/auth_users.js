const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.filter((user) => {
        return user.username === username && user.password === password;
    })

    return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check exist book by isbn
  if(book){
    const bookReviews = Object.keys(book.reviews)
    let userReview = false;
    let indexReview = 0;
    const username = req.session.authorization['username'];
    const content = req.query.content;

    bookReviews.forEach(index => {
        if(book.reviews[index].username === username){
            userReview = true;
            indexReview = index;
        }
      });

    // Update
    if(userReview){
        book.reviews[indexReview].content = content;

        res.send(`Reviews of the book with isbn ${isbn} updated.`);
    // Create
    }else{
        book.reviews[bookReviews.length+1] = { username, content};

        res.send(`Reviews of the book with isbn ${isbn} added.`)
    }
  }else{
    res.status(404).json({message: "Unable to find book"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    // Check exist book by isbn
  if(book){
    const bookReviews = Object.keys(book.reviews)
    let userReview = false;
    let indexReview = 0;
    const username = req.session.authorization['username'];
    const content = req.query.content;

    bookReviews.forEach(index => {
        if(book.reviews[index].username === username){
            userReview = true;
            indexReview = index;
        }
      });

    // Delete
    if(userReview){
        delete book.reviews[indexReview];

        res.send(`Reviews of the book with isbn ${isbn} deleted.`);
    // Error
    }else{
        res.status(404).json({message: "Unable to find reviews"});
    }
  }else{
    res.status(404).json({message: "Unable to find book"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
