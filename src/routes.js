/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { addBook, getAllBook, getBookById, editBookById, deleteBookById, getAllSearchBook } = require('./handler')

const routes = [
  {
    method: 'GET',
    path: '/books/',
    handler: getAllSearchBook
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBook
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBook
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookById
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById
  }
]

module.exports = routes
