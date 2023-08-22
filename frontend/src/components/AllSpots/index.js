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
          <li key={spot.id} className='spot-container'>


               <Link to={`spots/${spot.id}`}>
              <img id='img'   src={spot.previewImage} alt="Spot Preview" />
              </Link>


            <div id='address-rating'>
            <p> {spot.city}, {spot.state}</p>
            <p><i className="fa-solid fa-star" id='review-star'></i> {spot.avgRating.toFixed(1)}</p>
            </div>
            <p id='price'> <span>${spot.price}</span> night</p>

          </li>
        ))}
      </ul>

        </div>
    )

}
