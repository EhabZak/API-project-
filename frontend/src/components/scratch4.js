// ... Other imports and code ...

export default function SpotForm({ spot, formType }) {
    // ... Other useState and useEffect ...

    return (
      <div id='main-container'>
        <form onSubmit={handleSubmit} id='form-container'>
          {/* ... Other form fields ... */}

          {/* Render images input fields only when formType is 'Create Spot' */}
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
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[0].url = e.target.value;
                    setImages(newImages);
                  }}
                />
              </label>
              {imageErrors.images && <div className="error">{imageErrors.images}</div>}
              {validationObject.images?.[0]?.url && (
                <p className="errors">
                  {validationObject.images[0].url}
                </p>
              )}

              {/* Map over the rest of the images */}
              {formType === 'Create Spot' && (images.slice(1).map((image, index) => (
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
                  {validationObject.images && (
                    <p className="errors">
                      {validationObject.images}
                    </p>
                  )}
                </div>
               ) )) }
            </div>
          )}

          {/* ... Other form fields ... */}

          <button id='submit-form-button' type="submit">
            Create Spot
          </button>
        </form>
      </div>
    )
  }
