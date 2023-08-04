// we need to read the reviews of a specific spot on the page so it will be like edit we need the spot number passed
//down from the spot detail page

// we need to pass props with the spot idea from spot detail page

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spotsReducer';
import { fetchSpotReviews } from '../../store/reviewReducer';
import CreateReviewModel from '../reviewModel';

export default function SpotReviews({spotId}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const spot = useSelector((state) => state.spotState.singleSpot[spotId]);
    console.log("=======", spot)
    const reviews = useSelector((state) => state.reviewState.reviews.spot)
    console.log("=======", reviews)

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])

    //////////////////////////////////////////////

    // we need the create a review button only if a user is logged in same as
    // create a spot button



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };
    ////////////////////////////////////////////////////////////////
const userReviews =[]
// {Object.values(reviews).map((review) => (
// if (user.id !== reviews.User.id  || user.id !== spot.owner.id){
//     userReviews.push(review.id)
// }
// ))}
    let sessionLinks;
    if (sessionUser) {
        if (userReviews.length< 1){

        sessionLinks = (

            <button> Post Your Review</button>
        );
    }
    } else {
        sessionLinks = (
            <></>
        );
    }

    return (
        <div className="init-reviews">

            <h1>Reviews</h1>
            <div>
                <p id='review-in-reserve'> <i className="fa-solid fa-star"></i> {spot.avgStarRating} .  {spot.numReviews} reviews</p>
                {/* { isLoaded && sessionLinks} */}
                <button> Post Your Review</button>
            </div>

            <ul id='reviews-list'>
                {Object.values(reviews).map((review) => (
                    <li key={review.id} id='review-container'>
                        {console.log('999999', review)}
                        <p>{review.User.firstName} </p>
                        <p>{formatDate(review.createdAt)}</p>
                        <p>{review.review}</p>



                    </li>
                ))}
            </ul>

        </div>
    )

}
