// const CREATE = 'spots/CREATE'
const LOAD = 'spots/LOAD'
// const UPDATE = 'spots/UPDATE'
// const DELETE = 'spots/DELETE'

// const createSpot = (spot) => {
//     return {
//         type: CREATE,
//         payload: spot
//     }
// }

const loadSpots = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

// const update = (spot) => {
//     return {
//         type: UPDATE,
//         spot
//     }
// }

// const remove = (id) => {
//     return {
//         type: DELETE,
//         id
//     }
// }

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if(response.ok) {
        const spots = await response.json()
        dispatch(loadSpots(spots))
    }
}


const initialState = { allSpots: {}, singleSpot: { Owner: {}}}

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        // case CREATE:
        case LOAD:
            newState = {...state}
            newState.allSpots = action.spots
            return newState
        // case UPDATE:
        // case DELETE:
        default:
            return state
    }
}

export default spotsReducer
