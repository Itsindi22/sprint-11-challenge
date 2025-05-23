import React, { useState } from 'react'
import PT from 'prop-types'

const initialFormValues = {
  username: '',
  password: '',
}

export default function LoginForm({ login }) {
  const [values, setValues] = useState(initialFormValues)

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value }) // this ensures username/password update correctly
  }

  const onSubmit = evt => {
    evt.preventDefault()
    login(values) // send { username, password } to App.js
  }

  const isDisabled = () => {
    const trimmedUsername = values.username.trim()
    const trimmedPassword = values.password.trim()
    return trimmedUsername.length < 3 || trimmedPassword.length < 8
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        id="username"
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
      />
      <input
        maxLength={20}
        id="password"
        type="password"
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
      />
      <button disabled={isDisabled()} id="submitCredentials">
        Submit credentials
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  login: PT.func.isRequired,
}
