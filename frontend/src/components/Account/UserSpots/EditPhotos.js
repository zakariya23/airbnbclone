import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSpotImage, deleteSpotImage, getSpotById } from '../../../store/spots';
import { useSelector } from 'react-redux';
import './EditPhotos.css'


const AddImageForm = ({ spotId }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [preview, setPreview] = useState(false);
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
      dispatch(getSpotById(spotId));
    }, [dispatch, spotId]);

    const handleDeleteImage = async (imageId) => {
      if (window.confirm('Are you sure you want to delete this image?')) {
        await dispatch(deleteSpotImage(spotId, imageId));
        dispatch(getSpotById(spotId));
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addSpotImage(spotId, imageUrl, preview));
        setImageUrl('');
        setPreview(false);
        dispatch(getSpotById(spotId));
      };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUrl">Image URL:</label>
      <input
        type="text"
        id="imageUrl"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <label htmlFor="preview">Main image?</label>
      <input
        type="checkbox"
        id="preview"
        checked={preview}
        onChange={(e) => setPreview(e.target.checked)}
      />
      <button type="submit">Add Image</button>
    </form>
    {spot?.SpotImages && (
        <div className="current-images">
          <h3>Current Images:</h3>
          {spot.SpotImages.map((image) => (
            <div key={image.id} className="image-container">
              <img src={image.url} alt="Spot" style={{"height":"100px", "width":"100px"}} />
              <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AddImageForm;
