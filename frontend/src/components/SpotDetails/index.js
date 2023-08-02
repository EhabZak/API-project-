import { Link, useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './spot-details.css'

import { fetchDetailedSpot } from '../../store/spotsReducer';

export default function SpotDetails() {
    const { spotId } = useParams();
    const history = useHistory();
    const [gotoSpot, setGoToSpot] = useState(spotId);
    const spot = useSelector((state) =>state.spotState.singleSpot[spotId]);
// spot = useSelector((state) => state.spots ? state.spots[spotId] : null);
// console.log( '@@@@@@@@@@@@@@@@',spot)
const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId))
    }, [dispatch, spotId])

    // console.log("$$$$$$$$", spot.SpotImages)
if (!spot){
    return null
}
    return (

        <div className="init">



            <h2 id='spot-name'>{spot.name}</h2>
            <p id='spot-city'>{spot.city}, {spot.state}, {spot.country}</p>
<div id='grid-wrapper'>
            <ul id='images'>
                {spot.SpotImages.map((image)=>(
                    <li>
                       <img  src={image.url} alt="spot image"/>
                        </li>
                ) )}

            </ul>
            </div>
            <div id='description-btn'>
                <h2>Hosted by {spot.owner.firstName} {spot.owner.lastName} </h2>

                <div id='reserve-container'>
                    <div id='price-in-reserve'>
                        <p >${spot.price} </p>
                        <div id='night-container'>
                        <p>night</p>
                        </div>
                    </div>

                        <p id='review-in-reserve'> <i className="fa-solid fa-star"></i> {spot.avgStarRating} .  {spot.numReviews} reviews</p>
                    <div id='reserve-btn-container'>
                    <button id='reserve-btn'>Reserve</button>
                    </div>
                </div>
                <p>{spot.description}</p>

            </div>

        </div>
    )

}
