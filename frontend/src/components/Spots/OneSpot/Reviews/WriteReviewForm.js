import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { reviewCreate } from "../../../../store/reviews"
import './WriteReviewForm.css';

export default function CreateReviewForm ({ hideForm }) {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0); // initialize with 0
    const user = useSelector(state => state.session.user)
    const handleStarClick = (index) => {
        setRating(index + 1);
        setStars(index + 1);
      };
    const {id} = useParams()

    const [ review, setReview ] = useState('')
    const [ stars, setStars ] = useState(0)
    const [ errors, setErrors ] = useState([])
    const [ url, setURL ] = useState('')

    const updateReview = (e) => setReview(e.target.value)
    const updateStars = (e) => setStars(e.target.value)
    const updateURL = (e) => setURL(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])

        const payload = {
            review,
            stars
        }

        let createdReview = await dispatch(reviewCreate(id, payload, user, url)).catch(
            async (res) => {
              const data = await res.json();
              if (data && data.message) setErrors([data.message]);
            }
          );

        console.log('createdReview', createdReview)

        if(createdReview){
            hideForm()

            setReview('')
            setStars('')
            setURL('')
        }
    }

    const handleCancelClick = (e) => {
        e.preventDefault()
        hideForm()

    }
    return (
        <div>
            <h4>Review:</h4>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <input
                    type={'text'}
                    placeholder={'Leave a review'}
                    required
                    value={review}
                    onChange={updateReview}
                />
                <input
                    type={'number'}
                    placeholder={'Stars'}
                    required
                    value={stars}
                    onChange={updateStars}
                    readOnly
                />
                <div className="star-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`fa fa-star ${i < rating ? "selected" : ""}`}
            onClick={() => handleStarClick(i)}
          />
        ))}
      </div>
                <input
                    type={'text'}
                    placeholder={'Review image (optional)'}
                    value={url}
                    onChange={updateURL}
                />
                <button type="submit">Submit</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
        </div>
    )
}
