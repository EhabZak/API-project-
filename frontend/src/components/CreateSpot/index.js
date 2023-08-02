import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDetailedSpot } from '../../store/spotsReducer';
// import { CreateSpot,updateSpot } from '../../store/spotsReducer';

export default function CreateSpot({spot,formType}) {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    // const spot = useSelector((state) =>state.spotState.singleSpot[spotId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        //////////////////////////////////

        // if (formType === 'Update Spot') {
        //     const editedSpot = await dispatch(updateSpot(spot));
        //     spot = editedSpot;
        //   } else if (formType === 'Create Spot') {
        //     const newSpot = await dispatch(createSpot(spot));
        //     spot = newSpot;
        //   }

        ///////////////////////////////////


        if (spot.errors) {
            setErrors(spot.errors);
          } else {
            history.push(`/`);
          }
    }

    return (
        <form onSubmit={handleSubmit}>
        <h1 > create a spot </h1>
        </form>
    )
}
