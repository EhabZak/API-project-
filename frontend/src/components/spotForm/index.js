import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDetailedSpot } from '../../store/spotsReducer';
import { createSpot, updateSpot } from '../../store/spotsReducer';
import './form.css'
import { addImage } from '../../store/spotsReducer';

export default function SpotForm({ spot, formType }) {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  ////////////////////////////////////////////////////
  //! errors set ///////////////////////////////////

  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({})
  const [validationObject, setValidationObject] = useState({})

  //////////////////////////////////////////////////////////////////
  //! USE STATE////////////////////////////////////////////////////
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


  const [images, setImages] = useState([
    { url: '', preview: true },
    { url: '', preview: false },
    { url: '', preview: false },
    { url: '', preview: false },
    { url: '', preview: false },
  ]);



  ////////////////////////////////////////////////////////////
  //! END of use state ///////////////////////////////////////

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


  // console.log( '******', validationObject)
  //////////////////////////////////////////////////////////////////////
  //! START Handle submit ///////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setImageErrors({})
    /////////////////////////////////////////////////////////
    const errorObject = {}
    if (country.length < 1) {
      errorObject.country = "*******Country is required";
    }
    if (address.length < 1) {
      errorObject.address = "Address is required";
    }
    if (city.length < 1) {
      errorObject.city = "City is required";
    }
    if (state.length < 1) {
      errorObject.state = "*******State is required";
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
    if (price <= 0) {
      errorObject.price = "Price is required";
    }

    if (description.length < 30) {
      errorObject.description = "Description needs a minimum of 30 characters";
    }

  // if (!images[0].url) {
  //       errorObject.images = "Preview image is required";
  //     }
    // images.forEach((image) => {

    //   if (image.url.length > 0) {
    //     const validExtensions = [".png", ".jpg", ".jpeg"];
    //     const imageUrl = image.url;
    //     const imageExtension = imageUrl.split('.').pop().toLowerCase();
    //     console.log( '*******image extension', imageExtension)
    //     if (!validExtensions.includes(imageExtension)) {
    //       errorObject.images = "Image URL must end with .png, .jpg, or .jpeg";
    //     }else{

    //     }
    //   }

    // })




    
    images.slice(1).forEach((image,index) => {

      if (image.url.length > 0) {
        const validExtensions = [".png", ".jpg", ".jpeg"];
        const imageUrl = image.url;
        const imageExtension = imageUrl.split('.').pop().toLowerCase();
        console.log( '*******image extension', imageExtension)
        if (!validExtensions.includes(imageExtension)) {
          errorObject[`image${index}`] = "Image URL must end with .png, .jpg, or .jpeg";
        }
      }

    })


console.log('^^^^^errorObject^^^^^ ' , errorObject)





    setValidationObject(errorObject)

    //////////////////////////////////
    if (spot) { spot = { ...spot, country, address, city, state, lat: lat, lng: lng, description, name, price } }
    // console.log("898988988999888", spot)
    //////////////////////////////////////////////////
    /// UPDATE SPOT /////////////////////////////////////////////////
    if (formType === 'Update spot') {



      // await dispatch(updateSpot(spot));


      try {
        const updatedSpotData = await dispatch(updateSpot(spot));

        // console.log("^^^^^updated spot data ^^^^^^", updatedSpotData)
        if (updatedSpotData) {

          // console.log("555555updated spot data 5555555", updatedSpotData)
          // history.push(`/spots/${spotId}`);
          history.push(`/spots/${updatedSpotData.id}`);
        }



      } catch (error) {
        // console.log('&&&&&&&&&&', error)
        const data = await error.json();
        // console.log("%%%%%%%%%%%", data.errors)
        if (data && data.errors) {
          setErrors(data.errors);
        }

      }

      /// END OF UPDATE SPOT ///////////////////////////////////////////////
      ////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////////
      /// CREATE SPOT //////////////////////////////////////////////////////


    } else if (formType === 'Create Spot') {
      dispatch(createSpot(spot, sessionUser))
        .then(async (res) => {
          const data = await res
          // console.log('@@@data@@@', data)

          /////////////////////////////////////
          spot.id = data.id

          // console.log('this is the ======', spot.id)
          /// add the images ///////////////////////////////////////
          images.forEach(async (image, index) => {
            if (image.url) {
              try {

                dispatch(addImage(spot.id, image.url, image.preview))
                  .then(async (res) => {
                    const imageData = await res
                    console.log('^^^image-data^^^===', data)
                  })

              } catch (error) {
                const data = await error.json();
                if (data && data.errors) {
                  setImageErrors(data.errors);
                }
              }
            }
          });
          /// END of adding the images /////////////////////////////////////

          /// maybe you need to add a condition if no error then redirect
          history.push(`/spots/${spot.id}`);
          return console.log(data)
          ///////////////////////////////////

        })
        .catch(async (res) => {
          const data = await res
          // console.log('EEEEerror in componentEEEE', data.errors)

          if (data && data.errors) {
            setErrors(data.errors)

            // console.log('555 errors 55555', errors)
          }
        })

        // console.log('YYY errors YYYY', errors)

      //! this is just to check if there are any errors in the ERRORS object

      // console.log("#######", errors)
      // if (Object.values(errors).length) {
      //   console.log("4444errors", errors)
      // }
      // console.log("000000000000000",spot)


      // console.log('22222222222222', errors)

      //! /////////////////////////////////////////////////////////////////////
      //       /////////////////////////////////////
      //       spot.id = data.spotId
      // //////////////////////////////////////////
      //       images.forEach(async (image, index) => {
      //         if (image.url) {
      //           try {

      //             dispatch(addImage(spot.id, image.url, image.preview));
      //           } catch (error) {
      //             const data = await error.json();
      //             if (data && data.errors) {
      //               setImageErrors(data.errors);
      //             }
      //           }
      //         }
      //       });

      //       ///////////////////////////////////
    }
    /// END OF CREATE SPOT //////////////////////////////////
    /////////////////////////////////////////////////////////

    // if (spot.errors) {
    //   setErrors(spot.errors);
    // } else {
    //   history.push(`/spots/${spot.id}`);
    // }
    if (spot.id) {

      history.push(`/spots/${spot.id}`);
    } else return null

  }

  ///////////////////////////////////////////////////////////////
  //! end of handle submit ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    // console.log('errors updated:', errors)
    // console.log("000000000000000", spot);
  }, [spot]);
  // console.log('22222222222222', errors)

  /////////////////////////////////////////////////////////////////
  //! JSX  starts  /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  if (!spot) {
    return null
  }

  // console.log('*** errors ****', errors.city)
  return (
    <div id='main-container'>
      <form
        // className={formType === 'Create Spot' ? 'create-container' : 'Update spot'}
        onSubmit={handleSubmit} id='form-container'>


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
          { !validationObject.country && errors.country && <div className="backend-errors">{errors.country}</div>}
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
          {!validationObject.country && errors.address && <div className="backend-errors">{errors.address}</div>}
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
            {!validationObject.country && errors.city && <div className="backend-errors">{errors.city} </div>}
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
            {!validationObject.country && errors.city && <div className="backend-errors">{errors.city}</div>}
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
            {!validationObject.country && errors.lat && <div className="backend-errors">{errors.lat}</div>}
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
            {!validationObject.country && errors.lng && <div className="backend-errors">{errors.lng}</div>}
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
          {!validationObject.country && errors.description && <div className="backend-errors">{errors.description}</div>}
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
          {!validationObject.country && errors.name && <div className="backend-errors">{errors.name}</div>}
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
                type="number"
                placeholder="Price per night (USD)"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </label>
          {!validationObject.country && errors.price && <div className="backend-errors">{errors.price}</div>}
          {validationObject.price && <p className="errors">
            {validationObject.price}
          </p>}
          <div id='text-area-footer'></div>
        </div>


        {formType === 'Create Spot' && (

          <div className='form-div-container'>
            <label className='label-container'>
              Liven up your spot with Photos
              <p id='p-in-textarea'> Submit a link to at least one photo to publish your spot</p>
              <input
                type='text'
                placeholder='Preview Image URL'
                name='previewImage'
                value={images[0].url}
                // required={true}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[0].url = e.target.value;
                  setImages(newImages);
                }}
              />
            </label>
            {imageErrors.images && <div className="backend-errors">{imageErrors.images}</div>}
            {validationObject.images?.[0]?.url && (
              <p className="errors">
                {validationObject.images[0].url}
              </p>
            )}

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
                {imageErrors.images && <div className="backend-errors">{imageErrors.images}</div>}
                {validationObject[`image${index}`] && (
                  <p className="errors">
                    {validationObject[`image${index}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}


        <button id='submit-form-button'
          type="submit"
        // disabled={Object.keys(validationObject).length > 0}
        >
          Create Spot
        </button>




      </form>
    </div>
  )

  /////////////////////////////////////////////////////
  //! end of JSX//////////////////////////////////////////////
  /////////////////////////////////////////////////////////
}
