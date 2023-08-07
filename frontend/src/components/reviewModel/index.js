import React, { useState } from "react";
import { useDispatch } from 'react-redux';
// import { deleteSpot } from '../../store/spotsReducer';
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from 'react-router-dom';
import "./CreateREviewModel.css";
import { CreateReview } from "../../store/reviewReducer";

function CreateReviewModel({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('')

    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [message,setMessage]=useState('')

    console.log("=============", spotId);

    const handelCreateReview = () => {

        dispatch(CreateReview(spotId, review, rating))
            .then(() => {
                closeModal();
            })
            .catch(async (error) => {
                const data = await error.json();
                if (data && data.errors) {
                    console.log('********', data)
                    setErrors(data.errors);

                } else {
                    setMessage(data.message)
                    // console.log('!!!!!!!!!!', data.message)
                }
            });
    }
    console.log( "@@@@@@@@@@@", typeof message)
    /////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('')


    }
    /////////////////////////////////


    const handleStarClick = (starValue) => {
        setRating(starValue);

        console.log("***************", rating)
    };


    return (
        <div>
            <form onSubmit={handleSubmit} id='form-review'>
                <h2>How was your stay?</h2>
                <div>
                {message && <div className="error">{message}</div>}
                </div>
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    name="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}

                />
                {errors.review && <div className="error">{errors.review}</div>}
                <p className="star-container">

                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}<span>stars</span>
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button id="submit-review-btn"
                onClick={handelCreateReview}>Submit your Review</button>
            </form>
        </div>
    );
}

export default CreateReviewModel;
