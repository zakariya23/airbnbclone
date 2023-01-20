import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as reviewActions from "../../store/reviews";
import UserReviewDetails from "./UserReviewDetails";


export default function UserReviews () {
    const dispatch = useDispatch()
    const [ usersReviews, setUsersReviews ] = useState('')
    const reviews = useSelector(state => state.reivews)

    const getReviews = async () => {
        let reviewsOfUsers = await dispatch(reviewActions.userReviews())
        setUsersReviews(reviewsOfUsers.Reviews)
    }

    useEffect(() => {
        getReviews()
    }, [reviews])

    if(!usersReviews) return null
    return (
        <div style={{"margin":"10px", "padding":"0px 10px", "display":"flex", "flexDirection":"column", "border":"lightGray solid 1px", "borderRadius":"10px"}}>
            <h2 style={{"borderBottom":"solid lightgray 1px", "padding":"10px"}}>Your Reviews:</h2>
            {usersReviews.map((review) => (
                <UserReviewDetails key={review.id} {...review} />
                ))}
        </div>
    )
}
