import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useHistory } from "react-router-dom";
import { removeReview } from "../../../store/reviews";


export default function UserReviewInfo(review) {
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.allSpots[review.spotId]);
  const [isDeleting, setIsDeleting] = useState(false);


  const deleteReview = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const deletedReview = await dispatch(removeReview(review.id));
      setIsDeleting(true);

      if (deletedReview) {
        alert(deletedReview.message);
      } else {
        // Remove the review from the UI after it has been successfully deleted
        setIsDeleting(false);
      }


    }
  };

  if (!review) return null;
  return (
    <div
      style={{
        display: "block",
        justifyContent: "space-between",
        alignContent: "center",
        gap: "40px",
        borderBottom: "lightGray 1px solid",
      }}
    >
         <div>
      {review.ReviewImages.length ? (
                <img style={{"height":"100px", "width":"100px"}} src={review.ReviewImages[0].url} alt={'pic'}/>
            ) : (null)}
      </div>
      <div>
        <h3 style={{ paddingRight: "10px" }}>
          {spot.name} - {review.stars} star(s)
        </h3>
        <p style={{ marginTop: "0px" }}>{review.review} </p>

      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {isDeleting ? (
          <span>Deleting...</span>
        ) : (
          <button onClick={deleteReview}>Delete</button>
        )}
    </div>
    </div>
  );
}
