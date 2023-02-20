import { useDispatch, useSelector } from "react-redux"
import { removeReview } from "../../../../store/reviews"


export default function ReviewInfo (review) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)

    const deleteAReview = async () => {
        const deletedReview = await dispatch(removeReview(review.id, review.spotId))

    }

    if(!review.User) return null


    return (
        <div style={{"marginTop":"30px","display":"block", "gap":"100px", "borderBottom":"lightGray 1px solid"}}>
            <div>
            <h4 style={{"marginBottom":"0px"}}>
            <span style={{"fontWeight":"normal"}}>
    <i className="fa-sharp fa-solid fa-star" style={{"color": "yellow"}}></i></span> {review.stars}
                </h4>
                <h4 style={{"marginBottom":"0px"}}>
                    {review.User.firstName} {review.User.lastName}
                </h4>
                <p style={{"marginTop":"0px"}}>
                    {review.review}
                </p>
            </div> {review.ReviewImages.length ? (
                <img style={{"height":"100px", "width":"100px"}} src={review.ReviewImages[0].url} alt={'pic'}/>
            ) : (null)}

{user && user.id === review.userId && (
                <button onClick={deleteAReview}>Delete review </button>

            )}
        </div>
    )
}
