import { csrfFetch } from "./csrf";

const CREATE = 'reviews/CREATE'
const USER = 'reviews/USER'
const SPOT = 'reviews/SPOT'
const UPDATE = 'reviews/UPDATE'
const DELETE = 'reviews/DELETE'



const createReview = (review) => {
    return {
        type: CREATE,
        review
    }
}

const loadUserReviews = (reviews) => {
    return {
        type: USER,
        reviews
    }
}

const loadSpotReviews = (reviews) => {
    return {
        type: SPOT,
        reviews
    }
}

const updateReview = (review) => {
    return {
        type: UPDATE,
        review
    }
}

const deleteReview = (reviewId) => {
    return {
        type: DELETE,
        reviewId
    }
}

export const reviewCreate = (spotId, review, user, imageUrl) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review)
      })
      //   ReviewImages:[]
      //   User: {id: 1, firstName: 'Demo', lastName: 'lition'}

      if(response.ok){
        const review = await response.json()
        if(imageUrl){
            const imageResponse = await csrfFetch(`/api/reviews/${review.id}/images`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url: imageUrl})
            })

            if(imageResponse.ok){
                const image = await imageResponse.json()
                review.ReviewImages = []
                review.ReviewImages.push(image)
                review.User = user
                dispatch(createReview(review))
                return review
            }
        } else {
            review.ReviewImages = []
            review.User = user
            dispatch(createReview(review))
            return review
        }
      }
    // const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    //     method: 'POST',
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(review)
    //   })
    // if(response.ok){
    //     const review = await response.json()
        // const imageResponse = await csrfFetch(`/api/reviews/${review.id}/images`, {
        //     method: 'POST',
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify(imageUrl)
        //   })
    //     if(imageResponse.ok) {
    //         const image = await imageResponse.json()
    //         review.ReviewImages = [...review.ReviewImages, image]
    //         dispatch(createReview(review))
    //         return review
    //     }
    // }
}

// export const createReviewImage = (reviewId, imageUrl) => async dispatch => {
//     const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(imageUrl)
//       })

//     if(response.ok) {
//         const image = await response.json()
//         dispatch(spotReviews())
//         return image
//     }
// }

export const userReviews = (reviews) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)

    if(response.ok){
        const reviews = await response.json()
        dispatch(loadUserReviews(reviews))
        return reviews
    }
}

export const spotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const reviews = await response.json()
        dispatch(loadSpotReviews(reviews))
        // return reviews
    }
}

export const reviewUpdate = (spotId, review) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/:reviewId`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review)
      })

    if(response.ok){
        const review = await response.json()
        dispatch(updateReview(review))
        // return review
    }
}

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"}
      })

    if(response.ok) {
        const review = await response.json()
        dispatch(deleteReview(reviewId))
        return review
    }
}

const initialState = { spot: {}, user: {} }

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {

        case CREATE:

            newState = {...state, spot: {...state.spot}}
            newState.spot[action.review.id] = action.review
            return newState
            //return {...state, spot: {...state.spot, [action.review.id]: action.review}}
        case USER:
            newState = {...state, user: {...state.user}}
            action.reviews.Reviews.forEach(review => {
                newState.user[review.id] = review
            });
            return newState
        case SPOT:
            newState = {...state, spot: {}}
            action.reviews.Reviews.forEach(review => {
                newState.spot[review.id] = review
            });
            return newState
        case UPDATE:
            return {...state, spot: {...state.spot, [action.review.id]: action.review}}
        case DELETE:
            newState = {spot: {...state.spot}, user: {...state.user}}

            if(newState.spot[action.reviewId]) delete newState.spot[action.reviewId]
            if(newState.user[action.reviewId]) delete newState.user[action.reviewId]
            return newState
        default:
            return state
    }
}

export default reviewReducer
