import { Link, useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './spot-details.css'

import { fetchDetailedSpot } from '../../store/spotsReducer';
import SpotReviews from '../SpotReviews';


export default function SpotDetails() {
    const { spotId } = useParams();
    const history = useHistory();
    const [gotoSpot, setGoToSpot] = useState(spotId);
    const spot = useSelector((state) => state.spotState.singleSpot[spotId]);
    const reviews = useSelector((state) => state.reviewState.reviews.spot)
    // spot = useSelector((state) => state.spots ? state.spots[spotId] : null);

    // console.log( '@@@@@@ spot @@@@@@',spot)
    // console.log( '!!!!!!spotID @@@@@@',spotId)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId))
    }, [dispatch, spotId])

    // console.log("$$$$$$$$", spot.SpotImages)
    if (!spot) {
        return null
    }
    // console.log('222222spotImages22222', spot.spotImages)
    // console.log('111spot111', spot)
    ////////////////////////////////////////////////////////
    let reviewRating;
    if (Object.values(reviews).length === 0) {
        reviewRating = (

            <p><i className="fa-solid fa-star" id='review-star'></i> New</p>
        )

    } else {
        reviewRating = (

            <p id='review-in-reviews'> <i className="fa-solid fa-star" id='review-star'></i>
             {spot.avgStarRating !== undefined? spot.avgStarRating.toFixed(1): spot.avgStarRating}
             <span id='dot-container'><span className="dot"><i className="fa-solid fa-circle"></i></span> </span>
               {spot.numReviews}
               {Object.values(reviews).length === 1 ? <span> review</span> : <span> reviews</span>}
               </p>

        )};


    ////////////////////////////////////////////////////

    const handleReserveClick = () => {

        alert('Feature Coming soon');
    };



    ///////////////////////////////////////////////////////
    return (
        <div id='main-container'>
            <div className="init-details-container">
                <div id='spot-details-container'>


                    <h2 id='spot-name'>{spot.name}</h2>
                    <p id='spot-city'>{spot.city}, {spot.state}, {spot.country}</p>

                    <div id='grid-wrapper'>
                        <ul id='images'>
                            {spot  && spot.SpotImages && spot.SpotImages.map((image) => (
                                <li key={image.id}>
                                    <img src={image.url} alt="spot image" />
                                </li>
                            ))}

                        </ul>
                    </div>
                    <div id='description-btn'>

                    <div id='detailed-description-container'>
                        <h2>Hosted by {spot.owner.firstName} {spot.owner.lastName} </h2>
                        <p id='detail-description'>{spot.description}</p>
                        </div>

                        <div id='reserve-container'>
                            <div id='price-in-reserve'>
                                <p >${spot.price} </p>
                                <div id='night-container'>
                                    <p>night</p>

                                </div>
                            </div>

                            <div id='review-in-reserve'> {reviewRating}</div>

                            <div id='reserve-btn-container'>
                                <button id='reserve-btn' onClick={handleReserveClick}>Reserve</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div>
                    <SpotReviews spotId={spot.id} />
                </div>

            </div>
        </div>
    )

}
