import React from "react";
import { useDispatch } from 'react-redux';
import { deleteSpot,getOwnerAllSpotsThunk } from '../../store/spotsReducer';
import { useModal } from "../../context/Modal";
import "./delete.css"

function DeleteModel({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const handelDeleteSpot =async () => {
    await dispatch(deleteSpot(spotId));
    await dispatch(getOwnerAllSpotsThunk());
     closeModal();

  }

  return (
    <div id="delete-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div id="delete-buttons">
      <button onClick={handelDeleteSpot}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  );
}

export default DeleteModel;
//<button onClick={hideModal}>No (Keep Spot)</button>
