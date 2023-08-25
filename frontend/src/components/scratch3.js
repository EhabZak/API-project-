const handleStarClick = (starValue) => {
  setRating(starValue);
  updateSubmitButtonDisabled(starValue, review);
};

// ... (rest of your code)

return (
  // ...
  <p className="star-container"><b> Stars</b>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => handleStarClick(star)}
        className={rating >= star ? "star clicked" : "star"}
      >
        <i className="fa-solid fa-star" id='review-rating-star'></i>
      </span>
    ))}
  </p>
  // ...
);
