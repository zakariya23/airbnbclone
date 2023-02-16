import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useHistory } from "react-router-dom";
import { removeReview } from "../../../store/reviews";


export default function UserReviewInfo(review) {
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.allSpots[review.spotId]);
  //const history = useHistory();



  const deleteReview = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const deletedReview = await dispatch(removeReview(review.id));

      if (deletedReview) alert(deletedReview.message);
    }
  };

  if (!review) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        gap: "40px",
        borderBottom: "lightGray 1px solid",
      }}
    >
      <div>
        <h3 style={{ marginBottom: "0px" }}>
          {spot.name} - {review.stars} stars
        </h3>
        <p style={{ marginTop: "0px" }}>{review.review}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={deleteReview}>Delete</button>
    </div>
    </div>
  );
}
