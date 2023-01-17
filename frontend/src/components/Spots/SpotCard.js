import React from "react";
import { NavLink } from "react-router-dom";
import './SpotCard.css'


function SpotCard(spot) {
    if(!spot) return null
    return (
        <div className="spot-card">
            <NavLink to={`/api/spots/${spot.id}`}>
                <h3>{spot.name}</h3>
                <h4>{spot.address}</h4>
                <h4>{spot.city}</h4>
                <h4>{spot.state}</h4>
                <p>{spot.description}</p>
            </NavLink>
        </div>
    )
}

export default SpotCard;
