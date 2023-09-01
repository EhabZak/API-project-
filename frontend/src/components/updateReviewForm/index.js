import React from 'react'
import { useEffect } from 'react';
import CreateReviewModel from '../reviewModel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotReviews } from '../../store/reviewReducer';
import { fetchDetailedSpot } from "../../store/spotsReducer";



function UpdateReviewForm({reviewId, spotId}) {
    const dispatch = useDispatch();
console.log ('#########', spotId)
console.log ('#########', reviewId)


const spot = useSelector((state) => state.spotState.singleSpot[spotId]);
const spotReviews = useSelector((state) => state.reviewState.reviews.spot[reviewId]);

useEffect(() => {
    dispatch(fetchDetailedSpot(spotId))
    dispatch(fetchSpotReviews(spotId))


}, [dispatch, spotId])


 if (!spotReviews) return (<></>);
// console.log('+++++++spot +++++++', spot)
// console.log('+++++++spot reviews+++++++', spotReviews)

// const spotReview = Object.values(spotReviews).find((review) => review.id === reviewId)
// const spotName = spot.name

// console.log( '0000000spot review ====', spotReview)

const currReview = {
    "reviewId":  spotReviews.id,
    "review": spotReviews.review,
    "stars": spotReviews.stars
}

console.log('currReview=========', currReview)



    return (
        <>


            <  CreateReviewModel

                spotId={spotId}
                formType='update review'
                currReview = {currReview}

            />



        </>
    )
}

export default UpdateReviewForm
/*fetch all reviews for a spot with the spotID
iterate over the reviews array the review with the review ID using (reviews.find)
then forward that review to the review model
so you will send props formType ,

*/
