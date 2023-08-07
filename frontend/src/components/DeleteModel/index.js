import React from "react";
import { useDispatch } from 'react-redux';
import { deleteSpot,getOwnerAllSpotsThunk } from '../../store/spotsReducer';
import { useModal } from "../../context/Modal";


function DeleteModel({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const handelDeleteSpot =async () => {
    await dispatch(deleteSpot(spotId));
    await dispatch(getOwnerAllSpotsThunk());
     closeModal();

  }

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button onClick={handelDeleteSpot}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}

export default DeleteModel;
//<button onClick={hideModal}>No (Keep Spot)</button>
