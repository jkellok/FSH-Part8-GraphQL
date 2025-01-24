import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Notify from "./components/Notify";
import RecommendedView from "./components/RecommendedView";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { token ? (
          <div>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={() => logout()}>logout</button>
          </div>
          ) : (
            <button onClick={() => setPage("login")}>login</button>
          )}
      </div>

      <Authors show={page === "authors"} setError={notify} />

      <Books show={page === "books"} setMessage={notify} />

      <NewBook show={page === "add"} setError={notify} />

      <LoginForm show={page === "login"} setToken={setToken} setError={notify} />

      <RecommendedView show={page === "recommended"} token={token}/>
    </div>
  );
};

export default App;
