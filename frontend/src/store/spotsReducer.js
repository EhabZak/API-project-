
import { csrfFetch } from "./csrf";
// action types
export const LOAD_SPOTS = 'spots/LOAD-SPOT'
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'
export const UPDATE_SPOT = 'spots/UPDATE-SPOT'
export const REMOVE_SPOT = 'spots/REMOVE-SPOT'
export const ADD_IMAGE = 'spots/ADD_IMAGE';
//action creators

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot
})


export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

export const addImage = (spotId, image) => ({
    type: ADD_IMAGE,
    spotId,
    image,
  });

// thunk action creator

export const fetchSpots = () => async (dispatch) => {

    const response = await fetch('api/spots')

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))
    }
    // console.log("*********", spots)

}

export const fetchDetailedSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    // console.log( "^^^^^^^^^^^", res)
    if (res.ok) {
        const spotDetails = await res.json();
        // console.log( "^^^^^^^^^^^", spotDetails)
        dispatch(receiveSpot(spotDetails))
    } else {
        const errors = await res.json();
        return errors;
    }

}

export const deleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if(res.ok) {
        dispatch(removeSpot(spotId))
    }else {
        const errors = await res.json();
        return errors;
    }
}

export const createSpot = (spot) => async(dispatch)=> {
const res= await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
} )

}

export const updateSpot =(spot) => async (dispatch) => {
const res = await csrfFetch(`/api/spots/${spot.id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(spot)
})

if (res.ok) {
    const updatedSpot = await res.json();
    dispatch(editSpot(updatedSpot))
}else {
    const errors = await res.json();
    return errors;
}

}


/// reducer

const initialState = { allSpots: {}, singleSpot: {}, isLoading: true };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_SPOTS:
            const newEstate = { ...state, allSpots: {} }; // to not have stail state /for the update you will need to bring in {state.allspots}
            action.spots.Spots.forEach(
                (spot) => (newEstate.allSpots[spot.id] = spot)
            );
            // console.log("&&&&&&&&&&&&&&&&",newEstate.allspots)
            return newEstate

        case RECEIVE_SPOT:

            const receivedSpot = {
                ...state,
                singleSpot: {
                    ...state.singleSpot,
                    [action.spot.id]: action.spot
                }
            }
            //const receivedSpot = { ...state, [action.spot.id]: action.spot }
            // console.log("&&&&&&&&&&&&&&&&",receivedSpot.singleSpot)
            return receivedSpot;

        case REMOVE_SPOT:
            // const newState = { ...state, allSpots: {} };
            const newAllSpots = { ...state.allSpots };

            console.log('************', action.spotId)

            delete newAllSpots[action.spotId];
            // delete newState[action.allSpots.spotId];
            return {
                ...state,
                allSpots: newAllSpots,
            };

case UPDATE_SPOT:
    return {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          [action.spot.id]: action.spot,
        },
      };

      case ADD_IMAGE:
        const spotId = action.spotId;
        const image = action.image;
        const spotCopy = { ...state.singleSpot[spotId] };
        const updatedImages = [...spotCopy.SpotImages, image];
        spotCopy.SpotImages = updatedImages;

        return {
          ...state,
          singleSpot: {
            ...state.singleSpot,
            [spotId]: spotCopy,
          },
        };

        default:
            return state;
    }
}
export default spotReducer
