import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SpotCard from './SpotCard';
import './index.css';
// import { clearReviews } from '../../store/reviews'
import MapComponent from '../Map/map';

function Spots() {
    const dispatch = useDispatch()



    const spotsObj = useSelector(state => state.spots.allSpots)

    const spots = Object.values(spotsObj)

    if(!spots) return null
    return (
        <>
        <div className='main-wrapper'>
        <div className='card-wrapper'>
            {spots.map((spot) => (
            <SpotCard key={spot.id} {...spot} />
            ))}
        </div>

    </div>
    <br></br>
    <div>
    <MapComponent spots={spots} />
    </div>
    </>
    )
}

export default Spots
