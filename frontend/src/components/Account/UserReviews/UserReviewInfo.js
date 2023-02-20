import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { removeReview } from "../../../store/reviews";


export default function UserReviewInfo (props) {
   const dispatch = useDispatch()
   const spot = useSelector(state => state.spots.allSpots[props.spotId])
   const history = useHistory()
   const [check, setCheck] = useState(true);
   const goToSpot = () => {
    history.push(`/spots/${spot.id}`);
  };
  console.log(spot)

  const deleteAReview = async () => {
    await dispatch(removeReview(props.id, props.spotId));
    setCheck(!check); // re-render the component after the review is deleted
}

  if(!props) return null
  return (
    <div style={{"display":"flex", "justifyContent":"space-between", "alignContent":"center", "gap":"40px", "borderBottom":"lightGray 1px solid"}}>
      <div>
        <h3 style={{"marginBottom":"0px"}}>{spot.name} - {props.stars} stars</h3>
        <p style={{"marginTop":"0px"}}>{props.review}</p>
      </div>
      <div style={{"display":"flex", "alignItems":"center", "gap":"10px"}}>
      <button onClick={goToSpot}>Go To Review</button>
      </div>
    </div>
  );
}
