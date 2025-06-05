import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [currentArticle, setCurrentArticle] = useState(null)
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const location = useLocation()
  const redirectToLogin = () => { navigate('/') /* ✨ implement */ }
  const redirectToArticles = () => { navigate('/articles') /* ✨ implement */ }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    setSpinnerOn(true)
    setMessage('')
    try {
      const response = await axios.post(
        loginUrl,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      setMessage(response.data.message)
      redirectToArticles()

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed')
    } finally {
      setSpinnerOn(false)
      // ✨ implement
      // We should flush the message state, turn on the spinner
      // and launch a request to the proper endpoint.
      // On success, we should set the token to local storage in a 'token' key,
      // put the server success message in its proper state, and redirect
      // to the Articles screen. Don't forget to turn off the spinner!
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
    } else if (location.pathname === '/articles') {
      getArticles()
    }
  }, [navigate, location])

  const getArticles = async () => {
 
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await axios.get(articlesUrl, {
        headers: { Authorization: localStorage.getItem('token') }
      })

      // Fallback if data is not in res.data.articles
      const articlesData = res.data.articles || res.data

      if (Array.isArray(articlesData)) {
        setArticles(articlesData)
      } else {
        setArticles([])
      }

      setMessage(res.data.message || 'Articles loaded')
    } catch (err) {
      console.error("getArticles error:", err)
      if (err.response?.status === 401) {
        redirectToLogin()
      } else {
        setMessage('Failed to load articles')
      }
    } finally {
      setSpinnerOn(false)

    }
  }

  const postArticle = async (article) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await axios.post(articlesUrl, article, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setMessage(res.data.message)
      getArticles()
    } catch (err) {
      setMessage('Failed to post article')
    } finally {
      setSpinnerOn(false)
    }
  }

  const updateArticle = async (article_id, article) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setMessage(res.data.message)
      setCurrentArticleId(null)
      setCurrentArticle(null)
      getArticles()
    } catch (err) {
      setMessage('Failed to update article')
    } finally {
      setSpinnerOn(false)
    }
  }

  const deleteArticle = async (article_id) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setMessage(res.data.message)
      getArticles()
    } catch (err) {
      setMessage('Failed to delete article')
    } finally {
      setSpinnerOn(false)
    }
  }

  // fetch the currentArticle object when currentArticleId changes
  useEffect(() => {
    if (currentArticleId) {
      const found = articles.find(art => art.article_id === currentArticleId)
      setCurrentArticle(found || null)
    } else {
      setCurrentArticle(null)
    }
  }, [currentArticleId, articles])

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                currentArticle={currentArticle}
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId} 
              />
              <Articles
                getArticles={getArticles}
                articles={articles}
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
