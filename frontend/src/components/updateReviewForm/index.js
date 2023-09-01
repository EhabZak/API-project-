import React from 'react'
import { useEffect } from 'react';
import CreateReviewModel from '../reviewModel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotReviews } from '../../store/reviewReducer';
import { fetchDetailedSpot } from "../../store/spotsReducer";



function UpdateReviewForm({reviewId, spotId}) {
    const dispatch = useDispatch();
// console.log ('#########', spotId)
// console.log ('#########', reviewId)


const spot = useSelector((state) => state.spotState.singleSpot[spotId]);
const spotReviews = useSelector((state) => state.reviewState.reviews.spot);

console.log('+++++++spot reviews+++++++', spot.name)

const spotReview = Object.values(spotReviews).find((review) => review.id === reviewId)
const spotName = spot.name

// console.log( '0000000spot review ====', spotReview)

const currReview = {
    "review": spotReview.review,
    "stars": spotReview.stars
}

console.log('currReview=========', currReview)

useEffect(() => {
    dispatch(fetchSpotReviews(spotId))
    dispatch(fetchDetailedSpot(spotId))


}, [dispatch, spotId])


//  if (!spotReviews) return (<></>);


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
