import { useQuery, useSubscription, useApolloClient } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { useState } from "react";

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const Books = ({ show, setMessage }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  })

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      setMessage(`${addedBook.title} was added`)
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
    }
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks

  const genres = books.map(b => b.genres)
  const genresFlat = genres.flat()
  const genresUnique = genresFlat.reduce((acc, curr) => acc.includes(curr) ? acc : [...acc, curr], [])

  return (
    <div>
      <h2>books</h2>

      {selectedGenre ? <div>in genre <b>{selectedGenre}</b></div> : null}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genresUnique.map((g) => {
          return <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>
        })}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
