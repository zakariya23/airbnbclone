import { NavLink, Route, Switch } from "react-router-dom"
import EditUserSpot from "../Account/UserSpots/EditUserSpot"
import UserSpots from '../Account/UserSpots/UserSpots'
import UserReviews from "./UserReviews"
import './Account.css'
import Profile from './User/index'


function Account () {
    return (
        <div className="account-container">
            <nav className="account-nav">
                <NavLink className="account-nav-link" to={'/account'}>Profile</NavLink>
                <NavLink className="account-nav-link" to={'/account/spots'}>Spots</NavLink>
                <NavLink className="account-nav-link" to={'/account/reviews'}>Reviews</NavLink>
            </nav>
            <div className="account-content">
            <Route exact path='/account'>
        <Profile />
    </Route>
                <Switch>
                    <Route exact path='/account/spots'>
                        <UserSpots />
                    </Route>
                    <Route path='/account/reviews'>
                        <UserReviews />
                    </Route>
                    <Route path='/account/spots/edit/:id'>
                        <EditUserSpot />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default Account;
