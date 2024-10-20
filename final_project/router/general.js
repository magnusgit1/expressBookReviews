const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  let usersWithName = users.filter((usr) =>{
    return usr.username === username;
  });
  if(username && password){
    if(usersWithName === 0){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered."});
    } else{
      return res.status(404).json({message: "User already exists."});
    }
  } else{
    res.status(404).json({message: "Username or password missing"});
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try{
    res.send(JSON.stringify(books, null, 4))
  } catch(err){
    res.status(500).send("An error occured");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  if(isbn){
    try{
      res.send(JSON.stringify(books[isbn], null, 4));
    } catch(err){
      res.status(500).send("an error occured");
    }
  } else{
    res.send("Book(s) does not exist!");
  }

 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  let booksArr = Object.values(books);
  let book = booksArr.filter((bk) => {
    return bk.author === author;
  });
  if(book.length >= 1){
    try{
      res.send(JSON.stringify(book, null, 4));
    } catch(err){
      res.status(500).send("Error fetching books");
    }
  } else{
    res.send("No books for the given author");
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  let booksArr = Object.values(books);
  let book = booksArr.filter((bk) =>{
    return bk.title === title;
  });
  if(book.length >= 1){
    try{
      res.send(JSON.stringify(book, null, 4));
    } catch(err){
      res.status(500).send("Error fetching books");
    }
  } else{
    res.send("No books for the given title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;
  let booksArr = Object.values(books);
  let book = booksArr.filter((bk) =>{
    return bk.isbn === isbn;
  });
  if(book.length >= 1){
    res.send(JSON.stringify(book[reviews], null, 4));
  } else{
    res.send("No reviews for the given isbn");
  }
});

module.exports.general = public_users;
