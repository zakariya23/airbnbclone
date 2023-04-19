import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { updateSpot } from "../../../store/spots"
import AddImageForm from "./EditPhotos"
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY29tbWFuZGVyemVlIiwiYSI6ImNsZ255Y2pmZTA3OXAzbXFtNHB4aWp0bnMifQ.trObNVmB1uTEBgPkINgUfg';

export default function EditUserSpot () {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    // const user = useSelector(state => state.session.user)
    const spot = useSelector(state => state.spots.allSpots[id])
    const geocoderContainerRef = useRef();
    const [ address, setAddress ] = useState(spot.address)
    const [ city, setCity ] = useState(spot.city)
    const [ state, setState ] = useState(spot.state)
    const [ country, setCountry ] = useState(spot.country)
    const [ lat, setLat ] = useState(spot.lat)
    const [ lng, setLng ] = useState(spot.lng)
    const [ name, setName ] = useState(spot.name)
    const [ description, setDescription ] = useState(spot.description)
    const [ price, setPrice ] = useState(spot.price)
    // const [ imageNumber, setImageNumber ] = useState('')
    // const [ url, setURL ] = useState(spot.previewImage)
    // const [ spotImages ] = useState([])

    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateCountry = (e) => setCountry(e.target.value)
    const updateLat = (e) => setLat(e.target.value)
    const updateLng = (e) => setLng(e.target.value)
    const updateName = (e) => setName(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updatePrice = (e) => setPrice(e.target.value)
    // const updateImageNumber = (e) => setImageNumber(e.target.value)
    // const updateURL = (e) => setURL(e.target.value)
    const [ errors, setErrors ] = useState([])
    // const updateImageNumber = (e) => setImageNumber(e.target.value)
    // const updateURL = (e) => setURL(e.target.value)
    const [map, setMap] = useState(null);



    const clearData = (updatedSpot) => {
        setAddress('')
        setCity('')
        setState('')
        setCountry('')
        setName('')
        setDescription('')
        setPrice('')
        setErrors([])

        history.push(`/spots/${updatedSpot.id}`)
    }

    useEffect(() => {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          // Other options if needed
        });

        if (geocoderContainerRef.current) {
          geocoderContainerRef.current.appendChild(geocoder.onAdd());
        }
      }, []);

    useEffect(() => {
        if (spot) {
            setLoading(false);
        }

    }, [spot]);

    useEffect(() => {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          placeholder: 'Address',
          marker: false,
        });

        geocoder.on('result', (e) => {
            setAddress(e.result.place_name);
            setLat(e.result.geometry.coordinates[1]);
            setLng(e.result.geometry.coordinates[0]);
            geocoder.setInput(e.result.place_name);
          });

        // Add the geocoder to the "geocoder" div
        const geocoderDiv = document.getElementById('geocoder');
        if (geocoderDiv) {
          geocoderDiv.appendChild(geocoder.onAdd());
        }

        // Cleanup on unmount
        return () => {
          geocoderDiv.removeChild(geocoder.onRemove());
        };
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        }


        let updatedSpot = await dispatch(updateSpot(id, payload, spot.previewImage)).then(updatedSpot => clearData(updatedSpot)).catch(
            async (res) => {
                const data = await res.json();
                console.log(data)
                if (data && data.errors) setErrors(data.errors);
            });

        if(updatedSpot){
            history.push(`/spots/${updatedSpot.id}`)
            setAddress('')
            setCity('')
            setState('')
            setCountry('')
            setLat('')
            setLng('')
            setName('')
            setDescription('')
            setPrice('')
        }

    }
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <form className="create-spot-form" onSubmit={handleSubmit}>
            <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <h4>Update {spot.name}</h4>
                {/* <input style={{"borderRadius":"10px 10px 0px 0px"}}
                    type={'text'}
                    placeholder={'Address'}
                    required
                    value={address}
                    onChange={updateAddress}
                /> */}
          <div id="geocoder" style={{ marginBottom: '10px' }}></div>

                <input
                    type={'text'}
                    placeholder={'City'}
                    required
                    value={city}
                    onChange={updateCity}
                />
                <input
                    type={'text'}
                    placeholder={'State'}
                    required
                    value={state}
                    onChange={updateState}
                />
                <input
                    type={'text'}
                    placeholder={'Country'}
                    required
                    value={country}
                    onChange={updateCountry}
                />
                <input
                    type={'number'}
                    placeholder={'Latitude'}
                    value={lat}
                    onChange={updateLat}
                />
                <input
                    type={'number'}
                    placeholder={'Longitude'}
                    value={lng}
                    onChange={updateLng}
                />
                <input
                    type={'text'}
                    placeholder={'Name of House'}
                    required
                    value={name}
                    onChange={updateName}
                />
                <input
                    type={'text'}
                    placeholder={'Description'}
                    required
                    value={description}
                    onChange={updateDescription}
                />
                <input style={{"borderRadius":"0px 0px 10px 10px", "marginBottom": "10px"}}
                    type={'number'}
                    placeholder={'Price per night'}
                    required
                    value={price}
                    onChange={updatePrice}
                />

                <img src={spot.previewImage} style={{"height":"100px", "width":"100px"}}></img>
                <button className="submitButton">Submit</button>
            </form>
            <AddImageForm spotId={spot.id}/>
        </div>
    )
}
