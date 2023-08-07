import { csrfFetch } from "./csrf";


const CREATE_SPOT = "CREATE_SPOT";

export const createSpot = (spot) =>({ type: CREATE_SPOT, spot});

// ***************************createSpotThunk***************************
export const createSpotThunk = (newSpot, newSpotImage, sessionUser) => async (dispatch) => {

  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSpot),
  })

  if (res.ok) {
    const newlyCreateSpot = await res.json();

    const newImagesRes = await Promise.all(newSpotImage.map(async (imageObj) => {
      const imageRes = await csrfFetch(`/api/spots/${newlyCreateSpot.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageObj),
      });
      if(imageRes.ok) {
        const imageData = await imageRes.json();
        return imageData;
      }
    }));
    newlyCreateSpot.SpotImages = newImagesRes;
    newlyCreateSpot.creatorName = sessionUser.username;
    dispatch(createSpot(newlyCreateSpot));
    return newlyCreateSpot;
  }
}

const initialState = { allSpots: {}, singleSpot: {} };

export default function spotReducer2(state = initialState, action) {
  let newState;
  switch (action.type) {
 case CREATE_SPOT:
      // newState = { ...state, singleSpot: {} };
      newState = { ...state };
      // newState.allSpots[action.spot.id] = action.spot;
      newState.singleSpot = action.spot;
      return newState;
    default:
      return state;
  }
}
