import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDetailedSpot } from '../../store/spotsReducer';
import { createSpot, updateSpot } from '../../store/spotsReducer';
import './form.css'

export default function SpotForm({ spot, formType }) {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});

  //////////////////////////////////////////////////////////////
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [validationObject, setValidationObject] = useState({})


  ////////////////////////////////////////////////////////////
  // const spot = useSelector((state) =>state.spotState.singleSpot[spotId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    //////////////////////////////////

    if (formType === 'Update Spot') {
      const editedSpot = await dispatch(updateSpot(spot));
      spot = editedSpot;
    } else if (formType === 'Create Spot') {
      const newSpot = await dispatch(createSpot(spot));
      spot = newSpot;
    }

    ///////////////////////////////////


    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  }

  return (
    <div id='main-container'>
      <form onSubmit={handleSubmit} id='form-container'>

        <h1 > create a new Spot </h1>
        <h2>Where is your place located?</h2>
        <p>Guests will only get you exact address once they booked a reservation.</p>
        <div class='form-div-container'>
          <label class='label-container'>
            Country
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
        </div>

        <div class='form-div-container' >
          <label class='label-container'>
            Street Address
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>

        <div class='form-div-container' >
          <div id='state-container'>
            <label class='label-container' >
              City
              <input
                type="text"
                placeholder="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <p>,</p>
            <label class='label-container' >
              State
              <input
                type="text"
                placeholder="State"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
          </div>
        </div>


        <div class='form-div-container' >
          <div id='latitude-container'>
            <label class='label-container' >
              Latitude
              <input
                type="text"
                placeholder="Latitude"
                name="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>
            <p>,</p>
            <label class='label-container' >
              Longitude
              <input
                type="text"
                placeholder="Longitude"
                name="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div class='form-div-container' >
          <label class='label-container'>
            Describe you place to guests
            <p id='p-in-textarea'> mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
            <textarea
              type="text"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div id='text-area-footer'></div>
        </div>

        <div class='form-div-container' >
          <label class='label-container'>
            Create a title for your spot
            <p id='p-in-textarea'> Catch guests' attention with a spot title highlights what makes you place special</p>
            <input
              type="text"
              placeholder="Name of your spot"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div id='text-area-footer'></div>
        </div>

        <div class='form-div-container' >
          <label class='label-container'>
            Set a base price for your spot
            <p id='p-in-textarea'> Competitive pricing can help your listing stand out and rank higher in search results</p>
            <div id='price-div'>
              <p>$</p>
              <input
                type="text"
                placeholder="Price per nigh (USD)"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </label>
          <div id='text-area-footer'></div>
        </div>

        <button id='submit-form-button'
          type="submit"
          disabled={Object.keys(validationObject).length > 0}
        >
          Create Spot
        </button>




      </form>
    </div>
  )
}
