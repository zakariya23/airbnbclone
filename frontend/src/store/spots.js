const CREATE = 'spots/CREATE'
const SINGLE = 'spots/SINGLE'
const LOAD = 'spots/LOAD'
const UPDATE = 'spots/UPDATE'
const DELETE = 'spots/DELETE'

const create = (spot) => {
    return {
        type: CREATE,
        spot
    }
}

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

export const updateSpot = (id, spot) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json()
        dispatch(update(spot))
        return spot
    }
}

export const removeSpot = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        const spot = await response.json()
        dispatch(remove(spot))
        return spot
    }
}


const remove = (id) => {
    return {
        type: DELETE,
        id
    }
}

export const createSpot = (id, spot) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json()
        dispatch(create(spot))
        return spot
    }
}

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const spots = await response.json()
        dispatch(loadSpots(spots))
    }
}


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
            newState = { ...state, allSpots: { ...state.allSpots } }
            delete newState.allSpots[action.id]
            return newState
        default:
            return state
    }
}

export default spotsReducer
