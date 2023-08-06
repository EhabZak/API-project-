import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDetailedSpot } from '../../store/spotsReducer';
import { createSpot, updateSpot } from '../../store/spotsReducer';
import './form.css'
import { addImage } from '../../store/spotsReducer';

export default function SpotForm({ spot, formType }) {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({})


  //////////////////////////////////////////////////////////////////

  //////////////////ehab ////////////////////////////////////////////
  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price);
  const [validationObject, setValidationObject] = useState({})

  const [images, setImages] = useState([
    { url: '', preview: true },
    { url: '', preview: false },
    { url: '', preview: false },
    { url: '', preview: false },
    { url: '', preview: false },
  ]);
  // console.log('*************', spot) // if we are updating the spot
  ////////////////////////////////////////////////////////////
  // useEffect(() => {
  // const errorObject = {}
  //     if (country.length < 1) {
  //       errorObject.country = "Country is required";
  //     }
  //     if (address.length < 1) {
  //       errorObject.address= "Address is required";
  //     }
  //     if (city.length < 1) {
  //       errorObject.city = "City is required";
  //     }
  //     if (state.length < 1) {
  //       errorObject.state = "State is required";
  //     }
  //     if (lat.length < 1) {
  //       errorObject.lat = "Latitude is required";
  //     }
  //     if (lng.length < 1) {
  //       errorObject.lng = "Longitude is required";
  //     }
  //     if (name.length < 1) {
  //       errorObject.name = "Name is required";
  //     }
  //     if (price.length < 1) {
  //       errorObject.price = "Price is required";
  //     }
  //     if (description.length < 30) {
  //       errorObject.description = "Description needs a minimum of 30 characters";
  //     }

  //     images.forEach((image) => {

  //       if (image.url.length < 1) {
  //         errorObject.images = "image is required";
  //       }
  // if (image.url.length > 0 ) {
  //   const validExtensions = [".png", ".jpg", ".jpeg"];
  //   const imageUrl = image.url;
  //   const imageExtension = imageUrl.split('.').pop().toLowerCase();
  //   if (!validExtensions.includes(imageExtension) ) {
  //     errorObject.images = "Image URL must end with .png, .jpg, or .jpeg";
  //   }
  // }

  // })
  // setValidationObject(errorObject)

  // }, [country, address, city, state, lat, lng, description, name, price, images[0], images]);

  ///////////////////////////////////////////////////////////////
  // console.log( '******', validationObject)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setImageErrors({})
    /////////////////////////////////////////////////////////
    const errorObject = {}
    if (country.length < 1) {
      errorObject.country = "Country is required";
    }
    if (address.length < 1) {
      errorObject.address = "Address is required";
    }
    if (city.length < 1) {
      errorObject.city = "City is required";
    }
    if (state.length < 1) {
      errorObject.state = "State is required";
    }
    if (lat.length < 1) {
      errorObject.lat = "Latitude is required";
    }
    if (lng.length < 1) {
      errorObject.lng = "Longitude is required";
    }
    if (name.length < 1) {
      errorObject.name = "Name is required";
    }
    if (price.length < 1) {
      errorObject.price = "Price is required";
    }
    if (description.length < 30) {
      errorObject.description = "Description needs a minimum of 30 characters";
    }

    images.forEach((image) => {

      if (image.url.length < 1) {
        errorObject.images = "image is required";
      }
      if (image.url.length > 0) {
        const validExtensions = [".png", ".jpg", ".jpeg"];
        const imageUrl = image.url;
        const imageExtension = imageUrl.split('.').pop().toLowerCase();
        if (!validExtensions.includes(imageExtension)) {
          errorObject.images = "Image URL must end with .png, .jpg, or .jpeg";
        }
      }

    })
    setValidationObject(errorObject)

    //////////////////////////////////
    if (spot) { spot = { ...spot, country, address, city, state, lat: lat, lng: lng, description, name, price } }
    console.log("898988988999888", spot)
    if (formType === 'Update Spot') {



      // await dispatch(updateSpot(spot));

      try {
        await dispatch(updateSpot(spot));
        console.log("000000000000000", spot)
      } catch (error) {
        // console.log('&&&&&&&&&&', error)
        const data = await error.json();
        // console.log("%%%%%%%%%%%", data.errors)
        if (data && data.errors) {
          setErrors(data.errors);
        }

      }


    } else if (formType === 'Create Spot') {

      try {
        await dispatch(createSpot(spot));
        // console.log("000000000000000",spot)
      } catch (error) {
        // console.log('&&&&&&&&&&', error)
        const data = await error.json();
        // console.log("%%%%%%%%%%%", data.errors)
        if (data && data.errors) {
          setErrors(data.errors);
        }

      }

      // console.log('22222222222222', errors)
      /////////////////////////////////////
      images.forEach(async (image, index) => {
        if (image.url) {
          try {

            dispatch(addImage(spot.id, image.url, image.preview));
          } catch (error) {
            const data = await error.json();
            if (data && data.errors) {
              setImageErrors(data.errors);
            }
          }
        }
      });

      ///////////////////////////////////
    }


    // if (spot.errors) {
    //   setErrors(spot.errors);
    // } else {
    //   history.push(`/spots/${spot.id}`);
    // }

    history.push(`/spots/${spot.id}`);

  }
  useEffect(() => {
    // console.log('errors updated:', errors)
    console.log("000000000000000", spot);
  }, [ spot]);
  console.log('22222222222222', errors)
  ////////////////////////////////////////////////////////////////
  return (
    <div id='main-container'>
      <form onSubmit={handleSubmit} id='form-container'>


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
          {errors.country && <div className="error">{errors.country}</div>}
          {validationObject.country && <p className="errors">
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
          {errors.address && <div className="error">{errors.address}</div>}
          {validationObject.address && <p className="errors">
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
            {errors.city && <div className="error">{errors.city}</div>}
            {validationObject.city && <p className="errors">
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
            {errors.city && <div className="error">{errors.city}</div>}
            {validationObject.state && <p className="errors">
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
                placeholder="lat"
                name="lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </label>
            {errors.lat && <div className="error">{errors.lat}</div>}
            {validationObject.lat && <p className="errors">
              {validationObject.lat}
            </p>}
            <p>,</p>
            <label className='label-container' >
              Longitude
              <input
                type="text"
                placeholder="lng"
                name="lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </label>
            {errors.lng && <div className="error">{errors.lng}</div>}
            {validationObject.lng && <p className="errors">
              {validationObject.lng}
            </p>}
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
          {errors.description && <div className="error">{errors.description}</div>}
          {validationObject.description && <p className="errors">
            {validationObject.description}
          </p>}
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
          {errors.name && <div className="error">{errors.name}</div>}
          {validationObject.name && <p className="errors">
            {validationObject.name}
          </p>}
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
                placeholder="Price per night (USD)"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </label>
          {errors.price && <div className="error">{errors.price}</div>}
          {validationObject.price && <p className="errors">
            {validationObject.price}
          </p>}
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
          {imageErrors.images && <div className="error">{imageErrors.images}</div>}
          {validationObject.images?.[0]?.url && <p className="errors">
            {validationObject.images[0].url}
          </p>}
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
            {imageErrors.images && <div className="error">{imageErrors.images}</div>}
            {validationObject.images && <p className="errors">
              {validationObject.images}
            </p>}
          </div>
        ))}







        <button id='submit-form-button'
          type="submit"
        // disabled={Object.keys(validationObject).length > 0}
        >
          Create Spot
        </button>




      </form>
    </div>
  )
}
