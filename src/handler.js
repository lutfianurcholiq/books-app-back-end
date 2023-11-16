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

  books.push(newBooks)

  const success = books.filter((book) => book.id === id).length > 0

  if (name === '') {
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
        message: 'Gagal menambahkan buku. readpage tidak boleh lebih besar dari pageCount'
      }
    )
    response.code(400)
    return response
  }

  if (success) {
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
  const mapBook = books.map((bookMap) => (
    {
      id: bookMap.id,
      name: bookMap.name,
      publisher: bookMap.publisher
    }
  ))
  const response = h.response({
    status: 'success',
    data: {
      books: mapBook
    }
  })
  response.code(200)
  return response
}

const getBookById = (request, h) => {
  const { id } = request.params

  const book = books.filter((bookId) => bookId.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
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
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const indexBook = books.findIndex((bookId) => bookId.id === id)

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

    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil diperbarui'
      }
    )
    response.code(200)
    return response
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

  if (name === '') {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      }
    )
    response.code(400)
    return response
  }
}

const deleteBookById = (request, h) => {
  const { id } = request.params

  const indexBook = books.findIndex((bookId) => bookId.id === id)

  if (books !== -1) {
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
  response.code(400)
  return response
}

const getAllSearchBook = (request, h) => {
  // const { name, reading, finished } = request.query
}

module.exports = { addBook, getAllBook, getBookById, editBookById, deleteBookById, getAllSearchBook }
