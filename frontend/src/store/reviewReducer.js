import { csrfFetch } from "./csrf";

// action types
// export const LOAD_REVIEWS = 'reviews/LOAD-REVIEWS'
export const RECEIVE_SPOT_REVIEWS = 'spots/RECEIVE_SPOT_REVIEWS'
export const REMOVE_REVIEW = 'spots/REMOVE-REVIEW'

//Action creator

export const receiveSpotReviews = (spotReviews) => ({
    type: RECEIVE_SPOT_REVIEWS,
    spotReviews
})

export const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
})
//thunks


export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
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

export const CreateReview =(reviewId, review, rating) => async(dispatch)=> {

    try {

        const res = await csrfFetch(`/api/spots/${reviewId}/reviews`, {
          method: 'POST',
          body: JSON.stringify({
              "review": review,
              "stars": rating
            })
        });

        if (!res.ok) {

            const errors = await res.json();
            throw new Error(JSON.stringify(errors));
        }

        const reviewDetails = await res.json();
        // console.log('WWWWWWW', reviewDetails)
        return reviewDetails;

      } catch (error) {
// console.log("8888888888", error)
        throw error;
      }


}

export const deleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        dispatch(removeReview(reviewId))
    } else {
        const errors = await res.json();
        return errors;
    }
}

/// reducer

const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: {}, user: {} }, isLoading: true };


const reviewReducer = (state = initialState, action) => {
    switch (action.type) {



        case RECEIVE_SPOT_REVIEWS:

            const newEstate = { ...state, reviews: { ...state.reviews, spot: {} } };
            // console.log('AAAAAAAA', action)
            if (Object.values(action.spotReviews).length > 0) {
                action.spotReviews.Reviews.forEach(
                    (review) => (newEstate.reviews.spot[review.id] = review))

                // console.log ( '$$$$$$$$$', newEstate)
                return newEstate
            } else {

                return newEstate
            }

case REMOVE_REVIEW:

const newReviews = {...state.reviews.spot}

delete newReviews[action.reviewId]


        default:
            return state;
    }
}
export default reviewReducer
