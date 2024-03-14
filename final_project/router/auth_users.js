const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  // For simplicity, let's assume all usernames are valid
  return true;
};

const authenticatedUser = (username, password) => {
  // Returns boolean indicating whether username and password match
  // For simplicity, let's assume there is a single hardcoded user
  const hardcodedUser = {
    username: "user",
    password: "password"
  };
  return username === hardcodedUser.username && password === hardcodedUser.password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Check if username and password match
  // For simplicity, let's assume authentication is successful
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "your_secret_key_here");
    return res.status(200).json({ token, message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Assuming the user is authenticated and their username is available in req.user.username
  const username = req.user.username;

  // Add or update the review for the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
