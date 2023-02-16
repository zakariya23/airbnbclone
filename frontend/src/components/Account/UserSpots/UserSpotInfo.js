//import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getAllSpots, removeSpot } from "../../../store/spots"

export default function UserSpotInfo (spot) {
    const dispatch = useDispatch()
    // const [ check, setCheck ] = useState(true)

    const deleteSpot = async () => {
        //if(check){
            // add modal here to make the check work to ask the user
            // if they are sure they want to delete that spot
            const deletedSpot = await dispatch(removeSpot(spot.id))
            await dispatch(getAllSpots())

            if(deletedSpot) console.log('deleted')
        //}
    }

    if(!spot) return null
    return (
        <div style={{"display":"flex", "justifyContent":"space-between", "alignContent":"center", "gap":"40px"}}>
            <h3>{spot.name}</h3>
            <div style={{"display":"flex", "justifyContent":"space-between", "alignContent":"center"}}>
                {/* <button onClick={editSpot} >Edit</button> */}
                <button><Link to={`/account/spots/edit/${spot.id}`}>Edit</Link></button>
                <button onClick={deleteSpot}>Delete</button>
            </div>
        </div>
    )
}
