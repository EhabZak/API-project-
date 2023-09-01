import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews } from '../../store/reviewReducer';
import OpenModalButton from "../OpenModalButton";
import ReviewDeleteModel from '../reviewDeleteModel';
import { fetchSpots } from '../../store/spotsReducer';
import './manage-reviews.css'
import UpdateReviewForm from '../updateReviewForm';




function ManageReviews() {
    const dispatch = useDispatch();

    const spots = useSelector(state => state.spotState.allSpots);
    const currUser = useSelector(state => state.session.user)
    const userReviews = useSelector(state => state.reviewState.reviews.user)


    // console.log('%%%%%%%', userReviews)
    // console.log('$$$$$$$', spots)

    /////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchUserReviews());
        dispatch(fetchSpots())

    }, [dispatch]);

    /////////////////////////////////////////

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };


    ////////////////////////////////////////

    return (
        <div className="init-manage">
            <div id='manage-header-container'>
                <div id='manage-reviews-header'>
                    <h2 >Manage Reviews</h2>

                </div>
                <ul id='manage-reviews-list'>
                    {Object.values(userReviews).map((review) => (
                        <li key={review.id} id='manage-review-container'>

                            <h3> {Object.values(spots).find((spot) => spot.id === review.spotId)?.name || ''}</h3>
                            <p id='review-date'>{formatDate(review.createdAt)}</p>
                            <p>{review.review}</p>


                            <div id='review-edit-buttons'>

                                <div>
                                    <OpenModalButton
                                        buttonText="Update"
                                        modalComponent={<UpdateReviewForm reviewId={review.id} spotId={review.spotId} />}
                                    />
                                </div>

                                <div ><OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<ReviewDeleteModel reviewId={review.id} spotId={review.spotId} />}
                                />
                                </div>

                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ManageReviews
/* create a review edit model that takes us to create review filled up
which means we have to add two files like create and update form if type id create
and if type is create
in reviews reducer we need to create fetch all reviews and update reviews thunks and actions
and reducers



*/
