import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isErrorName: false,
    isErrorPass: false,
    isError: false,
    errorMsgName: '',
    errorMsgPass: '',
    errMsg: '',
    passwordHide: true,
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onChangeCheckbox = () => {
    this.setState(prevState => ({passwordHide: !prevState.passwordHide}))
  }

  onChangeCheckboxMobile = () => {
    this.setState(prevState => ({passwordHide: !prevState.passwordHide}))
  }

  loginProcess = () => {
    const {username, password} = this.state
    const details = JSON.parse(localStorage.getItem('users_list'))
    let exists = false
    details.forEach(eachItem => {
      if (eachItem.username === username) {
        exists = true
      }
    })
    if (exists) {
      const particularUser = details.filter(
        eachItem => eachItem.username === username,
      )
      if (particularUser[0].password === password) {
        const currentUser = details.filter(
          eachElement => eachElement.username === username,
        )
        const jwtToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU'
        Cookies.set('jwt_token', jwtToken, {expires: 1})
        localStorage.setItem('current_user', JSON.stringify(currentUser[0]))
        const {history} = this.props
        history.replace('/')
      } else {
        this.setState({
          isError: true,
          errMsg: "Email and Password didn't match",
        })
      }
    } else {
      this.setState({
        isError: true,
        errMsg: 'The user new! Please sign up',
      })
    }
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    if (username === '' && password === '') {
      this.setState({
        isErrorName: true,
        errorMsgName: 'Please enter a valid username.',
        isErrorPass: true,
        errorMsgPass: 'Please enter a valid password',
      })
    } else if (username === '' && password !== '') {
      this.setState({
        isErrorName: true,
        errorMsgName: 'Please enter a valid username.',
      })
    } else if (password === '' && username !== '') {
      this.setState({
        isErrorPass: true,
        errorMsgPass: 'Please enter a valid password',
      })
    } else {
      this.setState({isErrorName: false, isErrorPass: false})
      this.loginProcess()
    }
  }

  render() {
    const {
      username,
      password,
      passwordHide,
      isErrorName,
      isErrorPass,
      isError,
      errorMsgName,
      errorMsgPass,
      errMsg,
    } = this.state
    const passwordType = passwordHide ? 'password' : 'text'
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        <div className="bg-container">
          <div className="login-details">
            <div className="card-cont">
              <div className="logo-cont">
                <img
                  src="https://res.cloudinary.com/dcxurp30f/image/upload/v1672746641/logo_wqzjft.png"
                  alt="website logo"
                  className="logo"
                />
                <h1 className="logo-title">Tasty Kitchens</h1>
              </div>
              <h1 className="login-txt">Login</h1>
              <form onSubmit={this.onSubmitForm}>
                <label htmlFor="user">USERNAME</label>
                <input
                  type="text"
                  id="user1"
                  placeholder="Username"
                  value={username}
                  onChange={this.onChangeUsername}
                />
                {isErrorName ? <p className="error">{errorMsgName}</p> : ''}
                <label htmlFor="passD">PASSWORD</label>
                <input
                  type={passwordType}
                  id="passD"
                  placeholder="Password"
                  className="passElementD"
                  value={password}
                  onChange={this.onChangePassword}
                />
                {isErrorPass ? <p className="error">{errorMsgPass}</p> : ''}
                <div className="pass-check">
                  <input
                    type="checkbox"
                    id="showPassD"
                    className="checkbox"
                    onChange={this.onChangeCheckbox}
                  />
                  <label htmlFor="showPassD" className="label-pass">
                    Show Password
                  </label>
                </div>
                <p className="main-para">
                  Create account{' '}
                  <Link to="/sign-up" className="class-link">
                    Sign up
                  </Link>
                </p>
                <button type="submit" className="login-btn">
                  Login
                </button>
                {isError ? <p className="error">{errMsg}</p> : ''}
              </form>
            </div>
          </div>
          <div className="img-cont">
            <img
              src="https://res.cloudinary.com/dcxurp30f/image/upload/v1672742515/Rectangle_1456_sbtwrd.png"
              alt="website login"
              className="login-img"
            />
          </div>
        </div>
        <div className="mobile-bg-container">
          <img
            src="https://res.cloudinary.com/dcxurp30f/image/upload/v1672742515/Rectangle_1456_sbtwrd.png"
            alt="website login"
            className="mobile-img"
          />
          <form onSubmit={this.onSubmitForm}>
            <h1 className="login-text">Login</h1>
            <label htmlFor="userM">USERNAME</label>
            <input
              type="text"
              id="userM"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            {isErrorName ? <p className="error">{errorMsgName}</p> : ''}
            <label htmlFor="passM">PASSWORD</label>
            <input
              type={passwordType}
              id="passM"
              placeholder="Password"
              className="passElement"
              value={password}
              onChange={this.onChangePassword}
            />
            {isErrorPass ? <p className="error">{errorMsgPass}</p> : ''}
            <div className="pass-check">
              <input
                type="checkbox"
                id="showPass"
                className="checkbox"
                onChange={this.onChangeCheckboxMobile}
              />
              <label htmlFor="showPass" className="label-pass">
                Show Password
              </label>
            </div>
            <p className="main-para">
              Create account{' '}
              <Link to="/sign-up" className="class-link">
                Sign up
              </Link>
            </p>
            <button type="submit" className="login-btn">
              Login
            </button>
            {isError ? <p className="error">{errMsg}</p> : ''}
          </form>
        </div>
      </>
    )
  }
}
export default Login
