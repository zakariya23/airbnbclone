import React from "react";
import { NavLink } from "react-router-dom";
import './SpotCard.css'
import image from '../images/24234234234.png'

function SpotCard(spot) {
    if(!spot) return null
    return (
        <div className="spot-card">
            <NavLink to={`/api/spots/${spot.id}`}>
            <img className={'image'} src={image} alt="sample"></img>
                <div className="text">
                    <p className={'text-bold'}>{spot.city}, {spot.state}</p>
                    <div className={'text-small'}>
                        <span className={'text-bold'}>
                            ${spot.price} {" "}
                        </span>
                        night
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default SpotCard;
