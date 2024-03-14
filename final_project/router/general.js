const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Create a Promise to search for the book by ISBN
  const searchBookByISBN = new Promise((resolve, reject) => {
    // Simulate asynchronous operation with a delay
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book); // Resolve the Promise with the book if found
      } else {
        reject({ message: "Book not found" }); // Reject the Promise if book not found
      }
    }, 1000); // Simulated delay of 1 second
  });

  // Handling the Promise
  searchBookByISBN
    .then((book) => {
      // Book found, send it in the response
      return res.status(200).json(book);
    })
    .catch((error) => {
      // Book not found, send error message in the response
      return res.status(404).json(error);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for the author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchedBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title)
  );
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found with the title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    return res.status(200).json({ reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
