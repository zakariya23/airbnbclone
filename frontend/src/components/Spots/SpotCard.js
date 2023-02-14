import React from "react";
import { Link } from "react-router-dom";
import './SpotCard.css'

function SpotCard(spot) {
    if(!spot) return null
    return (
        <div className="spot-card-container">
            <Link to={`/spots/${spot.id}`}>
                <div className="image-container">
                    <img className="spot-image" src={spot.previewImage} alt="spotImage"></img>
                </div>
                <div className="text-container">
                    <p className="spot-city">{spot.city}, {spot.state}</p>
                    <div className="spot-price">
                        <span className="price-bold">
                            ${spot.price} {" "}
                        </span>
                        night
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SpotCard;
