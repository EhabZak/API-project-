import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpot, fetchSpots } from '../../store/spotsReducer';
import './manage-user-spots.css'


export default function ManageSpot() {
    const dispatch = useDispatch();

    const spots = useSelector(state => state.spotState.allSpots);
    const currUser = useSelector(state => state.session.user)


    // console.log("=======", spots)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    const handelDeleteSpot = (spotId) => {

dispatch(deleteSpot(spotId))

    }

    return (

        <div className="init">

            <h2>Manage Your Spots</h2>
            <ul id='spots-list'>
                {Object.values(spots)
                    .filter((spot) => spot.ownerId === currUser.id)
                    .map((spot) => (
                        <li key={spot.id} id='spot-container'>


                            <Link to={`spots/${spot.id}`}>
                                <img id='img' src={spot.previewImage} alt="Spot Preview" />
                            </Link>


                            <div id='address-rating'>
                                <p> {spot.address}</p>
                                <p><i className="fa-solid fa-star"></i> {spot.avgRating}</p>
                            </div>
                            <p id='price'> ${spot.price} night</p>

                            <div id='spot-edit-buttons'>
                                <button onClick={() => handelDeleteSpot(spot.id)}>Delete</button>
                                <Link to={`spots/${spot.id}/edit`}>
                                    <button>Update</button>
                                </Link>
                            </div>

                        </li>
                    ))}
            </ul>

        </div>
    )

}
