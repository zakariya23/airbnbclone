import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from '../../../store/spots'
import ReservationForm from "./ReservationForm";
import "./OneSpot.css"

function OneSpot () {
    const dispatch = useDispatch()
    const { id } = useParams()
    useEffect(() => {
        dispatch(spotActions.getSpotById(id))
    }, [id, dispatch])

const spot = useSelector(state => state.spots.singleSpot)

if(!spot) return null
return ( <div className="wrapper-for-info">
<div className="header">
    <h2 className="text spot-header">
        {spot.name}
    </h2>
    <div className="sub-info">
        <div className='ratings'>
            <span><i className="fa-sharp fa-solid fa-star"></i>{spot.avgStarRating}</span>
            <li>{spot.numReviews} reviews</li>
            <li>{spot.city}, {spot.state}, {spot.country}</li>
            <span><i className="fa-sharp fa-solid fa-star"></i>{spot.avgStarRating} ·</span>
            <span>{spot.numReviews} reviews · </span>
            <span>{spot.city}, {spot.state}, {spot.country}</span>
        </div>
        <div className="share">
            <span><i className="fa-solid fa-arrow-up-from-bracket"></i> Share</span>
            <span><i className="fa-regular fa-heart"></i> Save</span>
        </div>
    </div>
</div>
<div>WHERE PICTURES GO</div>
<div className="details">
<div className="host">
                    <h3>This home hosted by </h3>
                    <div>profile pic</div>
    </div>
    <div className="reserve-form"><ReservationForm {...spot} /></div>
</div>
</div>
)
}

export default OneSpot
