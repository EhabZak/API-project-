import { csrfFetch } from "./csrf";

// action types
// export const LOAD_REVIEWS = 'reviews/LOAD-REVIEWS'
export const RECEIVE_SPOT_REVIEWS = 'spots/RECEIVE_SPOT_REVIEWS'
export const REMOVE_REVIEW = 'spots/REMOVE-REVIEW'
export const RECEIVE_USER_REVIEWS = 'reviews/RECEIVE_USER_REVIEWS'

//Action creator

export const receiveSpotReviews = (spotReviews) => ({
    type: RECEIVE_SPOT_REVIEWS,
    spotReviews
})

export const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
})

export const receiveUserReviews =(userReviews) => ({
    type: RECEIVE_USER_REVIEWS,
    userReviews
})

//thunks


export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    // console.log("###########", res)
    if (res.ok) {
        const spotReviews = await res.json();

        console.log( "^^^^^^^^^^^", spotReviews)
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


export const fetchUserReviews = () => async (dispatch) => {

const res= await csrfFetch(`/api/reviews/current`)
if (res.ok) {
    const currentUserReviews = await res.json()
    dispatch(receiveUserReviews(currentUserReviews))
    console.log('*****current user reviews',currentUserReviews)
}else {
    const errors = await res.json();
    return errors;
}


}


/// reducer

const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: {}, user: {} }, isLoading: true };


const reviewReducer = (state = initialState, action) => {
    switch (action.type) {



        case RECEIVE_SPOT_REVIEWS:

            const newState = { ...state, reviews: { ...state.reviews, spot: {} } };
            // console.log('AAAAAAAA', action)
            if (Object.values(action.spotReviews).length > 0) {
                action.spotReviews.Reviews.forEach(
                    (review) => (newState.reviews.spot[review.id] = review))

                // console.log ( '$$$$$$$$$', newEstate)
                return newState
            } else {

                return newState
            }

            case RECEIVE_USER_REVIEWS:
                const newUserState = {...state,reviews:{...state.reviews, user:{}}}

                if (Object.values(action.userReviews).length > 0) {
                    action.userReviews.Reviews.forEach((review) =>
                    ( newUserState.reviews.user[review.id] = review))
                    return newUserState
                }else {

                    return newUserState
                }


case REMOVE_REVIEW:

const newReviews = {...state.reviews.spot}
const newReviewsUser = { ...state.reviews.user};

// console.log('!!!!!new reviews!!!', newReviews)
delete newReviews[action.reviewId]
delete newReviewsUser[action.reviewId];

return {
    ...state,
    reviews: {
        ...state.reviews,
        spot: newReviews,
        user: newReviewsUser
    }
};


        default:
            return state;
    }
}
export default reviewReducer
