import ReviewInfo from "./ReviewInfo"

export default function Reviews ({reviews}) {

    return (
        <div>
            {reviews.map(review => (
                <ReviewInfo key={review.id} {...review}/>
            ))}
        </div>
    )
}
