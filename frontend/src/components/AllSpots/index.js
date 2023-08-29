// import Navigation from "../Navigation";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spotsReducer';
import './all-spots.css'

export default function AllSpots() {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spotState.allSpots);
  const reviews = useSelector((state) => state.reviewState.reviews.spot)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPageSpots,setHasNextPageSpots]= useState(false)
  console.log("=======", Object.values(spots))

  useEffect(() => {
    dispatch(fetchSpots(currentPage));
  }, [dispatch,currentPage]);
// console.log('^^^^^^^', currentPage)
  /////////////////////////////////////////////////////////////////////




  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);


  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
  }
  }

  /////////////////////////////////////////////////////////


  return (

    <div className="init-all-spots">

      <h1></h1>
      <ul id='spots-list'>
        {Object.values(spots).map((spot) => (
          <li key={spot.id} className='spot-container'>


            <Link to={`spots/${spot.id}`}>
              <img id='img' src={spot.previewImage} alt="Spot Preview" />
            </Link>


            <div id='address-rating'>
              <p> {spot.city}, {spot.state}</p>
              <p><i className="fa-solid fa-star" id='review-star'></i>
                {spot.avgRating.toFixed(1) > 0 ? <span>{spot.avgRating.toFixed(1)}</span> : <span>New</span>}
              </p>


            </div>
            <p id='price'> <span>${spot.price}</span> night</p>

          </li>
        ))}
      </ul>


      <div id='pagination-container'>
        <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={currentPage ===1? 'disabled-button': ''}
        > Previous Page

        </button>


        <button
        onClick={handleNextPage}
        disabled={Object.values(spots).length !== 20}
        className={Object.values(spots).length !== 20? 'disabled-button': '' }
        >Next Page </button>

      </div>
    </div>
  )

}
