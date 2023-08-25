import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpot, fetchSpots } from '../../store/spotsReducer';
import './manage-user-spots.css'
import DeleteModel from '../DeleteModel';
import OpenModalButton from "../OpenModalButton";

export default function ManageSpot() {
    const dispatch = useDispatch();

    const spots = useSelector(state => state.spotState.allSpots);
    const currUser = useSelector(state => state.session.user)


    // console.log("=======", spots)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    // const handelDeleteSpot = (spotId) => {

    //     dispatch(deleteSpot(spotId))

    // }

    return (

        <div className="init-manage">
            <div id='manage-header-container'>
                <div id='manage-header'>
                <h2 >Manage Your Spots</h2>
                <button id='manage-header-button' >
                    <Link to={"/create-spot"} id="custom-link">
                        Create a New Spot
                    </Link>
                </button>
                </div>
            <ul id='manage-spots-list'>
                {Object.values(spots)
                    .filter((spot) => spot.ownerId === currUser.id)
                    .map((spot) => (
                        <li key={spot.id} id='manage-spot-container'>


                            <Link to={`spots/${spot.id}`}>
                                <img id='img' src={spot.previewImage} alt="Spot Preview" />
                            </Link>


                            <div id='address-rating'>
                                <p> {spot.address}</p>
                                <p><i className="fa-solid fa-star" id='manage-star'></i> {spot.avgRating}</p>
                            </div>
                            <p id='price'> ${spot.price} night</p>

                            <div id='spot-edit-buttons'>
                                <Link to={`/spots/${spot.id}/edit`} >
                                    <button>Update</button>
                                </Link>
                                <div ><OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteModel spotId={spot.id} />}
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
//onClick={() => handelDeleteSpot(spot.id)}
