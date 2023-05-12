import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import RestaurantItemDetails from './components/RestaurantItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './components/SignIn'
import './App.css'

const App = () => {
  const userDetails = localStorage.getItem('users_list')
  if (userDetails === null) {
    const user = []
    localStorage.setItem('users_list', JSON.stringify(user))
  }
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/sign-up" component={SignIn} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute
        exact
        path="/restaurant/:id"
        component={RestaurantItemDetails}
      />
      <ProtectedRoute exact path="/cart" component={Cart} />
      <ProtectedRoute exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  )
}

export default App
