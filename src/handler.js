/* eslint-disable no-unused-vars */
const books = require('./book')
const { nanoid } = require('nanoid')

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (name == null) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      }
    )
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      }
    )
    response.code(400)
    return response
  }

  books.push(newBooks)

  const IsSuccess = books.filter((book) => book.id === id).length > 0

  if (IsSuccess) {
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      }
    )
    response.code(201)
    return response
  }
}

const getAllBook = (request, h) => {
  const { name, reading, finished } = request.query

  let filterBook = [...books]

  if (name) {
    filterBook = filterBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    filterBook = filterBook.filter((book) => book.reading === (reading === '1'))
  }

  if (finished !== undefined) {
    filterBook = filterBook.filter((book) => book.finished === (finished === '1'))
  }

  const bookMap = filterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  const response = h.response(
    {
      status: 'success',
      data: {
        books: bookMap
      }
    }
  )
  response.code(200)
  return response
}

const getBookById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response(
      {
        status: 'success',
        data: {
          book
        }
      }
    )
    response.code(200)
    return response
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }
  )
  response.code(404)
  return response
}

const editBookById = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const indexBook = books.findIndex((book) => book.id === bookId)

  if (indexBook !== -1) {
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    if (readPage > pageCount) {
      const response = h.response(
        {
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }
      )
      response.code(400)
      return response
    }

    if (name == null) {
      const response = h.response(
        {
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }
      )
      response.code(400)
      return response
    }

    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
    response.code(200)
    return response
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }
  )
  response.code(404)
  return response
}

const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const indexBook = books.findIndex((book) => book.id === bookId)

  if (indexBook !== -1) {
    books.splice(indexBook, 1)
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil dihapus'
      }
    )
    response.code(200)
    return response
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }
  )
  response.code(404)
  return response
}

module.exports = { addBook, getAllBook, getBookById, editBookById, deleteBookById }
