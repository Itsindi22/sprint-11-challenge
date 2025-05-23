import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'
import axios from 'axios'

export default function Articles(props) {
    const [articles,setArticles] = useState()
    const navigate = useNavigate()
  // ✨ where are my props? Destructure them here

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)
 const logout = () => {
    localStorage.removeItem('token') 
    navigate('/')
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  useEffect(() => {
    const token =localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }  else {
      const fetchArticles = async () => {
   try {
     const responce = await axios.get (
         'http://localhost:9000/api/articles',
          {headers : {Authorization: token }}
        ) 
        setArticles(responce.data)
   } catch (error) {
    if (error?.responce.status == 401) logout ()
 
   }
        //Get articles appending token to Authorization header 
        // if responce is a 401 Unauthorized perform a logout
        // if response is ok the  articles in compont state
      }
      fetchArticles()
    }
    // ✨ grab the articles here, on first render only
  })

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        ![].length
          ? 'No articles yet'
          : [].map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={true} onClick={Function.prototype}>Edit</button>
                  <button disabled={true} onClick={Function.prototype}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
