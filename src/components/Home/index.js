/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFilterLeft, BsSearch} from 'react-icons/bs'
import Header from '../Header'
import RestaurantItem from '../RestaurantItem'
import Footer from '../Footer'
import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const apiStatusTexts = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    activePage: 1,
    selectedSortByValue: sortByOptions[1].value,
    restaurantsList: [],
    restaurantsApiStatus: apiStatusTexts.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getRestaurantsList()
  }

  getRestaurantsList = async () => {
    this.setState({restaurantsApiStatus: apiStatusTexts.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activePage, selectedSortByValue} = this.state
    const limit = 9
    const offset = (activePage - 1) * limit
    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}&sort_by_rating=${selectedSortByValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const updatedRestaurantsList = data.restaurants.map(eachRestaurant => ({
      costForTwo: eachRestaurant.cost_for_two,
      cuisine: eachRestaurant.cuisine,
      groupByTime: eachRestaurant.group_by_time,
      hasOnlineDelivery: eachRestaurant.has_online_delivery,
      hasTableBooking: eachRestaurant.has_table_booking,
      id: eachRestaurant.id,
      imageUrl: eachRestaurant.image_url,
      isDeliveringNow: eachRestaurant.is_delivering_now,
      location: eachRestaurant.location,
      menuType: eachRestaurant.menu_type,
      name: eachRestaurant.name,
      opensAt: eachRestaurant.opens_at,
      userRatings: {
        rating: eachRestaurant.user_rating.rating,
        ratingColor: eachRestaurant.user_rating.rating_color,
        ratingText: eachRestaurant.user_rating.rating_text,
        totalReviews: eachRestaurant.user_rating.total_reviews,
      },
    }))
    this.setState(
      {
        restaurantsList: updatedRestaurantsList,
        restaurantsApiStatus: apiStatusTexts.success,
      },
      this.updateRestaurantsBasedOnSearch,
    )
  }

  renderRestaurantsLoadingView = () => (
    <div testid="restaurants-list-loader" className="restaurants-loader-cont">
      <Loader
        type="TailSpin"
        color="#F7931E"
        height={80}
        width={80}
        radius={15}
      />
    </div>
  )

  renderRestaurantsSuccessView = () => {
    const {restaurantsList} = this.state
    return (
      <ul className="restaurants-list">
        {restaurantsList.map(eachRestaurantItem => (
          <RestaurantItem
            key={eachRestaurantItem.id}
            itemDetails={eachRestaurantItem}
          />
        ))}
      </ul>
    )
  }

  renderNoRestaurantsView = () => (
    <div className="no-rest-view">
      <img
        src="https://res.cloudinary.com/dcxurp30f/image/upload/v1675081302/restaurant-removebg-preview_ysj08m.png"
        alt="no restaurants"
      />
      <p>
        Sorry we can`&apos;t find the Restaurant you are looking for. <br /> Try
        something else
      </p>
    </div>
  )

  getRestaurantsListView = () => {
    const {restaurantsApiStatus, restaurantsList} = this.state
    switch (restaurantsApiStatus) {
      case apiStatusTexts.success:
        if (restaurantsList.length === 0) {
          return this.renderNoRestaurantsView()
        }
        return this.renderRestaurantsSuccessView()
      default:
        return this.renderRestaurantsLoadingView()
    }
  }

  updateRestaurantsBasedOnSearch = () => {
    this.setState(prevState => ({
      restaurantsList: prevState.restaurantsList.filter(eachItem =>
        eachItem.name
          .toLowerCase()
          .includes(prevState.searchInput.toLowerCase()),
      ),
    }))
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getRestaurantsList)
  }

  onChangeSortByOption = event => {
    this.setState(
      {selectedSortByValue: event.target.value},
      this.getRestaurantsList,
    )
  }

  onClickNextPage = () => {
    const {activePage} = this.state
    if (activePage !== 4) {
      this.setState({activePage: activePage + 1}, this.getRestaurantsList)
    }
  }

  onClickPreviousPage = () => {
    const {activePage} = this.state
    if (activePage !== 1) {
      this.setState({activePage: activePage - 1}, this.getRestaurantsList)
    }
  }

  render() {
    const {activePage, selectedSortByValue, searchInput} = this.state
    const cartList = JSON.parse(localStorage.getItem('cartData'))
    return (
      <div className="home-cont">
        <Header isHome cartLength={cartList === null ? 0 : cartList.length} />
        <div className="offers-slider-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/restaurants-app-project/carousel-images-north-indian-special.jpg"
            alt="offers"
            className="offer-img"
          />
        </div>
        <div className="restaurants-container">
          <div className="head-search">
            <h1>Popular Restaurants</h1>
            <p>
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>
          </div>
          <div className="filter-container">
            <div className="search-cont">
              <BsSearch className="icon-src" />
              <input
                type="search"
                placeholder="Search Restaurants here"
                className="search-bar"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
            </div>
            <div className="options-cont">
              <BsFilterLeft size="28px" />
              <p className="srt-by-txt">Sort By</p>
              <select
                className="sort-by"
                value={selectedSortByValue}
                onChange={this.onChangeSortByOption}
              >
                {sortByOptions.map(eachItem => (
                  <option key={eachItem.id} value={eachItem.value}>
                    {eachItem.displayText}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr className="line" />
        {this.getRestaurantsListView()}
        <div className="page-controls">
          <button
            type="button"
            className="arrow-btn"
            onClick={this.onClickPreviousPage}
            testid="pagination-left-button"
          >
            <img
              src="https://res.cloudinary.com/dcxurp30f/image/upload/v1672851403/Icon_idvoa9.png"
              alt="arrow"
            />
          </button>
          <span testid="active-page-number">{activePage} of 4</span>
          <button
            type="button"
            className="arrow-btn"
            onClick={this.onClickNextPage}
            testid="pagination-right-button"
          >
            <img
              src="https://res.cloudinary.com/dcxurp30f/image/upload/v1672851403/Icon_idvoa9.png"
              alt="arrow"
              className="right-arw"
            />
          </button>
        </div>
        <Footer />
      </div>
    )
  }
}
export default Home
