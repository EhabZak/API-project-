import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import "./CreateREviewModel.css";
import { CreateReview } from "../../store/reviewReducer";
import { fetchSpotReviews } from "../../store/reviewReducer";
import { fetchDetailedSpot } from "../../store/spotsReducer";

function CreateReviewModel({ spotId }) {
    const dispatch = useDispatch();
    const history = useHistory();;
    const { closeModal } = useModal();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    /////////////////////////////////////////////////



    const handelCreateReview = (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');

        dispatch(CreateReview(spotId, review, rating))
            .then(() => {
                dispatch(fetchSpotReviews(spotId))
                dispatch(fetchDetailedSpot(spotId))
                closeModal();
            })
            .catch(async (error) => {
                const data = await error.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setMessage(data.message);
                }
            });

    }
console.log( '*****review****', review)

    //////////////////////////////////////////////////////////


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrors({});
    //     setMessage('');

        // history.push(`/spots/${spotId}`)
    // }
    //////////////////////////////////////////////////////////

    const handleStarClick = (starValue) => {
        setRating(starValue);
        updateSubmitButtonDisabled(starValue, review);
    };

    const handleReviewChange = (e) => {
        const newReview = e.target.value;
        setReview(newReview);
        updateSubmitButtonDisabled(rating, newReview);
    };

    const updateSubmitButtonDisabled = (starValue, newReview) => {
        setSubmitButtonDisabled(!(starValue >= 1 && newReview.length >= 10));
    }

    return (
        <div>
            <form onSubmit={handelCreateReview} id='form-review'>
                <h2>How was your stay?</h2>
                <div>
                    {message && <div className="error">{message}</div>}
                </div>
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    name="review"
                    value={review}
                    onChange={handleReviewChange}
                />
                {errors.review && <div className="error">{errors.review}</div>}
                <p className="star-container"><b> Stars</b>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleStarClick(star)}
                            className={rating >= star ? "star clicked" : "star"}
                        >
                            <i className="fa-solid fa-star" id='review-rating-star'></i>
                        </span>
                    )).reverse()}
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button
                    id="submit-review-btn"
                    type="submit"
                    // onClick={handelCreateReview}
                    disabled={submitButtonDisabled}
                >
                    Submit your Review
                </button>
            </form>
        </div>
    );
}

export default CreateReviewModel;
