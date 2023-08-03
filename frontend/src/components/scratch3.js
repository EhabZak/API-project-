// spotsReducer.js

// ... (existing imports and code for the reducer)

// Action types
// ... (existing action types)
export const ADD_IMAGE = 'spots/ADD_IMAGE';

// ... (existing action creators)

export const addImage = (spotId, image) => ({
  type: ADD_IMAGE,
  spotId,
  image,
});

// ... (existing thunk action creators)

// Reducer
const initialState = {
  allSpots: {},
  singleSpot: {},
  isLoading: true
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const newEstate = { ...state, allSpots: {} };
      action.spots.spots.forEach((spot) => (newEstate.allSpots[spot.id] = spot));
      return newEstate;

    case RECEIVE_SPOT:
      const receivedSpot = {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          [action.spot.id]: action.spot,
        },
      };
      return receivedSpot;

    case REMOVE_SPOT:
      const newAllSpots = { ...state.allSpots };
      delete newAllSpots[action.spotId];
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
};

export default spotReducer;
