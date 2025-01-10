const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
async function getBooks() {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log('Books List:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

// Get book details based on ISBN
async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log('Book Details by ISBN:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching book by ISBN:", error);
    }
  }
  
// Get book details based on author
async function getBooksByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log('Books by Author:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching books by author:", error);
    }
  }

// Get all books based on title
async function getBooksByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log('Books by Title:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching books by title:", error);
    }
  }
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});


module.exports.general = public_users;
