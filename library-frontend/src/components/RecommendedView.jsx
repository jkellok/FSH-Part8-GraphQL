import { useQuery } from "@apollo/client";
import { ALL_BOOKS, CURRENT_USER } from "../queries";

const RecommendedView = (props) => {

  if (!props.token) return null

  if (!props.show) {
    return null
  }

  const currentUser = useQuery(CURRENT_USER)
  const favoriteGenre = currentUser.data ? currentUser.data.me.favoriteGenre : null

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre }
  })

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>

      {favoriteGenre ? <div>Books in your favorite genre <b>{favoriteGenre}</b></div> : null}

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
    </div>
  )
}

export default RecommendedView
