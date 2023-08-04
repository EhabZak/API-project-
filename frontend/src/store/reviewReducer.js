import { csrfFetch } from "./csrf";

// action types
export const LOAD_REVIEWS = 'reviews/LOAD-REVIEWS'
export const RECEIVE_SPOT_REVIEWS = 'spots/RECEIVE_SPOT_REVIEWS'

//action creators

// export const loadReviews = (reviews) => {
//     return {
//         type: LOAD_REVIEWS ,
//         spots
//     }
// }

export const receiveSpotReviews = (spotReviews) => ({
    type: RECEIVE_SPOT_REVIEWS,
    spotReviews
})



// thunk action creator

// export const fetchSpots = () => async (dispatch) => {

//     const response = await fetch('api/reviews')

//     if (response.ok) {
//         const reviews= await response.json();
//         dispatch(loadReviews(reviews))
//     }
// }

export const fetchSpotReviews = (spotId) => async (dispatch)=> {
const res= await csrfFetch(`/api/spots/${spotId}/reviews`)
// console.log("###########", res)
  if (res.ok) {
    const spotReviews = await res.json();

    // console.log( "^^^^^^^^^^^", spotReviews)
    dispatch(receiveSpotReviews(spotReviews))
} else {
    const errors = await res.json();
    return errors;
}

}





/// reducer

const initialState = { allSpots: {}, singleSpot: {},reviews: {spot:{}, user:{}}, isLoading: true };


const reviewReducer = (state = initialState, action) => {
    switch (action.type) {

        // case LOAD_REVIEWS:
        //     const newEstate = { ...state, reviews: {} }; // to not have stail state /for the update you will need to bring in {state.allspots}
        //     action.reviews.reviews.forEach(
        //         (review) => (newEstate.reviews[review.id] = review)
        //     );
        //     // console.log("&&&&&&&&&&&&&&&&",newEstate.reviews)
        //     return newEstate

case RECEIVE_SPOT_REVIEWS:

const newEstate = { ...state, reviews: { ...state.reviews, spot: {} } };
// console.log('AAAAAAAA', action)
action.spotReviews.Reviews.forEach(
    (review)=> (newEstate.reviews.spot[review.id]= review))

console.log ( '$$$$$$$$$', newEstate)
return newEstate


        default:
            return state;
    }
}
export default reviewReducer
