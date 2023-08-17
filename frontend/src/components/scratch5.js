import React, { useState, useEffect } from 'react';
// ... (other imports)

export default function SpotForm({ spot, formType }) {
  // ... (other variables and state)

  const [submit, setSubmit] = useState(false); // Initialize submit state

  useEffect(() => {
    const errorObject = {}
    if (submit) { // Check if submit button is clicked
      if (country.length < 1) {
        errorObject.country = "Country is required";
      }
      if (address.length < 1) {
        errorObject.address= "Address is required";
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

      if (images[0].url.length > 0) { // Check if the image URL is provided
        const validExtensions = ["png", "jpg", "jpeg"];
        const imageUrl = images[0].url;
        const imageExtension = imageUrl.split('.').pop().toLowerCase();
        if (!validExtensions.includes(imageExtension)) {
          errorObject.images = ["Image URL must end with .png, .jpg, or .jpeg"];
        }
      }

      images.forEach((image) => {
        if (image.url.length > 0) {
          const validExtensions = ["png", "jpg", "jpeg"];
          const imageUrl = image.url;
          const imageExtension = imageUrl.split('.').pop().toLowerCase();
          if (!validExtensions.includes(imageExtension)) {
            errorObject.images = ["Image URL must end with .png, .jpg, or .jpeg"];
          }
        }
      });

      setValidationObject(errorObject);
    }
  }, [submit, country, address, city, state, lat, lng, description, name, price, images]);

  // ... (other code)

  return (
    <div id='main-container'>
      <form onSubmit={handleSubmit} id='form-container'>
        {/* ... (other form fields) */}

        <button
          id='submit-form-button'
          type="submit"
          onClick={() => setSubmit(true)} // Set submit to true on button click
        >
          Create Spot
        </button>

        {/* ... (other code) */}
      </form>
    </div>
  );
}
