import React from "react";
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spotsReducer';
import { useModal } from "../../context/Modal";
import './reviewDeleteModel.css'
import { deleteReview } from "../../store/reviewReducer";
import { fetchSpotReviews } from "../../store/reviewReducer";
import { fetchDetailedSpot } from "../../store/spotsReducer";

function ReviewDeleteModel({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handelDeleteReview = () => {
        console.log("=============", reviewId);
        dispatch(deleteReview(reviewId))

        .then(() => {
          dispatch(fetchSpotReviews(spotId))
          dispatch(fetchDetailedSpot(spotId))
            closeModal();
          })
          .catch((error) => {
            console.error('Error deleting review:', error);
          });

      }

    return (
        <div id= 'main-review-delete-container'>
          <div id="second-level-main">
          <h1 id="delete-review-header">Confirm Delete</h1>
          <p>Are you sure you want to delete this review?</p>
          <div id="review-buttons-container">
          <button className="delete-button" onClick={handelDeleteReview}>Yes (Delete Review)</button>
          <button className="cancel-button" onClick={closeModal}>No (Keep Review)</button>
          </div>
          </div>
        </div>
      );



}
export default ReviewDeleteModel;
