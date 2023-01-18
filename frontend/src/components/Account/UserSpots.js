import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotsOfUser } from "../../store/spots"
import UserSpotInfo from "./UserSpotInfo"

export default function SpotsOfUser() {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.allSpots)
    const [ userSpots, setUserSpots ] = useState('')

    const getTheSpots = async () => {
        let spotsOfUser = await dispatch(getSpotsOfUser())
        setUserSpots(spotsOfUser.Spots)
    }
    useEffect(() => {
        getTheSpots()
    }, [spots])

    if(!userSpots) return null

    return (
        <div>
            {userSpots.map((spot) => (
                <UserSpotInfo key={spot.id} {...spot} />
                ))}
        </div>

    )
}
