const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let user = users.filter((usr) =>{
    return usr.username === username;
  });
  if(user.length > 0){
    return true;
  } else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let user = users.filter((usr) =>{
    return usr.username === username && usr.password === password;
  });
  if(user.length > 0){
    return true;
  } else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "username or password missing"});
  }

  if (!isValid(username)){
    return res.status(404).json({message: "username is invalid"});

  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data:password 
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username 
    }
    return res.status(200).send("User successfully logged in!");
  } else{
    return res.status(208).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books.filter((bk) =>{
    return bk.isbn === isbn;
  });
  let reviews = book[reviews];
  let user = rep.session.authorization.username;

  reviews.push({username:user, review:req.query.review});
  
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
  let user = rep.session.authroization.username;
  const review = req.query.review;
  const isbn = rep.params.isbn;
  let book = books.filter((bk) =>{
    return bk.isbn === isbn;
  });
  let reviews = book[reviews];
  if (reviews[review]){
    reviews = reviews.filter((rev) =>{
      return rev.username != username;
    });
    res.send("Successfully removed review");
  } else{
    res.send("Review not found");
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
