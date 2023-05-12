import {Component} from 'react'
import {Link} from 'react-router-dom'

import './index.css'

class SignIn extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeRePassword = event => {
    const {password} = this.state
    const passwordInput = document.getElementById('Repass')
    if (event.target.value !== password) {
      passwordInput.classList.remove('match')
      passwordInput.classList.add('un-match')
    } else {
      passwordInput.classList.remove('un-match')
      passwordInput.classList.add('match')
    }
  }

  checkFields = details => {
    const {username, password} = this.state
    const passwordInput = document.getElementById('Repass')
    if (username === '' || password === '' || passwordInput.value === '') {
      this.setState({isError: true, errorMsg: 'Please Enter all credentials'})
    } else {
      const {history} = this.props
      const userDetails = [...details, {username, password}]
      localStorage.setItem('users_list', JSON.stringify(userDetails))
      this.setState({username: '', password: '', isError: false})
      passwordInput.value = ''
      history.replace('/login')
    }
  }

  onSignUp = event => {
    event.preventDefault()
    const {username} = this.state
    const details = JSON.parse(localStorage.getItem('users_list'))
    if (details.length === 0) {
      this.checkFields(details)
    } else {
      let isExisted = false
      details.forEach(eachItem => {
        if (eachItem.username === username) {
          isExisted = true
          this.setState({isError: true, errorMsg: 'user already exists'})
        }
      })
      if (!isExisted) {
        this.checkFields(details)
      }
    }
  }

  render() {
    const {username, password, isError, errorMsg} = this.state

    return (
      <div className="bg-container-sign-in">
        <div className="container-sign-in">
          <form onSubmit={this.onSignUp}>
            <h1 className="sign-heading">Create Account</h1>
            <label htmlFor="name">Username*</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Email Address"
              title="Enter Username"
              value={username}
              onChange={this.onChangeUsername}
            />

            <label htmlFor="pass">Password*</label>
            <input
              type="password"
              id="pass"
              placeholder="Enter Password"
              title="Enter Password"
              value={password}
              onChange={this.onChangePassword}
            />

            <label htmlFor="Repass">RE-Enter Password*</label>
            <input
              type="password"
              id="Repass"
              placeholder="Re-Enter Password"
              title="Re-Enter Password"
              onChange={this.onChangeRePassword}
            />

            <button type="submit" className="login-btn">
              SIGN UP
            </button>
            {isError && <p className="error">{errorMsg}</p>}
            <p className="main-para">
              Already a User ?
              <Link to="/login" className="class-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default SignIn
