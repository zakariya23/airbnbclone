import { NavLink, Route, Switch } from "react-router-dom"
import EditUserSpot from "./EditUserSpot"
import UserSpots from './UserSpots'
import UserReviews from "./UserReviews"

function Account () {

    // useEffect(() => {
    //     // dispatch the get current reviews or users with if statement
    // })


    return (
        <div style={{'display':'flex', "justifyContent":"space-around", "width":"50%" }}>
            <nav style={{'display':'flex', 'flexDirection':'column', "gap":"25px"}}>
                <NavLink to={'/account/spots'}>Spots</NavLink>
                <NavLink to={'/account/reviews'}>Reviews</NavLink>
            </nav>
            <div>

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
