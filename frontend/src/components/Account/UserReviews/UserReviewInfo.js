// import { useDispatch, useSelector } from "react-redux"
// import { Link } from "react-router-dom"
// import { removeReview } from "../../../store/reviews"
import { useSelector } from "react-redux"

export default function UserReviewInfo (review) {
    // const dispatch = useDispatch()
    const spot = useSelector(state => state.spots.allSpots[review.spotId])
    // const history = useHistory()
    // const [ check, setCheck ] = useState(true)

    // const editReview = () => {
    //     history.push(`/account/reviews/edit/${review.id}`)
    // }

    const deleteReview = async () => {
        console.log(review.id)
    //     // if(check){
    //         // add modal here to make the check work to ask the user
    //         // if they are sure they want to delete that review
    //         // const deletedReview = await dispatch(removeReview(review.id))

    //         // if(deletedReview) alert(deletedReview.message)
    //     // }
    }

    if(!review) return null
    return (
        <div style={{"display":"flex", "justifyContent":"space-between", "alignContent":"center", "gap":"40px", "borderBottom":"lightGray 1px solid"}}>
            <div>
                <h3 style={{"marginBottom":"0px"}}>{spot.name} - {review.stars} stars</h3>
                <p style={{"marginTop":"0px"}}>{review.review}</p>
            </div>
            <div style={{"display":"flex", "alignItems":"center", "gap":"10px"}}>
                {/* <button onClick={editreview} >Edit</button> */}
                {/* <Link to={`/account/reviews/edit/${review.id}`}>Edit</Link>
                <button onClick={deleteReview}>Delete</button> */}
            </div>
        </div>
    )
}
