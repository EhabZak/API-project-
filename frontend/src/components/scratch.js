import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot, updateSpot } from '../../store/spotsReducer';
import './form.css';

export default function SpotForm({ spot, formType }) {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  /////////////////////////////////////////////////////////

  const [images, setImages] = useState([
    { url: '', preview: true },
    { url: '' },
    { url: '' },
    { url: '' },
    { url: '' },
  ]);

  //////////////////////////////////////////////////////////////////
  const [validationObject, setValidationObject] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formType === 'Update Spot') {
      const editedSpot = await dispatch(updateSpot(spot));
      spot = editedSpot;
    } else if (formType === 'Create Spot') {
      const newSpot = await dispatch(createSpot(spot));
      spot = newSpot;
/////////////////////////////////////////////////////////////////////

      // Create and add images to the spot if imageUrl is provided
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
    }
/////////////////////////////////////////////////////////////////////
    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  };

  return (
    <div id='main-container'>
      <form onSubmit={handleSubmit} id='form-container'>
        <div className='form-div-container'>
          <label className='label-container'>
            Country
            <input
              type='text'
              placeholder='Country'
              name='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
        </div>

        {/* Add other form fields here (Address, City, State, Latitude, Longitude, Description, Name, Price) */}
///////////////////////////////////////////////////////////////////
        <div className='form-div-container'>
          <label className='label-container'>
            Preview Image URL
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
///////////////////////////////////////////////////////////////////////
        
        {images.slice(1).map((image, index) => (
          <div key={index} className='form-div-container'>
            <input
              type='text'
              placeholder={`Image URL ${index + 2}`}
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
//////////////////////////////////////////////////////////////////////
        <button
          id='submit-form-button'
          type='submit'
          disabled={Object.keys(validationObject).length > 0}
        >
          Create Spot
        </button>
      </form>
    </div>
  );
}
