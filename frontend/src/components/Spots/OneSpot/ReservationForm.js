import { useState } from "react"
import "./OneSpot.css"

export default function ReservationForm (spot) {
    const [ checkIn, setCheckIn ] = useState()
    const [ checkout, setCheckout ] = useState()
    const [ guest, setGuest ] = useState(1)
    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const futureDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 5}`
    const startDate = new Date(checkIn);
    const endDate = new Date(checkout);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const handleSubmit = (e) => {
        e.preventDefault()


    }
    return (
        <div className="form-container" style={{"paddingRight": "10px", "paddingLeft": "10px"}}>
            <div>
                <div className="sub-info">
                    <div><span style={{"fontWeight": "bold"}}>${spot.price}</span> night</div>
                    <div>
                        <span><i className="fa-sharp fa-solid fa-star"></i>{spot.avgStarRating} ·</span>
                        <span>{spot.numReviews} reviews</span>
                    </div>
                </div>
                <form
                onSubmit={handleSubmit}
                style={{"display":"flex","alignItems":"center", "flexDirection":"column"}}>
                    <div style={{"display":"flex"}}>
                    <label>
                        CHECK-IN
                        <input type={'date'}
                        name={'check-in'}
                        placeholder={'Add date'}
                        value={checkIn ? checkIn : today.toString()}
                        onChange={(e) => setCheckIn(e.target.value)}
                        />

                    </label>
                    <label>
                        CHECKOUT
                        <input type={'date'}
                        name={'checkout'}
                        placeholder={'Add date'}
                        value={checkout ? checkout : futureDate.toString()}
                        onChange={(e) => setCheckout(e.target.value)}
                        />
                    </label>
                    </div>
                    <label>
                        Number of Guests
                        <input type={'number'}
                        name={'guest'}
                        placeholder={'1 guest'}
                        value={guest}
                        onChange={(e) => setGuest(e.target.value)}
                        />
                    </label>
                    <button>Reserve</button>
                </form>
            </div>

            <div>
                You will not be charged yet
            </div>
            <section>
                <div>
                    {checkIn && checkout && (
                                              <>
                                              <div className="spacing">
                                                  <span>${spot.price} x {diffDays} nights</span>
                                                  <span>${spot.price * 5}</span>
                                              </div>
                                              <div className="spacing">
                                                <span>Cleaning Fee </span>
                                                <span>${35 * diffDays}</span>
                                            </div>
                                            <div className="spacing">
                                                <span>Service Fee </span>
                                                <span>${25 * diffDays}</span>
                                            </div>
                                          </>
                    )}
                </div>
            </section>
        </div>
    )
}
