// import Navigation from "../Navigation";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spotsReducer';
import './all-spots.css'

export default function AllSpots() {
    const dispatch = useDispatch();

    const spots = useSelector(state => state.spotState.allSpots);

    // console.log("=======", spots)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);




    return (

        <div className="init">

            <h1></h1>
            <ul id='spots-list'>
        {Object.values(spots).map((spot) => (
          <li key={spot.id} id='spot-container'>


               <Link to={`spots/${spot.id}`}>
              <img id='img'   src={spot.previewImage} alt="Spot Preview" />
              </Link>


            <div id='address-rating'>
            <p> {spot.address}</p>
            <p><i className="fa-solid fa-star"></i> {spot.avgRating}</p>
            </div>
            <p id='price'> ${spot.price} night</p>

          </li>
        ))}
      </ul>

        </div>
    )

}
