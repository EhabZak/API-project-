{formType === 'Create Spot' && (
    <div className='form-div-container'>
      {images.map((image, index) => (
        index === 0 ? (
          <div key={index} className='label-container'>
            <label className='label-container'>
              Liven up your spot with Photos
              <p id='p-in-textarea'> Submit a link to at least one photo to publish your spot</p>
              <input
                type='text'
                placeholder='Preview Image URL'
                name='previewImage'
                value={images[0].url}
                required={true}
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
          </div>
        ) : (
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
        )
      ))}
    </div>
  )}
