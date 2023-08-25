// we need to read the reviews of a specific spot on the page so it will be like edit we need the spot number passed
//down from the spot detail page

// we need to pass props with the spot idea from spot detail page

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spotsReducer';
import { fetchSpotReviews } from '../../store/reviewReducer';
import CreateReviewModel from '../reviewModel';
// import OpenModalButton from "../OpenModalButton";
import OpenModalButton from "../OpenModalButton";
import ReviewDeleteModel from '../reviewDeleteModel';
import './spotReviews.css'

export default function SpotReviews({ spotId }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const spot = useSelector((state) => state.spotState.singleSpot[spotId]);
    // console.log("rrrrrrrr", spot)
    const reviews = useSelector((state) => state.reviewState.reviews.spot)
    // console.log("55555555", reviews)

    // if (!reviews){
    //     return null
    // }
    useEffect(() => {
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])

    //////////////////////////////////////////////

    let reviewButton;
    if (sessionUser) {

        let userReview = [];

        Object.values(reviews).filter((review) => {
            if (review.userId === sessionUser.id || spot.ownerId === sessionUser.id) {
                userReview.push(review.id)
            }
        })

        // console.log( "***userReview array",userReview)
        if (userReview.length < 1 && spot.ownerId !== sessionUser.id) {
            reviewButton = (

                <div id='spot-edit-buttons'>
                    <div>
                        <OpenModalButton
                            buttonText="Post Your Review"
                            modalComponent={<CreateReviewModel spotId={spot.id} />}
                        />
                    </div>
                </div>

            )
        } else {
            <></>
        }
    } else {
        <></>

    }

    //////////////////////////////////////////////////////////////////////////////
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };
    ////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////
    let reviewsList;
    if (Object.values(reviews).length > 0) {
        // console.log('1111111', reviews)
        reviewsList = (
            <ul id="reviews-list">
                {Object.values(reviews).reverse().map((review) => (
                    <li key={review.id} id="review-container">
                        {/* {console.log('999999', review)} */}
                        <p><i className="fa-regular fa-circle-user" id='user-review-logo'></i> {review.User.firstName}</p>
                        <p id='review-date'>{formatDate(review.createdAt)}</p>
                        <p>{review.review}</p>

                        <div>
                            {sessionUser && review.userId === sessionUser.id ? (
                                <div id='delete-review-button'><OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<ReviewDeleteModel reviewId={review.id} spotId={spot.id} />}
                                />
                                </div>
                            ) : null}
                        </div>

                    </li>
                ))}
            </ul>
        );
    } else {
        // console.log('22222222', reviews)
        if (sessionUser && spot.ownerId !== sessionUser.id) {

            reviewsList = <p>Be the first to post a review!</p>;
        }
    }
    ///////////////////////////////////////////////////////////////////////////
    let reviewRating;
    if (Object.values(reviews).length === 0) {
        reviewRating = (

            <p><i className="fa-solid fa-star" id='review-star'></i> New</p>
        )

    } else {
        reviewRating = (

            <p id='review-in-reviews'>
            <i className="fa-solid fa-star" id='review-star'></i>
            {spot.avgStarRating !== undefined? spot.avgStarRating.toFixed(1): spot.avgStarRating}
                <span id='dot-container'><span className="dot">
                    <i className="fa-solid fa-circle"></i></span> </span>  {spot.numReviews}
                 {Object.values(reviews).length === 1 ? <span> review</span> : <span> reviews</span>}
            </p>

        )
    };


    /////////////////////////////////////////////////////////////////////


    return (
        <div className="init-reviews">

            <div>
                {reviewRating}
                <div>

                    {reviewButton}

                </div>



            </div>
            {reviewsList}
        </div>
    )

}
