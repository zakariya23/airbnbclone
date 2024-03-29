import { csrfFetch } from "./csrf"

const CREATE = 'spots/CREATE'
const SINGLE = 'spots/SINGLE'
const LOAD = 'spots/LOAD'
const UPDATE = 'spots/UPDATE'
const DELETE = 'spots/DELETE'
const ADD_IMAGE = 'spots/ADD_IMAGE';
const DELETE_IMAGE = 'spots/DELETE_IMAGE';

const create = (spot) => {
    return {
        type: CREATE,
        spot
    }
}

const deleteImage = (spotId, imageId) => {
    return {
      type: DELETE_IMAGE,
      spotId,
      imageId,
    };
  };

const addImage = (spotId, image) => {
    return {
      type: ADD_IMAGE,
      spotId,
      image
    };
  };

const loadSpots = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

const oneSpot = (spot) => {
    return {
        type: SINGLE,
        spot
    }
}

const update = (spot) => {
    return {
        type: UPDATE,
        spot
    }
}


export const getSpotById = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`)

    if (response.ok) {
        const spot = await response.json()
        dispatch(oneSpot(spot))
    }
}

export const updateSpot = (id, spot, url) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json()
        spot.previewImage = url || null
        dispatch(update(spot))
        return spot
    }
}

export const removeSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        const spot = await response.json()
        dispatch(remove(id))
        return spot
    }
}


const remove = (id) => {
    return {
        type: DELETE,
        id
    }
}

export const addSpotImage = (spotId, imageUrl, preview) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: imageUrl, preview }),
    });
    console.log(response)
    if (response.ok) {
      const image = await response.json();
      dispatch(addImage(spotId, image));
    }
  };


export const createSpot = (spot, spotImage) => async dispatch => {
    spot.lat = 21
    spot.lng = 22
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json()
        const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(spotImage)
          })

        if(imageResponse.ok){
            const image = await imageResponse.json()
            spot.previewImage = image.url
            dispatch(create(spot))
            return spot
        }
    }
}



export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const spots = await response.json()
        dispatch(loadSpots(spots))
    }
}

export const getSpotsOfUser = () => async dispatch => {
    const response = await fetch('/api/spots/current')

    if(response.ok){
        const spots = await response.json()
        return spots
    }
}

export const deleteSpotImage = (spotId, imageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/images/${imageId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await response.json();
      dispatch(deleteImage(spotId, imageId));
    }
  };


const initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE:
            newState = { ...state, allSpots: { ...state.allSpots } }
            newState.allSpots[action.spot.id] = action.spot
            return newState
        case LOAD:
            newState = { ...state, allSpots: { ...state.allSpots } }
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            });
            return newState
        case SINGLE:
            newState = { ...state, allSpots: { ...state.allSpots } }
            newState.singleSpot = action.spot
            return newState
        case UPDATE:
            newState = { ...state, allSpots: { ...state.allSpots } }
            newState.allSpots[action.spot.id] = action.spot
            return newState
        case DELETE:
            newState = {...state, allSpots: {...state.allSpots} }
            delete newState.allSpots[action.id]
            return newState
        case ADD_IMAGE: {
                newState = { ...state, allSpots: { ...state.allSpots } };
                const currentImages = newState.allSpots[action.spotId].images;
                newState.allSpots[action.spotId].images = Array.isArray(currentImages)
                    ? [...currentImages, action.image]
                    : [action.image];
                return newState;
            }
            case DELETE_IMAGE: {
                newState = { ...state, allSpots: { ...state.allSpots } };
                const currentImages = newState.allSpots[action.spotId]?.images;
                if (currentImages) {
                    newState.allSpots[action.spotId].images = currentImages.filter((image) => image.id !== action.imageId);
                }
                newState.singleSpot = { ...newState.singleSpot };
                newState.singleSpot.images = newState.allSpots[action.spotId]?.images || [];
                return newState;
            }

        case "spots/updateReviews":
                const { spotId, reviews } = action.payload
                return {
                  ...state,
                  allSpots: {
                    ...state.allSpots,
                    [spotId]: {
                      ...state.allSpots[spotId],
                      reviews,
                    },
                  },
                }
        default:
            return state
    }
}

export default spotsReducer
