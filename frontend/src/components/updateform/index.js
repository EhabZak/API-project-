
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SpotDetails from '../SpotDetails';

import SpotForm from '../spotForm';
import { fetchDetailedSpot } from '../../store/spotsReducer';
import './updateForm.css'

const UpdateSpotForm =() => {

const {spotId} = useParams()
console.log( 'spotId' , spotId)
const spot= useSelector ((state) => state.spotState.singleSpot[spotId] );
console.log('SPOT', spot)
const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchDetailedSpot(spotId))


}, [dispatch,spotId])

if (!spot) return (<></>);

console.log('777777777777777777', Object.keys(spot).length)
console.log('*****************', spot)

return (


    Object.keys(spot).length > 1 && (
      <>
      <div>
      <h1 class='header'>Update your spot</h1>
      </div>
        <SpotForm
          spot={spot}
          formType="Update Report"
        />
      </>
    )
  );

}


export default UpdateSpotForm
