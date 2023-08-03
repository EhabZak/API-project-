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

  //////////////////ehab ////////////////////////////////////////////
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

  const [images, setImages] = useState([
    { url: '', preview: true },
    { url: '' },
    { url: '' },
    { url: '' },
    { url: '' },
  ]);

  ////////////////////////////////////////////////////////////
  useEffect(() => {
    const errorObject = {}
    if (country.length < 1) {
      errorObject.name = "Country is required";
    }
    if (address.length < 1) {
      errorObject.name = "Address is required";
    }
    if (city.length < 1) {
      errorObject.name = "City is required";
    }
    if (state.length < 1) {
      errorObject.name = "State is required";
    }
    if (latitude.length < 1) {
      errorObject.name = "Latitude is required";
    }
    if (longitude.length < 1) {
      errorObject.name = "Longitude is required";
    }
    if (name.length < 1) {
      errorObject.name = "Name is required";
    }
    if (price.length < 1) {
      errorObject.name = "Price is required";
    }
    if (description.length < 30) {
      errorObject.name = "Description needs a minimum of 30 characters";
    }
    if (images[0].length < 1) {
      errorObject.name = "Preview image is required";
    }

    const validExtensions = [".png", ".jpg", ".jpeg"];
    const imageExtension = images[0].split('.').pop().toLowerCase();
    if (!validExtensions.includes(imageExtension)) {
      errorObject.name = "Image URL must end with .png, .jpg, or .jpeg";
    }
    setValidationObject(errorObject)

  }, [country,address,city,state,latitude,longitude ,description,name,price,images[0],images ]);

  ///////////////////////////////////////////////////////////////


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

      /////////////////////////////////////
      images.forEach(async (image, index) => {
        if (image.url) {
          try {
            const imageRequest = {
              url: image.url,
              preview: index === 0 ? true : false,
            };
            const response = await fetch(`/api/spots/${spot.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(imageRequest),
            });
            if (response.ok) {
              const imageData = await response.json();
              console.log('Image added successfully:', imageData);
            } else {
              const errorData = await response.json();
              console.error('Failed to add image:', errorData.message);
            }
          } catch (error) {
            console.error('Error adding image:', error);
          }
        }
      });

      ///////////////////////////////////
    }


    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  }
////////////////////////////////////////////////////////////////
  return (
    <div id='main-container'>
      <form onSubmit={handleSubmit} id='form-container'>

        <h1 > create a new Spot </h1>
        <h2>Where is your place located?</h2>
        <p>Guests will only get you exact address once they booked a reservation.</p>
        <div className='form-div-container'>
          <label className='label-container'>
            Country
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          {validationObject.country && <p className= "errors">
          {validationObject.country}
          </p>}
        </div>

        <div className='form-div-container' >
          <label className='label-container'>
            Street Address
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          {validationObject.address && <p className= "errors">
          {validationObject.address}
          </p>}
        </div>

        <div className='form-div-container' >
          <div id='state-container'>
            <label className='label-container' >
              City
              <input
                type="text"
                placeholder="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            {validationObject.city && <p className= "errors">
          {validationObject.city}
          </p>}
            <p>,</p>
            <label className='label-container' >
              State
              <input
                type="text"
                placeholder="State"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
            {validationObject.state && <p className= "errors">
          {validationObject.state}
          </p>}
          </div>
        </div>


        <div className='form-div-container' >
          <div id='latitude-container'>
            <label className='label-container' >
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
            <label className='label-container' >
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

        <div className='form-div-container' >
          <label className='label-container'>
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

        <div className='form-div-container' >
          <label className='label-container'>
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

        <div className='form-div-container' >
          <label className='label-container'>
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


        <div className='form-div-container'>
          <label className='label-container'>
           Liven up your spot with Photos
           <p id='p-in-textarea'> Submit a link to at least one photo to publish your spot</p>
            <input
              type='text'
              placeholder='Preview Image URL'
              name='previewImage'
              value={images[0].url}
              onChange={(e) => {
                const newImages = [...images];
                newImages[0].url = e.target.value;
                setImages(newImages);
              }}
            />
          </label>
        </div>


        {images.slice(1).map((image, index) => (
          <div key={index} className='label-container'>
            <input
              type='text'
              placeholder={`Image URL`}
              name={`imageUrl${index}`}
              value={image.url}
              onChange={(e) => {
                const newImages = [...images];
                newImages[index + 1].url = e.target.value;
                setImages(newImages);
              }}
            />
          </div>
        ))}







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
