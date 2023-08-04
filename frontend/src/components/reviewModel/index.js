import React, { useState } from "react";
import { useDispatch } from 'react-redux';
// import { deleteSpot } from '../../store/spotsReducer';
import { useModal } from "../../context/Modal";
import "./CreateREviewModel.css";

function CreateReviewModel({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [rating, setRating] = useState(0);

  const handelDeleteSpot = () => {
    console.log("=============", spotId);
    // dispatch(deleteSpot(spotId))
    //   .then(() => {
    //     closeModal();
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting spot:', error);
    //   });
  }


  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <div>
      <h1>HOw was your stay?</h1>
      <p className="star-container">

        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </p>

      <button onClick={closeModal}>Submit your Review</button>
    </div>
  );
}

export default CreateReviewModel;
