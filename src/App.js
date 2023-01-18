import { useState, useEffect } from 'react'
import './App.css';

const API_URL = 'http://localhost:3000'
const SUPER_SECRET_TOKEN = 'super duper secret' // As in the API example, don't do it like this lol

function App() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // When we first render the page
  useEffect(() => {
    fetchBooks()
  }, [])

  // Fetching our list of books
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        headers: {
          "Authorization": SUPER_SECRET_TOKEN
        }
      })
      const { books } = await response.json()
      setErrorMessage("")
      setBooks(books)
    } catch (error) {
      setErrorMessage(error)
    }
  }

  // Handling the title input
  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  // Handling the author input
  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  // Adding a new book
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": SUPER_SECRET_TOKEN
        },
        body: JSON.stringify({ title, author })
      })
      const body = await response.json()

      if (!response.ok) {
        return setErrorMessage(body.message)
      }

      fetchBooks()
    } catch (error) {
      setErrorMessage(error)
    }
  }

  // Deleting a book
  const handleDelete = async (title) => {
    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": SUPER_SECRET_TOKEN
        },
        body: JSON.stringify({ title })
      })
      const body = await response.json()

      if (!response.ok) {
        return setErrorMessage(body.message)
      }

      fetchBooks()
    } catch (error) {
      setErrorMessage(error)
    }
  }

  return (
    <div className='app'>
      {/* Showing the error message if it exists */}
      {errorMessage && <p className="error">Error: {errorMessage}</p>}

      <h1>Reading list</h1>

      {/* Our form to add a new book */}
      <div className='form'>
        <div className="form-group">
          <label className="form-item">
            Title:
            <input type="text" placeholder="A Farewell to Arms" onChange={handleTitle} />
          </label>
          <label className="form-item">
            Author:
            <input type="text" placeholder="Ernest Hemingway" onChange={handleAuthor} />
          </label>
          <button onClick={handleSubmit}>
            Add a new book
          </button>
        </div>
      </div>

      {/* Show "No books found" if our books array is empty */}
      {!books?.length && <p>No books found</p>}

      {/* Show a list of books if our books array isn't empty */}
      <ul>{books?.map(book => (<li>{book.title} by {book.author} <button onClick={() => handleDelete(book.title)}>X</button></li>))}</ul>
    </div>
  );
}

export default App;
