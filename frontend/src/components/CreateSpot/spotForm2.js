import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDetailedSpot } from '../../store/spotsReducer';
import { createSpot, updateSpot } from '../../store/spotsReducer';
import './form2.css'

import { addImage } from '../../store/spotsReducer';
import { createSpotThunk } from '../../store/createSpotReducer';

export default function SpotForm2({ formType, spotId }) {

    const dispatch = useDispatch();
    const history = useHistory();

   /// session user is used at line 80 //////////////////////////////
    const sessionUser = useSelector((state) => state.session.user);
    const [validationObj, setValidationObj] = useState({});
      //////////////////////////////////////////////////////////////////
//! USE STATE////////////////////////////////////////////////////
  //////////////////ehab ////////////////////////////////////////////
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [previewImage, setPreviewImage] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [imageUrl4, setImageUrl4] = useState('');
    const [imageUrl5, setImageUrl5] = useState('');

    /// this is not used anywhere /////////////
    const [reloadPage, setReloadPage] = useState(false);





  ////////////////////////////////////////////////////////////
  //! end of use state ///////////////////////////////////////


    let spotEdit;

  //////////////////////////////////////////////////////////////////////
//! start Handle submit ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
    const handleSubmit = async (e) => {

      e.preventDefault();

      /// VALIDATIONS of images ////////////////////////////////////
      const imageUrls = [previewImage, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
      const imageExtensionsRegex = /\.(png|jpe?g)$/i;
      const invalidImages = imageUrls.filter((url) => url && !imageExtensionsRegex.test(url));
      ///////////////////////////////////////////////////////////////
      if (invalidImages.length > 0) {
        const errorsObj = { ...validationObj };
        invalidImages.forEach((url, index) => {
          const fieldName = index === 0 ? 'previewImage' : `imageUrl${index}`;
          errorsObj[fieldName] = 'Image URL must end in .png, .jpg, or .jpeg';
        });
        setValidationObj(errorsObj);
        return;
      }
        /// end of validation of images //////////////////////////////////////////////////////////////////////////

        const newSpot = { address, city, state, country, lat, lng, name, description, price };
///////////////////////////////////////////////////////////////////////
/// what is this ? /////////////////////////////////////////////////////////

        let newSpotImage= [];
      const tempNewSpotImage = [
        { url: previewImage, preview: true },
        { url: imageUrl2, preview: false },
        { url: imageUrl3, preview: false },
        { url: imageUrl4, preview: false },
        { url: imageUrl5, preview: false },
      ];

      tempNewSpotImage.forEach((image) => { if (image.url) newSpotImage.push(image); });
/////////////////////////////////////////////////////////////////////////////

      if (formType === 'Create') {
        const newlyCreateSpot = await dispatch(createSpotThunk(newSpot, newSpotImage, sessionUser));

        if (newlyCreateSpot.id) {
          history.push(`/spots/${newlyCreateSpot.id}`);
        } else return null;
      }


      const errorsObj = {};
      if (formType === 'Create') {
        if (!address) errorsObj.address = 'Address is required';
        if (!city) errorsObj.city = 'City is required';
        if (!state) errorsObj.state = 'State is required';
        if (!country) errorsObj.country = 'Country is required';
        if (!lat) errorsObj.lat = 'Latitude is required';
        if (!lng) errorsObj.lng = 'Longitude is required';
        if (!name) errorsObj.name = 'Name is required';
        if (!description) errorsObj.description = 'Description is required';
        if (!price) errorsObj.price = 'Price is required';
        if (!previewImage) errorsObj.previewImage = 'Preview Image is required';

        setValidationObj(errorsObj);
      }

    };

///////////////////////////////////////////////////////////////
  //! end of handle submit ///////////////////////////////////////////


    const clearImageError = (fieldName) => {
      if (validationObj[fieldName]) {
        setValidationObj((prevState) => ({ ...prevState, [fieldName]: '' }));
      }
    };

    // if(!spotEdit) return null;


/////////////////////////////////////////////////////////////////
//! JSX  starts  /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

    return (
      <div className="form-container">
        <form
          className={formType === 'Create' ? 'create-container' : 'edit-container'}
          onSubmit={handleSubmit}
        >
          <h1>{formType === 'Create' ? 'Create a new Spot' : 'Update your Spot'}</h1>
<h3>Where's your place located?</h3>
<p>Guests will only get your exact location once they book a reservation.</p>
          <div>
            <div className="div-title">
              <div className="error-container">
                <p className='label-container'>Country</p>
                {validationObj.country && <p className="errors">{validationObj.country}</p>}
              </div>
            </div>
            <label htmlFor="Country" className="label"></label>

            <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          {/* **************************************************************** */}
          <div className="city-state-container">
            <div className="city-state-input-box">
              <div className="state">
                <div className="error-container">
                  <p className='label-container'>City</p>
                  {validationObj.city && <p className="errors">{validationObj.city}</p>}
                </div>
                <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="city">
                <div className="error-container">
                  <p className='label-container'>State</p>
                  {validationObj.state && <p className="errors">{validationObj.state}</p>}
                </div>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
          </div>
          {/* **************************************************************** */}

          <div>
            <div className="div-title">Street Address</div>
            <label htmlFor="Address" className="label"></label>
            {}

            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          {/* **************************************************************** */}
          <div className="lat-lng-container">
            <div className="lat-lng-input-box">
              <div className="latitude">
                <div className="error-container">
                  <p className='label-container'>latitude</p>
                  {validationObj.lat && <p className="errors">{validationObj.lat}</p>}
                </div>
                <input type="text" id="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div className="Longitude">
                <div className="error-container">
                  <p className='label-container'>Longitude</p>
                  {validationObj.lng && <p className="errors">{validationObj.lng}</p>}
                </div>
                <input type="text" id="lng" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
            </div>
          </div>
          {/* **************************************************************** */}
          <div className={formType === 'Create' ? 'create-description-textarea' : 'edit-description-textarea'}>
            <div className="div-title">Describe your place to guests</div>
            <p>Mention the best features of your place, any special amenities like </p>
            <p> fast wifi or parking, and what you love about the neighborhood</p>
            <label htmlFor="description" className='text-container' >
            <textarea
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={formType === 'Edit' ? 'edit-form-textarea' : ''}
            />
            </label>
          </div>
          <div>
            <div className="div-title">Create a title for your spot</div>
            <p>Catch guests' attention with a spot title that highlights </p>
            <p> what makes your place special</p>
            <label htmlFor="Name" className="label"></label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div className="div-title">Set a base price for your spot</div>
            <label htmlFor="Price" className="label"></label>
            <div className="price-dollar-sign">
              <div>$</div>
              <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          {formType === 'Create' && (
            <div className="form-image-input">
              <div class='image-container'>
                <label htmlFor="previewImage"></label>
                <input
                  type="url"
                  id="imageUrl1"
                  value={previewImage}
                  placeholder="Image URL"
                  onChange={(e) => {
                    setPreviewImage(e.target.value);
                    clearImageError('previewImage');
                  }}
                />
                {validationObj.previewImage && <p className="errors">{validationObj.previewImage}</p>}
              </div>
              <div class='image-container'>
                <label htmlFor="imageUrl2"></label>
                <input
                  type="url"
                  id="imageUrl2"
                  value={imageUrl2}
                  placeholder="Image URL"
                  onChange={(e) => {
                    setImageUrl2(e.target.value);
                    clearImageError('imageUrl2');
                  }}
                />
                {validationObj.imageUrl2 && <p className="errors">{validationObj.imageUrl2}</p>}
              </div>
              <div class='image-container'>
                <label htmlFor="imageUrl3"></label>
                <input
                  type="url"
                  id="imageUrl3"
                  value={imageUrl3}
                  placeholder="Image URL"
                  onChange={(e) => {
                    setImageUrl3(e.target.value);
                    clearImageError('imageUrl3');
                  }}
                />
                {validationObj.imageUrl3 && <p className="errors">{validationObj.imageUrl3}</p>}
              </div>
              <div class='image-container'>
                <label htmlFor="imageUrl4"></label>
                <input
                  type="url"
                  id="imageUrl4"
                  value={imageUrl4}
                  placeholder="Image URL"
                  onChange={(e) => {
                    setImageUrl4(e.target.value);
                    clearImageError('imageUrl4');
                  }}
                />
                {validationObj.imageUrl4 && <p className="errors">{validationObj.imageUrl4}</p>}
              </div>
              <div class='image-container'>
                <label htmlFor="imageUrl5"></label>
                <input
                  type="url"
                  id="imageUrl5"
                  value={imageUrl5}
                  placeholder="Image URL"
                  onChange={(e) => {
                    setImageUrl5(e.target.value);
                    clearImageError('imageUrl5');
                  }}
                />
                {validationObj.imageUrl5 && <p className="errors">{validationObj.imageUrl5}</p>}
              </div>
            </div>
          )}
<div id='div-button-container'>
          <button className="spot-form-btn" id='submit-form-button' type="submit" disabled={Object.keys(validationObj).length > 0}>
            Submit
          </button>
          </div>

        </form>
      </div>
    );


      /////////////////////////////////////////////////////
  //! end of JSX//////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  }
